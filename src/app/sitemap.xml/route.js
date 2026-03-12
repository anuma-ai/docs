import { getContentPages, BASE_URL } from "../../lib/content";

export const dynamic = "force-static";

function getPriority(depth) {
  if (depth === 0) return 1.0;
  if (depth === 1) return 0.8;
  return 0.7;
}

export function GET() {
  const pages = getContentPages();

  const urls = pages
    .map(
      ({ urlPath, depth }) => `  <url>
    <loc>${BASE_URL}${urlPath}</loc>
    <changefreq>weekly</changefreq>
    <priority>${getPriority(depth)}</priority>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
