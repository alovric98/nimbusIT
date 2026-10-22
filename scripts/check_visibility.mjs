/** Access-control smoke tests; no dependencies, network, or real submissions. */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import worker from "../worker/index.mjs";

const config = JSON.parse(
  (await readFile(new URL("../wrangler.jsonc", import.meta.url), "utf8"))
    .replace(/^\s*\/\/.*$/gm, ""),
);
assert.equal(config.main, "worker/index.mjs");
assert.equal(config.vars.SITE_VISIBILITY, "private");
assert.equal(config.assets.run_worker_first, true);
assert.equal(config.assets.binding, "ASSETS");
assert.equal(config.workers_dev, false);
assert.equal(config.preview_urls, false);
assert.match(await readFile(new URL("../.assetsignore", import.meta.url), "utf8"), /^worker$/m);

let assetCalls = 0;
const ASSETS = {
  async fetch(request) {
    assetCalls++;
    return new Response(`original asset: ${new URL(request.url).pathname}`);
  },
};
const paths = [
  "/", "/index.html", "/en/", "/en/index.html", "/privatnost/", "/kolacici/",
  "/en/privacy/", "/en/cookies/", "/privacy/", "/cookies/",
  "/izrada-web-stranica/", "/izrada-web-stranica-slavonski-brod/",
  "/google-oglasi-za-obrte/", "/konfigurator-proizvoda-za-web/",
  "/besplatna-analiza/", "/sitemap.xml", "/404.html", "/css/style.css",
  "/js/main.js", "/js/motion.js", "/img/pergole-hero.webp",
  "/fonts/dm-sans-latin.woff2", "/dokumenti/", "/worker/index.mjs",
  "/?preview=true", "/unknown/", "/en//", "/%69ndex.html",
];
let checks = 0;
for (const visibility of [undefined, "private", "", "PUBLIC", "invalid"]) {
  for (const path of paths) {
    for (const method of ["GET", "HEAD", "POST", "OPTIONS"]) {
      const response = await worker.fetch(new Request(`https://nimbusit.hr${path}`, { method }), {
        SITE_VISIBILITY: visibility, ASSETS,
      });
      assert.equal(response.status, 403, `${visibility}: ${method} ${path}`);
      assert.match(response.headers.get("X-Robots-Tag"), /noindex/);
      assert.match(response.headers.get("Cache-Control"), /no-store/);
      assert.equal(response.headers.get("Cloudflare-CDN-Cache-Control"), "no-store");
      const body = await response.text();
      assert.equal(body.includes("Stranica trenutačno nije dostupna."), method !== "HEAD");
      assert.doesNotMatch(body, /nimbusit|web3forms|350|pergola|<script|<form/i);
      checks++;
    }
  }
}
assert.equal(assetCalls, 0, "Closed mode must never read or return original assets");
for (const method of ["GET", "HEAD"]) {
  const response = await worker.fetch(new Request("https://nimbusit.hr/robots.txt", { method }), { ASSETS });
  assert.equal(response.status, 200);
  assert.equal(await response.text(), method === "HEAD" ? "" : "User-agent: *\nAllow: /\n");
}
const response = await worker.fetch(new Request("https://nimbusit.hr/en/"), { SITE_VISIBILITY: "public", ASSETS });
assert.equal(response.status, 200);
assert.equal(await response.text(), "original asset: /en/");
assert.equal(assetCalls, 1, "Explicit reopening delegates to the existing static site");
console.log(`Visibility checks passed: ${checks} denied requests, robots GET/HEAD, fail-closed configuration, explicit reopening.`);
