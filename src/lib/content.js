import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "src/content");
const BASE_URL = "https://docs.anuma.ai";

/**
 * Recursively find all .mdx and .md content files, excluding _meta.js files.
 */
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

/**
 * Convert a file path to a URL path.
 * e.g. src/content/memory/engine.mdx -> /memory/engine
 */
function filePathToUrlPath(filePath) {
  let relative = path.relative(CONTENT_DIR, filePath);
  relative = relative.replace(/\.(mdx?|md)$/, "");
  if (relative.endsWith("/index") || relative === "index") {
    relative = relative.replace(/\/?index$/, "");
  }
  return "/" + relative;
}

/**
 * Extract the first # heading from file content as the title.
 */
function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

/**
 * Strip MDX-specific syntax (imports, JSX components, export statements)
 * to produce plain markdown text.
 */
function stripMdx(content) {
  return content
    .replace(/^import\s+.*$/gm, "")
    .replace(/^export\s+.*$/gm, "")
    .replace(/<[A-Z][a-zA-Z]*\b[^>]*\/>/g, "")
    .replace(/<[A-Z][a-zA-Z]*\b[^>]*>[\s\S]*?<\/[A-Z][a-zA-Z]*>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Get all content pages with metadata.
 * Returns array of { urlPath, title, content, depth }
 */
export function getContentPages({ includeContent = false, exclude = [] } = {}) {
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
    .filter((page) => !exclude.some((pattern) => page.urlPath.startsWith(pattern)))
    .sort((a, b) => a.urlPath.localeCompare(b.urlPath));
}

/**
 * Categorize pages into sections derived from top-level content directories.
 * Reads _meta.js for section titles where available.
 * Returns an ordered array of { title, pages } objects.
 */
export function getPagesBySection() {
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

function loadMeta(dir) {
  const metaPath = path.join(dir, "_meta.js");
  if (!fs.existsSync(metaPath)) return {};
  const src = fs.readFileSync(metaPath, "utf-8");
  const fn = new Function(src.replace("export default", "return"));
  return fn();
}

export { BASE_URL };
