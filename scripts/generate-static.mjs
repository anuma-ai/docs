/**
 * Generate static sitemap.xml, llms.txt, and llms-full.txt files in public/.
 * Run as part of the postbuild step so the content directory is available.
 */
import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "src/content");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const BASE_URL = "https://docs.anuma.ai";
const SITE_NAME = "Anuma Developer Platform";
const SITE_DESCRIPTION =
  "Documentation for the Anuma Developer Platform. Build AI apps with multi-model chat, persistent memory, streaming, and tools — one SDK across OpenAI, Anthropic, Google, xAI, and open-source models.";
const SITE_LINKS = {
  website: "https://www.anuma.ai",
  app: "https://chat.anuma.ai",
  dashboard: "https://dashboard.anuma.ai",
  github: "https://github.com/anuma-ai",
};

function findContentFiles(dir, files = []) {
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

function filePathToUrlPath(filePath) {
  let relative = path.relative(CONTENT_DIR, filePath);
  relative = relative.replace(/\.(mdx?|md)$/, "");
  if (relative.endsWith("/index") || relative === "index") {
    relative = relative.replace(/\/?index$/, "");
  }
  return "/" + relative;
}

function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

function stripMdx(content) {
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

function loadMeta(dir) {
  const metaPath = path.join(dir, "_meta.js");
  if (!fs.existsSync(metaPath)) return {};
  const src = fs.readFileSync(metaPath, "utf-8");
  const fn = new Function(src.replace("export default", "return"));
  return fn();
}

function getContentPages({ includeContent = false } = {}) {
  const files = findContentFiles(CONTENT_DIR);
  return files
    .map((filePath) => {
      const raw = fs.readFileSync(filePath, "utf-8");
      const urlPath = filePathToUrlPath(filePath);
      const title = extractTitle(raw) || path.basename(filePath, path.extname(filePath));
      const depth = urlPath === "/" ? 0 : urlPath.split("/").length - 1;
      return {
        urlPath,
        title,
        depth,
        ...(includeContent ? { content: stripMdx(raw) } : {}),
      };
    })
    .sort((a, b) => a.urlPath.localeCompare(b.urlPath));
}

function getPagesBySection() {
  const pages = getContentPages();
  const topLevelDirs = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  const rootMeta = loadMeta(CONTENT_DIR);
  const sectionMap = new Map();
  sectionMap.set("", { title: "Overview", pages: [] });
  for (const dir of topLevelDirs) {
    const metaEntry = rootMeta[dir];
    const title =
      typeof metaEntry === "string"
        ? metaEntry
        : metaEntry?.title || dir.charAt(0).toUpperCase() + dir.slice(1);
    sectionMap.set("/" + dir, { title, pages: [] });
  }

  for (const page of pages) {
    const topSegment = page.urlPath.split("/").slice(0, 2).join("/");
    const section = sectionMap.get(topSegment) || sectionMap.get("");
    section.pages.push(page);
  }

  return [...sectionMap.values()].filter((s) => s.pages.length > 0);
}

// --- Generate sitemap.xml ---
function generateSitemap() {
  const pages = getContentPages();

  function getPriority(depth) {
    if (depth === 0) return 1.0;
    if (depth === 1) return 0.8;
    return 0.7;
  }

  const urls = pages
    .map(
      ({ urlPath, depth }) => `  <url>
    <loc>${BASE_URL}${urlPath}</loc>
    <changefreq>weekly</changefreq>
    <priority>${getPriority(depth)}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

// --- Generate llms.txt ---
function generateLlmsTxt() {
  const sections = getPagesBySection();

  const sectionBlocks = sections.map(({ title, pages }) => {
    const lines = pages.map((p) => `- [${p.title}](${BASE_URL}${p.urlPath})`);
    return `## ${title}\n\n${lines.join("\n")}`;
  });

  return [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    ...sectionBlocks.flatMap((block) => [block, ""]),
    "## Links",
    "",
    `- [Anuma Website](${SITE_LINKS.website})`,
    `- [Anuma Web App](${SITE_LINKS.app})`,
    `- [Developer Dashboard](${SITE_LINKS.dashboard})`,
    `- [GitHub](${SITE_LINKS.github})`,
    "",
  ].join("\n");
}

// --- Generate llms-full.txt ---
function generateLlmsFullTxt() {
  const pages = getContentPages({ includeContent: true });

  const header = [
    `# ${SITE_NAME} — Full Documentation for LLMs`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `Website: ${SITE_LINKS.website}`,
    `Documentation: ${BASE_URL}`,
    `Developer Dashboard: ${SITE_LINKS.dashboard}`,
    `GitHub: ${SITE_LINKS.github}`,
    "",
  ].join("\n");

  const sections = pages
    .map((page) => {
      const url = `${BASE_URL}${page.urlPath}`;
      return `---\nSource: ${url}\n\n${page.content}`;
    })
    .join("\n\n");

  return header + "\n" + sections + "\n";
}

// --- Write files ---
fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap.xml"), generateSitemap());
fs.writeFileSync(path.join(PUBLIC_DIR, "llms.txt"), generateLlmsTxt());
fs.writeFileSync(path.join(PUBLIC_DIR, "llms-full.txt"), generateLlmsFullTxt());

console.log("Generated sitemap.xml, llms.txt, and llms-full.txt in public/");
