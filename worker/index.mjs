/**
 * Temporary public shutdown. The original site remains in the asset binding.
 * Only an explicit SITE_VISIBILITY=public enables it; missing/invalid values
 * fail closed. run_worker_first=true is required for every URL, including files.
 */
const unavailable = `<!doctype html>
<html lang="hr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive,nosnippet,noimageindex">
<title>Stranica nije dostupna</title>
<style>body{max-width:36rem;margin:15vh auto;padding:1.5rem;font:1rem/1.6 system-ui,sans-serif;color:#202530;background:#faf9f6}h1{font-size:1.5rem;line-height:1.3}</style>
</head>
<body><main><h1>Stranica trenutačno nije dostupna.</h1><p>Pokušajte ponovno kasnije.</p></main></body>
</html>`;

export default {
  async fetch(request, env) {
    if (env.SITE_VISIBILITY === "public") {
      return env.ASSETS.fetch(request);
    }

    const robots = new URL(request.url).pathname === "/robots.txt";
    const headers = {
      "Content-Type": robots ? "text/plain; charset=utf-8" : "text/html; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "CDN-Cache-Control": "no-store",
      "Cloudflare-CDN-Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    };
    // Crawlers must be able to revisit old URLs and observe the denial. A
    // robots.txt Disallow would hide the HTTP status and can leave URLs indexed.
    const body = robots ? "User-agent: *\nAllow: /\n" : unavailable;
    return new Response(request.method === "HEAD" ? null : body, {
      status: robots ? 200 : 403,
      headers,
    });
  },
};
