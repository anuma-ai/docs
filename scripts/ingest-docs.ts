/**
 * Ingest documentation MDX files into a JSON index with embeddings.
 *
 * Reads all MDX/MD files from src/content/, chunks them by heading,
 * generates embeddings via the Portal API, and writes the result to
 * public/docs-index.json for use by the chat API route.
 *
 * Usage: npx tsx scripts/ingest-docs.ts
 */
import fs from "fs";
import path from "path";

// Load .env file so `pnpm ingest` picks up ANUMA_API_KEY automatically.
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const match = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2];
    }
  }
}

const CONTENT_DIR = path.join(process.cwd(), "src/content");
const OUTPUT_PATH = path.join(process.cwd(), "public/docs-index.json");
const PORTAL_API_URL =
  process.env.PORTAL_API_URL || "https://portal.anuma-dev.ai";
const API_KEY = process.env.ANUMA_API_KEY;
const EMBEDDING_MODEL = "fireworks/accounts/fireworks/models/qwen3-embedding-8b";
const CHUNK_TOKEN_LIMIT = 500;
const CHUNK_OVERLAP_TOKENS = 50;

if (!API_KEY) {
  console.error("ANUMA_API_KEY environment variable is required");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// File discovery and MDX stripping (mirrors generate-static.mjs)
// ---------------------------------------------------------------------------

function findContentFiles(dir: string, files: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findContentFiles(fullPath, files);
    } else if (/\.(mdx?|md)$/.test(entry.name) && !entry.name.startsWith("_")) {
      files.push(fullPath);
    }
  }
  return files;
}

function stripMdx(content: string): string {
  const codeBlockRegex = /(```[\s\S]*?```)/g;
  const parts = content.split(codeBlockRegex);
  const processed = parts.map((part) => {
    if (part.startsWith("```")) return part;
    return part
      .replace(/^import\s+.*$/gm, "")
      .replace(/^export\s+.*$/gm, "")
      .replace(/<[A-Z][a-zA-Z]*\b[^>]*\/>/g, "")
      .replace(/<[A-Z][a-zA-Z]*\b[^>]*>[\s\S]*?<\/[A-Z][a-zA-Z]*>/g, "");
  });
  return processed.join("").replace(/\n{3,}/g, "\n\n").trim();
}

function filePathToUrlPath(filePath: string): string {
  let relative = path.relative(CONTENT_DIR, filePath);
  relative = relative.replace(/\.(mdx?|md)$/, "");
  if (relative.endsWith("/index") || relative === "index") {
    relative = relative.replace(/\/?index$/, "");
  }
  return "/" + relative;
}

// ---------------------------------------------------------------------------
// Chunking
// ---------------------------------------------------------------------------

interface Chunk {
  content: string;
  source: string;
  heading: string;
}

/** Rough token count — split on whitespace. Good enough for chunking. */
function tokenCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Split a single section into smaller pieces if it exceeds the token limit.
 * Returns chunks with ~CHUNK_OVERLAP_TOKENS overlap between consecutive pieces.
 */
function splitSection(
  text: string,
  source: string,
  heading: string,
): Chunk[] {
  const tokens = text.split(/\s+/).filter(Boolean);
  if (tokens.length <= CHUNK_TOKEN_LIMIT) {
    return text.trim() ? [{ content: text.trim(), source, heading }] : [];
  }

  const chunks: Chunk[] = [];
  let start = 0;
  while (start < tokens.length) {
    const end = Math.min(start + CHUNK_TOKEN_LIMIT, tokens.length);
    const slice = tokens.slice(start, end).join(" ");
    if (slice.trim()) {
      chunks.push({ content: slice.trim(), source, heading });
    }
    start = end - CHUNK_OVERLAP_TOKENS;
    if (start >= tokens.length) break;
    // Avoid infinite loop for very small remaining
    if (end === tokens.length) break;
  }
  return chunks;
}

/**
 * Chunk a document by heading, then split oversized sections.
 */
function chunkDocument(content: string, filePath: string): Chunk[] {
  const source = filePathToUrlPath(filePath);
  const lines = content.split("\n");
  const sections: { heading: string; lines: string[] }[] = [];
  let currentHeading = "";
  let currentLines: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      if (currentLines.length > 0) {
        sections.push({ heading: currentHeading, lines: currentLines });
      }
      currentHeading = headingMatch[2].trim();
      currentLines = [line];
    } else {
      currentLines.push(line);
    }
  }
  if (currentLines.length > 0) {
    sections.push({ heading: currentHeading, lines: currentLines });
  }

  const chunks: Chunk[] = [];
  for (const section of sections) {
    const text = section.lines.join("\n").trim();
    if (!text) continue;
    chunks.push(...splitSection(text, source, section.heading));
  }
  return chunks;
}

// ---------------------------------------------------------------------------
// Embeddings
// ---------------------------------------------------------------------------

async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const batchSize = 500;
  const allEmbeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const response = await fetch(`${PORTAL_API_URL}/api/v1/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY!,
      },
      body: JSON.stringify({
        model: EMBEDDING_MODEL,
        input: batch,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Embeddings API error (${response.status}): ${errorText}`,
      );
    }

    const data = (await response.json()) as {
      data: Array<{ embedding: number[] }>;
    };
    allEmbeddings.push(...data.data.map((d) => d.embedding));

    if (i + batchSize < texts.length) {
      console.log(
        `  Embedded ${Math.min(i + batchSize, texts.length)}/${texts.length} chunks...`,
      );
    }
  }

  return allEmbeddings;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

interface IndexEntry {
  content: string;
  source: string;
  heading: string;
  embedding: number[];
}

async function main() {
  console.log("Finding content files...");
  const files = findContentFiles(CONTENT_DIR);
  console.log(`Found ${files.length} files`);

  // Filter out auto-generated SDK internal type docs — they pollute search
  // results with low-value API type definitions.
  const filtered = files.filter((f) => !f.includes("/Internal/"));
  console.log(`Filtered to ${filtered.length} files (excluded ${files.length - filtered.length} auto-generated)`);

  console.log("Chunking documents...");
  const allChunks: Chunk[] = [];
  for (const file of filtered) {
    const raw = fs.readFileSync(file, "utf-8");
    const cleaned = stripMdx(raw);
    const chunks = chunkDocument(cleaned, file);
    allChunks.push(...chunks);
  }
  console.log(`Created ${allChunks.length} chunks`);

  console.log("Generating embeddings...");
  const embeddings = await generateEmbeddings(
    allChunks.map((c) => c.content),
  );

  const index: IndexEntry[] = allChunks.map((chunk, i) => ({
    content: chunk.content,
    source: chunk.source,
    heading: chunk.heading,
    embedding: embeddings[i],
  }));

  const output = {
    generatedAt: new Date().toISOString(),
    entries: index,
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output));
  console.log(`Wrote ${index.length} entries to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});
