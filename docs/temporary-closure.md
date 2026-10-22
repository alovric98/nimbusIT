# Privremeno zatvoren javni pristup

Vlasnikov zahtjev od 22. listopada 2026.: zadržati dizajn i kod, ali privremeno
sakriti javnu stranicu i ukloniti je iz Google rezultata.

## Produkcija

`wrangler.jsonc` postavlja `SITE_VISIBILITY` na `private`. Mali Worker u
`worker/index.mjs` izvršava se **prije svake datoteke** (`run_worker_first: true`).
Sve stranice, jezici, izravne HTML adrese, slike, fontovi, CSS, JS i sitemap
vraćaju HTTP **403** s neutralnom porukom i bez poslovnog sadržaja. Ne postoji
javni način zaobilaženja preko query parametra, lozinka u kodu ili preglednikova
pohrana. Nedostajuća ili neprepoznata vrijednost postavke također zatvara pristup.
`workers.dev` i Cloudflare preview URL-ovi su isključeni.

Odgovori imaju `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, noimageindex`
i zabranu pohrane u browser/CDN cache. Prije preuzete kopije na tuđim uređajima
ili u vanjskim arhivama nije moguće povući ovom promjenom.

`/robots.txt` ostaje čitljiv i dopušta crawling bez poveznice na sitemap.
To **ne otvara sadržaj**: svaka druga adresa vraća 403. Google tako može ponovno
posjetiti stare URL-ove, vidjeti zabranu pristupa i ukloniti ih iz indeksa.
`Disallow: /` spriječio bi ga da vidi stanje tih URL-ova. Ne koristi se 503 jer
Google pri privremenim pogreškama poslužitelja nastoji zadržati indeksirane URL-ove.

Izmjena ne može odmah obrisati već indeksirane rezultate. Za ubrzano privremeno
skrivanje vlasnik može koristiti **Search Console → Removals → New request →
Remove all URLs with this prefix → https://nimbusit.hr/** u potvrđenom propertyju.
Za to je potreban pristup njegovu Search Console računu; nije dio Cloudflare deploya.

Izvori: [Google: HTTP status codes](https://developers.google.com/search/docs/crawling-indexing/http-network-errors),
[Google: block indexing](https://developers.google.com/search/docs/crawling-indexing/block-indexing),
[Cloudflare: Worker before static assets](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/).

## Ostale adrese

Stari NimbusIT preview `https://nimbusit-redesign-preview.quickeft257.chatgpt.site/`
prebačen je iz javnog pristupa na `custom`, bez dodatnih korisnika ili grupa;
vlasnik zadržava pristup preko Sites prijave. Projekt i spremljene verzije ostaju.
GitHub Pages za `alovric98/nimbusIT` nije uključen (`has_pages: false`).
Repozitorij i njegova vidljivost nisu mijenjani.

## Provjere prije objave

- Build i postojeće provjere svih 13 stranica prolaze; generirani sadržaj ostaje isti.
- `node scripts/check_visibility.mjs`: 560 odbijenih zahtjeva, prazni HEAD odgovori,
  robots GET/HEAD, zatvaranje pri nepoznatoj postavci i delegiranje pri `public`.
- Wrangler lokalno: 38 HTTP zahtjeva na stranice, stare URL-ove i datoteke vraća
  403 s `noindex` i `no-store`; robots vraća 200 bez izlaganja sadržaja.
- Wrangler deploy dry-run prolazi s vezama `ASSETS` i `SITE_VISIBILITY=private`.
- Stari Sites preview anonimno vraća 401 i traži prijavu.

## Dorade i ponovno otvaranje

Lokalni pregled dizajna ostaje dostupan:

```sh
python3 scripts/build.py --release
python3 scripts/serve.py
```

Za pregled stvarne zaštite:

```sh
node scripts/check_visibility.mjs
npx wrangler dev --local
```

Izvoz `dist/` i Python razvojni poslužitelj sadrže cijeli dizajn i **nisu za javnu
objavu dok traje zatvaranje**. Zaštitu provodi Cloudflare Worker ispred datoteka;
nemojte objaviti same statične datoteke na alternativnom hostingu.

Ponovno otvaranje, tek na zahtjev vlasnika: promijeniti `SITE_VISIBILITY` u `public`,
prilagoditi provjeru očekivanog produkcijskog stanja u `scripts/check_visibility.mjs`,
pokrenuti build/provjere i push na `master`. Worker tada delegira postojeći
`ASSETS.fetch` bez promjene HTML-a, URL-ova, obrazaca, dizajna ili DNS-a. Izvorni
robots i sitemap ponovno će se posluživati automatski. Sites preview ostaje
privatan dok vlasnik zasebno ne zatraži promjenu. Ako je zatraženo privremeno
uklanjanje u Search Consoleu, ondje poništiti zahtjev pri ponovnom otvaranju.
