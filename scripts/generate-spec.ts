import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateFiles } from "fumadocs-openapi";
import { openapi } from "@/lib/openapi";

const OUTPUT_DIR = "./content/docs/api";
const META_CONTENT = {
  title: "API",
  description: "API reference",
  root: true,
};

async function main() {
  await generateFiles({
    input: openapi,
    output: OUTPUT_DIR,
    // we recommend to enable it
    // make sure your endpoint description doesn't break MDX syntax.
    includeDescription: true,
  });

  const resolvedOutputDir = path.resolve(process.cwd(), OUTPUT_DIR);
  await mkdir(resolvedOutputDir, { recursive: true });

  const metaPath = path.join(resolvedOutputDir, "meta.json");
  await writeFile(metaPath, `${JSON.stringify(META_CONTENT, null, 2)}\n`);
}

void main();
