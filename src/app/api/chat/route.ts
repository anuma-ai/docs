import { PORTAL_API_URL } from "@/lib/config";

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

  // In production (Cloudflare Workers), load from the bundled JSON asset.
  // In local dev, also load from the JSON file (run `pnpm ingest` first).
  const url = new URL("/docs-index.json", "http://localhost");
  try {
    // Try filesystem first (works in Node / local dev)
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.join(process.cwd(), "public/docs-index.json");
    const data = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(data);
    cachedIndex = parsed.entries ?? parsed;
    return cachedIndex!;
  } catch {
    // Fallback: fetch as a static asset (Cloudflare Workers)
    const res = await fetch(new URL("/docs-index.json", url));
    const parsed = await res.json();
    cachedIndex = parsed.entries ?? parsed;
    return cachedIndex!;
  }
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

  const res = await fetch(`${PORTAL_API_URL}/api/v1/embeddings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: text }),
  });

  if (!res.ok) {
    throw new Error(`Embeddings API error: ${res.status}`);
  }

  const data = (await res.json()) as {
    data: Array<{ embedding: number[] }>;
  };
  return data.data[0].embedding;
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, history } = body as {
      message: string;
      history?: Array<{ role: string; content: string }>;
    };

    if (!message || typeof message !== "string") {
      return Response.json({ error: "message is required" }, { status: 400 });
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
    const messages = [
      { role: "system", content: systemMessage },
      ...(history || []),
      { role: "user", content: message },
    ];

    // 5. Stream from Portal API
    const portalRes = await fetch(
      `${PORTAL_API_URL}/api/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
        body: JSON.stringify({
          model: CHAT_MODEL,
          messages,
          stream: true,
        }),
      },
    );

    if (!portalRes.ok) {
      const errorText = await portalRes.text();
      return Response.json(
        { error: `LLM error: ${portalRes.status} ${errorText}` },
        { status: 502 },
      );
    }

    // 6. Forward the SSE stream, extracting content deltas
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = portalRes.body!.getReader();

        // Send sources metadata as the first message
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

        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const payload = line.slice(6).trim();
              if (payload === "[DONE]") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                continue;
              }
              try {
                const parsed = JSON.parse(payload);
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) {
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ type: "content", content: delta })}\n\n`,
                    ),
                  );
                }
              } catch {
                // skip malformed chunks
              }
            }
          }
        } finally {
          controller.close();
        }
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
