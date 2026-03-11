export function GET() {
  const body = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /_pagefind/

Sitemap: https://docs.anuma.ai/sitemap.xml
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
