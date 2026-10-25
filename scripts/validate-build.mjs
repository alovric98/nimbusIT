import assert from 'node:assert/strict';
import { readFile, stat, readdir } from 'node:fs/promises';
import { join } from 'node:path';

// Verify the generated site, independently of the route implementation.
const pairs = [
  ['/', '/en/'], ['/leistungen/', '/en/services/'],
  ['/ueber-uns/', '/en/about/'], ['/kontakt/', '/en/contact/'],
  ['/impressum/', '/en/imprint/'], ['/datenschutz/', '/en/privacy/'],
];
const expectedRoutes = pairs.flat();
const origin = 'https://nimbusit.hr';
const html = new Map(await Promise.all(expectedRoutes.map(async route => [route, await readFile(join('dist', route, 'index.html'), 'utf8')])));
const titles = new Set();
const descriptions = new Set();
let links = 0;

function attrs(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(match => [match[1], match[2]]));
}
for (const [route, page] of html) {
  const lang = route.startsWith('/en/') ? 'en' : 'de';
  assert.match(page, new RegExp(`<html lang="${lang}"`), `${route}: language`);
  assert.equal((page.match(/<h1(?:\s|>)/g) || []).length, 1, `${route}: exactly one h1`);
  assert.equal((page.match(/<main(?:\s|>)/g) || []).length, 1, `${route}: one main landmark`);
  let previousHeading = 0;
  for (const [, level] of page.matchAll(/<h([1-6])(?:\s|>)/g)) {
    assert.ok(Number(level) <= previousHeading + 1, `${route}: skipped heading level`);
    previousHeading = Number(level);
  }
  const title = page.match(/<title>(.*?)<\/title>/)?.[1];
  assert.ok(title && title.includes('Nimbus IT'), `${route}: branded title`);
  assert.ok(!titles.has(title), `${route}: unique title`);
  titles.add(title);
  const metas = [...page.matchAll(/<meta\s[^>]*>/g)].map(match => attrs(match[0]));
  const description = metas.find(meta => meta.name === 'description')?.content;
  assert.ok(description && description.length > 40, `${route}: description`);
  assert.ok(!descriptions.has(description), `${route}: unique description`);
  descriptions.add(description);
  assert.equal(metas.find(meta => meta.name === 'robots')?.content, 'noindex, nofollow, noarchive', `${route}: preview indexing protection`);
  assert.equal(metas.find(meta => meta.name === 'viewport')?.content, 'width=device-width, initial-scale=1', `${route}: responsive viewport`);
  const headLinks = [...page.matchAll(/<link\s[^>]*>/g)].map(match => attrs(match[0]));
  assert.equal(headLinks.find(link => link.rel === 'canonical')?.href, origin + route, `${route}: canonical`);
  const pair = pairs.find(pair => pair.includes(route));
  for (const [locale, target] of [['de', pair[0]], ['en', pair[1]], ['x-default', pair[0]]]) {
    assert.equal(headLinks.find(link => link.hreflang === locale)?.href, origin + target, `${route}: ${locale} alternate`);
  }
  assert.doesNotMatch(page, /<script\b|<form\b|<iframe\b/, `${route}: static preview without scripts, forms or embeds`);
  const ids = [...page.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${route}: unique IDs`);
  for (const [, href] of page.matchAll(/\bhref="([^"]+)"/g)) {
    const url = new URL(href.replaceAll('&amp;', '&'), origin + route);
    if (url.origin !== origin) throw new Error(`${route}: unexpected external dependency/link ${href}`);
    if (url.pathname.endsWith('/')) {
      assert.ok(html.has(url.pathname), `${route}: missing route ${url.pathname}`);
      if (url.hash) assert.ok(html.get(url.pathname).includes(`id="${url.hash.slice(1)}"`), `${route}: missing anchor ${href}`);
    } else {
      assert.ok((await stat(join('dist', url.pathname))).isFile(), `${route}: missing asset ${href}`);
    }
    links++;
  }
  const nav = page.match(/<nav class="language-nav"[\s\S]*?<\/nav>/)?.[0];
  for (const target of pair) assert.ok(nav?.includes(`href="${target}"`), `${route}: contextual language switch`);
  if (/impressum|datenschutz|imprint|privacy/.test(route)) assert.match(page, /draft-notice/, `${route}: legal draft notice`);
  if (/kontakt|contact/.test(route)) assert.match(page, /contact-preview/, `${route}: explicit contact preview`);
}

const homepageText = html.get('/').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
assert.ok(homepageText.includes('Infrastruktur automatisieren. IT-Teams entlasten.'), 'Approved German headline');
assert.ok(homepageText.includes('Nimbus IT unterstützt IT-Dienstleister bei der Automatisierung wiederkehrender Aufgaben und der Umsetzung von Windows- und Cloud-Infrastrukturprojekten.'), 'Approved German description');
assert.match(await readFile('dist/robots.txt', 'utf8'), /User-agent: \*\s+Disallow: \//, 'Preview robots policy');
assert.match(await readFile('dist/_headers', 'utf8'), /X-Robots-Tag: noindex, nofollow, noarchive/, 'Future static host response policy');
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
assert.equal((sitemap.match(/<loc>/g) || []).length, 8, 'Eight non-legal sitemap entries');
for (const route of pairs.slice(0, 4).flat()) assert.ok(sitemap.includes(`<loc>${origin}${route}</loc>`), `Sitemap includes ${route}`);
assert.doesNotMatch(sitemap, /impressum|datenschutz|imprint|privacy/, 'Legal drafts excluded from sitemap');
async function walk(directory) {
  return (await Promise.all((await readdir(directory, { withFileTypes: true })).map(entry => entry.isDirectory() ? walk(join(directory, entry.name)) : join(directory, entry.name)))).flat();
}
assert.equal((await walk('dist')).filter(path => path.endsWith('.html')).length, 12, 'Exactly twelve generated HTML routes');
console.log(`PASS: ${html.size} pages, ${links} local references, metadata, language pairs, heading hierarchy, preview protections, contact/legal notices and sitemap.`);
