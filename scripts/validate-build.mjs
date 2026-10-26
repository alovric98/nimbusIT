import assert from 'node:assert/strict';
import { readFile, stat, readdir } from 'node:fs/promises';
import { join } from 'node:path';

// Verify the generated site, independently of the route implementation.
const pairs = [
  ['/', '/en/'], ['/leistungen/', '/en/services/'],
  ['/powershell-automatisierung/', '/en/powershell-automation/'],
  ['/ueber-uns/', '/en/about/'], ['/kontakt/', '/en/contact/'],
  ['/impressum/', '/en/imprint/'], ['/datenschutz/', '/en/privacy/'],
];
const expectedRoutes = pairs.flat();
const origin = 'https://nimbusit.hr';
const html = new Map(await Promise.all(expectedRoutes.map(async route => [route, await readFile(join('dist', route, 'index.html'), 'utf8')])));
const titles = new Set();
const descriptions = new Set();
let links = 0;
let emailLinks = 0;

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
  assert.match(page, /class="preview-bar"/, `${route}: site-wide preview notice retained`);
  assert.doesNotMatch(page, /Kontaktvorschau|contact preview|KONTAKT NOCH NICHT AKTIV|CONTACT NOT YET ACTIVE|Kontakt und rechtliche Angaben noch in Vorbereitung|Contact and legal information are still in preparation|Kontaktweg dieser Website ist derzeit noch als Vorschau|contact channel is currently marked as a preview/i, `${route}: no inactive contact wording`);
  for (const [, address] of page.matchAll(/([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/gi)) {
    assert.equal(address, 'info@nimbusit.hr', `${route}: only verified business email is public`);
  }
  const ids = [...page.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${route}: unique IDs`);
  for (const [, href] of page.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const url = new URL(href.replaceAll('&amp;', '&'), origin + route);
    if (url.protocol === 'mailto:') {
      assert.equal(href, 'mailto:info@nimbusit.hr', `${route}: verified email destination`);
      emailLinks++;
      continue;
    }
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
  for (const [, tag, text] of page.matchAll(/(<a\b[^>]*>)([\s\S]*?)<\/a>/g)) {
    const label = text.replace(/<[^>]*>/g, '').trim();
    if (['Projekt besprechen', 'Discuss a project'].includes(label)) {
      assert.equal(attrs(tag).href, lang === 'de' ? '/kontakt/' : '/en/contact/', `${route}: localized contact CTA`);
    }
  }
  if (/kontakt|contact/.test(route)) {
    const mailLinks = [...page.matchAll(/<a\b[^>]*href="mailto:[^"]*"[^>]*>[\s\S]*?<\/a>/g)];
    assert.equal(mailLinks.length, 1, `${route}: one direct email link`);
    assert.match(mailLinks[0][0], />info@nimbusit\.hr<\/a>$/, `${route}: visible email matches destination`);
    assert.doesNotMatch(page, /contact-preview|contact-placeholder|Awaiting confirmation|Noch zu bestätigen/, `${route}: no contact placeholder`);
  }
}

const landingPages = [
  { route: '/powershell-automatisierung/', services: '/leistungen/', contact: '/kontakt/', title: 'PowerShell Automatisierung für IT-Dienstleister | Nimbus IT', heading: 'PowerShell-Automatisierung für Windows- und IT-Infrastrukturen' },
  { route: '/en/powershell-automation/', services: '/en/services/', contact: '/en/contact/', title: 'PowerShell Automation for IT Service Providers | Nimbus IT', heading: 'PowerShell Automation for Windows & IT Infrastructure' },
];
for (const { route, services, contact, title, heading } of landingPages) {
  const page = html.get(route);
  assert.equal(page.match(/<title>(.*?)<\/title>/)?.[1], title, `${route}: requested SEO title`);
  assert.equal(page.match(/<h1\b[^>]*>(.*?)<\/h1>/s)?.[1].replaceAll('&amp;', '&'), heading, `${route}: requested headline`);
  const main = page.match(/<main\b[^>]*>[\s\S]*?<\/main>/)?.[0];
  const buttons = [...main.matchAll(/<a\s[^>]*>/g)].map(match => attrs(match[0])).filter(link => link.class?.split(/\s+/).includes('button'));
  assert.equal(buttons.length, 2, `${route}: hero and final CTA`);
  assert.ok(buttons.every(link => link.href === contact), `${route}: localized contact CTAs`);
  assert.ok(main.includes(`href="${services}"`), `${route}: link back to Services`);
  const automation = html.get(services).match(/<section\b[^>]*id="automation"[\s\S]*?<\/section>/)?.[0];
  assert.ok(automation?.includes(`href="${route}"`), `${services}: contextual automation link`);
  const faq = page.match(/<section\b[^>]*aria-labelledby="faq-title"[\s\S]*?<\/section>/)?.[0];
  assert.equal((faq?.match(/<dt(?:\s|>)/g) || []).length, 5, `${route}: five FAQ questions`);
  assert.equal((faq?.match(/<dd(?:\s|>)/g) || []).length, 5, `${route}: five visible FAQ answers`);
}

const homepageText = html.get('/').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
assert.ok(homepageText.includes('Infrastruktur automatisieren. IT-Teams entlasten.'), 'Approved German headline');
assert.ok(homepageText.includes('Nimbus IT unterstützt IT-Dienstleister bei der Automatisierung wiederkehrender Aufgaben und der Umsetzung von Windows- und Cloud-Infrastrukturprojekten.'), 'Approved German description');
assert.match(await readFile('dist/robots.txt', 'utf8'), /User-agent: \*\s+Disallow: \//, 'Preview robots policy');
assert.match(await readFile('dist/_headers', 'utf8'), /X-Robots-Tag: noindex, nofollow, noarchive/, 'Future static host response policy');
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const sitemapPairs = pairs.filter(([de]) => !['/impressum/', '/datenschutz/'].includes(de));
const sitemapEntries = [...sitemap.matchAll(/<url>(.*?)<\/url>/gs)].map(match => match[1]);
assert.equal(sitemapEntries.length, 10, 'Ten non-legal sitemap entries');
for (const pair of sitemapPairs) {
  for (const route of pair) {
    const entry = sitemapEntries.find(entry => entry.includes(`<loc>${origin}${route}</loc>`));
    assert.ok(entry, `Sitemap includes ${route}`);
    const alternates = [...entry.matchAll(/<xhtml:link\s[^>]*>/g)].map(match => attrs(match[0]));
    assert.equal(alternates.length, 3, `${route}: three sitemap alternates`);
    for (const [locale, target] of [['de', pair[0]], ['en', pair[1]], ['x-default', pair[0]]]) {
      assert.equal(alternates.find(link => link.hreflang === locale)?.href, origin + target, `${route}: reciprocal sitemap ${locale} alternate`);
    }
  }
}
assert.doesNotMatch(sitemap, /impressum|datenschutz|imprint|privacy/, 'Legal drafts excluded from sitemap');
async function walk(directory) {
  return (await Promise.all((await readdir(directory, { withFileTypes: true })).map(entry => entry.isDirectory() ? walk(join(directory, entry.name)) : join(directory, entry.name)))).flat();
}
assert.equal((await walk('dist')).filter(path => path.endsWith('.html')).length, 14, 'Exactly fourteen generated HTML routes');
console.log(`PASS: ${html.size} pages, ${links} local references, ${emailLinks} verified email links, metadata, language pairs, contact CTAs, heading hierarchy, preview protections, legal drafts and sitemap.`);
