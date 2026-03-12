import { getPagesBySection, BASE_URL } from "../../lib/content";

export const dynamic = "force-static";

export function GET() {
  const sections = getPagesBySection();

  const sectionBlocks = sections.map(({ title, pages }) => {
    const lines = pages.map((p) => `- [${p.title}](${BASE_URL}${p.urlPath})`);
    return `## ${title}\n\n${lines.join("\n")}`;
  });

  const body = [
    "# Anuma Developer Platform",
    "",
    "> Documentation for the Anuma Developer Platform. Build AI apps with multi-model chat, persistent memory, streaming, and tools — one SDK across OpenAI, Anthropic, Google, xAI, and open-source models.",
    "",
    ...sectionBlocks.flatMap((block) => [block, ""]),
    "## Links",
    "",
    "- [Anuma Website](https://www.anuma.ai)",
    "- [Anuma Web App](https://chat.anuma.ai)",
    "- [Developer Dashboard](https://dashboard.anuma.ai)",
    "- [GitHub](https://github.com/anuma-ai)",
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
