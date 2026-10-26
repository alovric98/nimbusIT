import type { APIRoute } from 'astro';
import { publicRelease, site } from '../data/site';

export const GET: APIRoute = () => new Response(
  publicRelease
    ? `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n\n# Review build. Indexing must be explicitly approved before release.\n',
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
