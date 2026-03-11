const BASE_URL = 'https://docs.anuma.ai';

const pages = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  // Core Concepts
  { path: '/authentication', priority: 0.8, changefreq: 'monthly' },
  { path: '/conversations', priority: 0.8, changefreq: 'monthly' },
  { path: '/streaming', priority: 0.8, changefreq: 'monthly' },
  { path: '/files', priority: 0.8, changefreq: 'monthly' },
  { path: '/memory', priority: 0.8, changefreq: 'monthly' },
  { path: '/memory/engine', priority: 0.7, changefreq: 'monthly' },
  { path: '/memory/vault', priority: 0.7, changefreq: 'monthly' },
  { path: '/tools', priority: 0.8, changefreq: 'monthly' },
  { path: '/tools/overview', priority: 0.7, changefreq: 'monthly' },
  { path: '/tools/server', priority: 0.7, changefreq: 'monthly' },
  { path: '/tools/client', priority: 0.7, changefreq: 'monthly' },
  { path: '/tools/list', priority: 0.7, changefreq: 'monthly' },
  { path: '/models/overview', priority: 0.8, changefreq: 'monthly' },
  { path: '/models/list', priority: 0.7, changefreq: 'monthly' },
  // Tutorials
  { path: '/tutorials/quickstart', priority: 0.9, changefreq: 'monthly' },
  { path: '/tutorials/quickstart/setup', priority: 0.8, changefreq: 'monthly' },
  { path: '/tutorials/quickstart/streaming', priority: 0.8, changefreq: 'monthly' },
  { path: '/tutorials/nextjs', priority: 0.8, changefreq: 'monthly' },
  { path: '/tutorials/telegram', priority: 0.8, changefreq: 'monthly' },
  { path: '/tutorials/agent', priority: 0.8, changefreq: 'monthly' },
  // SDK Reference
  { path: '/sdk/react', priority: 0.7, changefreq: 'monthly' },
  { path: '/sdk/next', priority: 0.7, changefreq: 'monthly' },
  { path: '/sdk/expo', priority: 0.7, changefreq: 'monthly' },
  { path: '/sdk/vercel', priority: 0.7, changefreq: 'monthly' },
  { path: '/sdk/client', priority: 0.7, changefreq: 'monthly' },
  // CLI
  { path: '/cli', priority: 0.6, changefreq: 'monthly' },
  { path: '/cli/reference', priority: 0.6, changefreq: 'monthly' },
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
