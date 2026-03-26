import { postApiV1Embeddings } from "@anuma/sdk/client";
import { runToolLoop } from "@anuma/sdk/server";

const EMBEDDING_MODEL =
  "fireworks/accounts/fireworks/models/qwen3-embedding-8b";
const CHAT_MODEL = "fireworks/accounts/fireworks/models/kimi-k2p5";

const SYSTEM_PROMPT = `You are a helpful assistant that answers questions about Anuma documentation. Use the following documentation excerpts to answer the user's question. If the answer isn't in the provided context, say so. Always be accurate and cite which section the information comes from.

When referencing a documentation page, always format it as a markdown link using the source path provided in each excerpt's header, like [Page Title](/path/to/page). Source paths never have file extensions — do not add .md or .mdx to links.`;

// ---------------------------------------------------------------------------
// Vector index (loaded once, cached in module scope)
// ---------------------------------------------------------------------------

interface IndexEntry {
  content: string;
  source: string;
  heading: string;
  embedding: number[];
}

let cachedIndex: IndexEntry[] | null = null;

async function loadIndex(): Promise<IndexEntry[]> {
  if (cachedIndex) return cachedIndex;

  let jsonRaw: string;
  let binBuffer: ArrayBuffer;

  try {
    // Node.js / local dev: read from filesystem
    const fs = await import("fs");
    const path = await import("path");
    const base = path.join(process.cwd(), "public");
    jsonRaw = fs.readFileSync(path.join(base, "docs-index.json"), "utf-8");
    const buf = fs.readFileSync(path.join(base, "docs-index.bin"));
    binBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  } catch {
    // Cloudflare Workers: read from R2 bucket
    const { env } = await (await import("@opennextjs/cloudflare")).getCloudflareContext({ async: true });
    const [jsonObj, binObj] = await Promise.all([
      (env as any).DOCS_INDEX.get("docs-index.json"),
      (env as any).DOCS_INDEX.get("docs-index.bin"),
    ]);
    if (!jsonObj) throw new Error("docs-index.json not found in R2");
    if (!binObj) throw new Error("docs-index.bin not found in R2");
    jsonRaw = await jsonObj.text();
    binBuffer = await binObj.arrayBuffer();
  }

  const parsed = JSON.parse(jsonRaw);
  const dimensions: number = parsed.dimensions;
  const entries: Array<Omit<IndexEntry, "embedding">> = parsed.entries;
  const floats = new Float32Array(binBuffer);

  cachedIndex = entries.map((entry, i) => ({
    ...entry,
    embedding: Array.from(floats.subarray(i * dimensions, (i + 1) * dimensions)),
  }));
  return cachedIndex!;
}

// ---------------------------------------------------------------------------
// Cosine similarity
// ---------------------------------------------------------------------------

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

// ---------------------------------------------------------------------------
// Embedding
// ---------------------------------------------------------------------------

async function embedQuery(text: string): Promise<number[]> {
  const apiKey = process.env.ANUMA_API_KEY;
  if (!apiKey) throw new Error("ANUMA_API_KEY not set");

  const { data, error } = await postApiV1Embeddings({
    body: { model: EMBEDDING_MODEL, input: text },
    headers: { "X-API-Key": apiKey },
  });

  if (error || !data) {
    throw new Error(`Embeddings API error: ${JSON.stringify(error)}`);
  }

  return (data as any).data[0].embedding;
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }
    const { message, history } = body as {
      message: string;
      history?: Array<{ role: string; content: string }>;
    };

    if (!message || typeof message !== "string" || message.length > 2000) {
      return Response.json({ error: "message is required and must be under 2000 characters" }, { status: 400 });
    }

    const MAX_HISTORY_TURNS = 20;
    const MAX_HISTORY_CHARS = 20_000;
    const safeHistory = (history ?? [])
      .slice(-MAX_HISTORY_TURNS)
      .filter(
        (m) =>
          typeof m.role === "string" &&
          typeof m.content === "string" &&
          ["user", "assistant"].includes(m.role),
      );
    const historyText = safeHistory.map((m) => m.content).join("");
    if (historyText.length > MAX_HISTORY_CHARS) {
      return Response.json({ error: "History too large" }, { status: 400 });
    }

    const apiKey = process.env.ANUMA_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "Server not configured" }, { status: 500 });
    }

    // 1. Embed the query
    const queryEmbedding = await embedQuery(message);

    // 2. Search the index
    const index = await loadIndex();
    const scored = index.map((entry) => ({
      ...entry,
      score: cosineSimilarity(queryEmbedding, entry.embedding),
    }));
    scored.sort((a, b) => b.score - a.score);
    const topChunks = scored.slice(0, 5);

    // 3. Build context
    const contextBlock = topChunks
      .map(
        (c) =>
          `### ${c.heading || "Untitled"} (${c.source})\n\n${c.content}`,
      )
      .join("\n\n---\n\n");

    const systemMessage = `${SYSTEM_PROMPT}\n\n## Relevant documentation\n\n${contextBlock}`;

    // 4. Build messages array
    const messages: Array<{ role: string; content: string }> = [
      { role: "system", content: systemMessage },
      ...safeHistory,
      { role: "user", content: message },
    ];

    // 5. Stream via runToolLoop
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Send sources metadata first
        const sources = topChunks.map((c) => ({
          source: c.source,
          heading: c.heading,
          score: Math.round(c.score * 100) / 100,
        }));
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "sources", sources })}\n\n`,
          ),
        );

        const { error } = await runToolLoop({
          messages: messages as any,
          model: CHAT_MODEL,
          headers: { "X-API-Key": apiKey },
          onData: (chunk) => {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "content", content: chunk })}\n\n`,
              ),
            );
          },
        });

        if (error) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", error })}\n\n`,
            ),
          );
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err: any) {
    console.error("Chat API error:", err);
    return Response.json(
      { error: err.message || "Internal error" },
      { status: 500 },
    );
  }
}
