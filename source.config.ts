import type { Plugin } from "unified";
import type { Link } from "mdast";
import { visit } from "unist-util-visit";
import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config";

const rewriteRelativeMarkdownLinks: Plugin = () => {
  return (tree) => {
    visit(tree, "link", (node: Link) => {
      const original = node.url;
      if (!original) return;
      if (original.startsWith("http://") || original.startsWith("https://")) {
        return;
      }
      if (original.startsWith("#") || original.startsWith("/")) {
        return;
      }

      const [url, hash] = original.split("#");
      if (!url) return;

      const markdownMatch = url.match(/^(.*)(\.mdx?)$/);
      if (!markdownMatch) return;

      let rewritten = markdownMatch[1];
      if (!rewritten.startsWith(".") && !rewritten.startsWith("/")) {
        rewritten = `./${rewritten}`;
      }

      node.url = hash ? `${rewritten}#${hash}` : rewritten;
    });
  };
};

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: frontmatterSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [rewriteRelativeMarkdownLinks],
  },
});
