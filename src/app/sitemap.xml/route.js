const BASE_URL = 'https://docs.anuma.ai';

const pages = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  // Core Concepts
  { path: '/authentication', priority: 0.8, changefreq: 'weekly' },
  { path: '/conversations', priority: 0.8, changefreq: 'weekly' },
  { path: '/streaming', priority: 0.8, changefreq: 'weekly' },
  { path: '/files', priority: 0.8, changefreq: 'weekly' },
  { path: '/memory', priority: 0.8, changefreq: 'weekly' },
  { path: '/memory/engine', priority: 0.7, changefreq: 'weekly' },
  { path: '/memory/vault', priority: 0.7, changefreq: 'weekly' },
  { path: '/tools/overview', priority: 0.8, changefreq: 'weekly' },
  { path: '/tools/server', priority: 0.7, changefreq: 'weekly' },
  { path: '/tools/client', priority: 0.7, changefreq: 'weekly' },
  { path: '/tools/list', priority: 0.7, changefreq: 'weekly' },
  { path: '/models/overview', priority: 0.8, changefreq: 'weekly' },
  { path: '/models/list', priority: 0.7, changefreq: 'weekly' },
  // Tutorials
  { path: '/tutorials/quickstart', priority: 0.9, changefreq: 'weekly' },
  { path: '/tutorials/quickstart/setup', priority: 0.8, changefreq: 'weekly' },
  { path: '/tutorials/quickstart/streaming', priority: 0.8, changefreq: 'weekly' },
  { path: '/tutorials/nextjs', priority: 0.8, changefreq: 'weekly' },
  { path: '/tutorials/telegram', priority: 0.8, changefreq: 'weekly' },
  { path: '/tutorials/agent', priority: 0.8, changefreq: 'weekly' },
  // SDK Reference
  { path: '/sdk/react', priority: 0.7, changefreq: 'weekly' },
  { path: '/sdk/next', priority: 0.7, changefreq: 'weekly' },
  { path: '/sdk/expo', priority: 0.7, changefreq: 'weekly' },
  { path: '/sdk/vercel', priority: 0.7, changefreq: 'weekly' },
  { path: '/sdk/client', priority: 0.7, changefreq: 'weekly' },
  // CLI
  { path: '/cli', priority: 0.6, changefreq: 'weekly' },
  { path: '/cli/reference', priority: 0.6, changefreq: 'weekly' },
];

export function GET() {
  const urls = pages
    .map(
      ({ path, priority, changefreq }) => `  <url>
    <loc>${BASE_URL}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
