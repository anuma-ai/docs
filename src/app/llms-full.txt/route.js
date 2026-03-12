import { getContentPages, BASE_URL } from "../../lib/content";

export const dynamic = "force-static";

export function GET() {
  const pages = getContentPages({ includeContent: true });

  const header = [
    "# Anuma Developer Platform — Full Documentation for LLMs",
    "",
    "> Documentation for the Anuma Developer Platform. Build AI apps with multi-model chat, persistent memory, streaming, and tools — one SDK across OpenAI, Anthropic, Google, xAI, and open-source models.",
    "",
    "Website: https://www.anuma.ai",
    "Documentation: https://docs.anuma.ai",
    "Developer Dashboard: https://dashboard.anuma.ai",
    "GitHub: https://github.com/anuma-ai",
    "",
  ].join("\n");

  const sections = pages
    .map((page) => {
      const url = `${BASE_URL}${page.urlPath}`;
      return `---\nSource: ${url}\n\n${page.content}`;
    })
    .join("\n\n");

  const body = header + "\n" + sections + "\n";

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
