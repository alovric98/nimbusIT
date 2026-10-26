import { writeFile } from 'node:fs/promises';
import { defineConfig } from 'astro/config';

// Review build unless PUBLIC_RELEASE=true; keep in sync with src/data/site.ts.
const publicRelease = process.env.PUBLIC_RELEASE === 'true';

// Static-host response headers, generated so the noindex header follows the release switch.
// In a release, *.pages.dev aliases stay noindex so only nimbusit.hr is indexed.
const headers = `/*
${publicRelease ? '' : '  X-Robots-Tag: noindex, nofollow, noarchive\n'}  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
${publicRelease ? '\nhttps://:project.pages.dev/*\n  X-Robots-Tag: noindex, nofollow, noarchive\n' : ''}`;

export default defineConfig({
  site: 'https://nimbusit.hr',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  integrations: [{
    name: 'static-headers',
    hooks: { 'astro:build:done': ({ dir }) => writeFile(new URL('_headers', dir), headers) },
  }],
});
