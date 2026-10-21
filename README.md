# NimbusIT — Hrvatska i EU

Statična poslovna stranica samostalnog obrtnika Antonija Lovrića. Hrvatska
naslovnica, tri stranice usluga i besplatna analiza; postojeći engleski sadržaj
sačuvan je na `/en/`. HTML, CSS i JavaScript, bez frameworka, backenda,
analitike i runtime ovisnosti.

Aktualna dorada teksta je na grani `redesign/hr-copy`, iz produkcijskog
`master` commita `bf659d6`. Hrvatski marketinški tekst prerađen je prema
vlasnikovim referencama, uz zadržan dizajn, cijene i postojeće funkcije.
[Uredničke bilješke i provjera](docs/copy-hr.md). Vlasnik je 21. listopada
2026. izričito odobrio prijenos u produkcijski `master`, koji pokreće postojeći
Cloudflare Workers build. DNS, postavke računa i zasebni Sites preview ne mijenjaju se.

## Lokalni pregled

```sh
python3 scripts/build.py
python3 scripts/serve.py
```

Otvorite http://127.0.0.1:8000. Lokalni QA poslužitelj primjenjuje `_headers`
i `_redirects`. To je razvojni alat; produkcija ostaje statična na postojećem
Cloudflare hostingu. Običan `python3 -m http.server 8000` također prikazuje
stranice, ali ne provjerava sigurnosna zaglavlja ni HTTP preusmjerenja.

## Gdje mijenjati sadržaj

- `data/site.json`: pravni naziv, područje rada, telefon, **jedini kontaktni
  e-mail**, WhatsApp, portret i porezna napomena. `email_future` je podsjetnik,
  ne aktivni sandučić. Mijenja se samo `email` kad nova adresa proradi.
- `data/pricing.json`: jedini izvor cijena, granica i prijevoda paketa.
  Izvorni engleski podaci i cijene ostali su nepromijenjeni.
- `data/services.json`: tri usluge, postupci i česta pitanja. `price_source`
  povezuje cijenu s cjenikom; `{PRICE}` se zamjenjuje pri generiranju.
- `data/home-faq.json`: pitanja naslovnice, zajednička HTML-u i JSON-LD-u.
- `data/reviews.json`: trenutačno `[]`. Dodajte samo stvarne recenzije s poljima
  `name`, `text`, `date`, `source`. Blok se prikazuje samo kada recenzije postoje.
  Prosječna ocjena dodatno traži stvarnu brojčanu ocjenu `rating` (1–5) u svakoj
  recenziji; bez tih podataka ne generira se `aggregateRating`.
- `templates/index.html`, `service.html`, `analysis.html`, pravni predlošci i
  `partials/`: hrvatski sadržaj i zajednički elementi.
- `templates/en/`: sačuvani engleski sadržaj.
- `templates/style.css`: izvor glavnog CSS-a; `css/style.css` generira se s
  hashiranim URL-ovima fontova. `css/local.css` sadrži prilagodbe lokalizacije.
- `js/main.js`: izbornik, kontakt i analiza. `js/motion.js`: tri blago lebdeća
  panela i otkrivanje sadržaja, uz `prefers-reduced-motion`.

Ne uređujte generirane HTML datoteke ni `css/style.css` izravno. Generator koristi
samo Pythonovu standardnu biblioteku i računa verzije CSS-a, JS-a, slika i fontova
iz sadržaja datoteka. Sve stranice i cijene dostupne su bez JavaScripta.

## Provjera i izvoz

```sh
python3 scripts/build.py
python3 scripts/check.py
node --check js/main.js
node --check js/motion.js
python3 scripts/export.py
git diff --check
```

`dist/` sadrži samo dopuštene javne datoteke. Razvojni izvori, dokumentacija,
snimke, Git i konfiguracija nisu u izvozu. Workers Static Assets i dalje koristi
korijen i `.assetsignore`; `dist` je opcija za Pages ili lokalnu predaju.

`check.py` provjerava svih 13 stranica, canonical i recipročne hreflang veze,
JSON-LD, hashirane resurse, sidra, preusmjerenja, sitemap i nepromijenjene cijene
te izvorni engleski opseg. Samo `{{ADRESA_OBRTA}}`, `{{OIB}}` i
`{{PDV_NAPOMENA}}` dopušteni su neriješeni podaci prije vlasnikove dopune.

## Fotografije i fontovi

Nije dostavljen portret. Koristi se jasan pixel prikaz inicijala `AL`, bez
izmišljene fotografije i bez korištenja oblačića kao lica. Oblačić je logotip.
Kad dodate `img/antonio.webp`, pripremite inačice:

```sh
# Razvojni alat: zahtijeva Pillow; nije ovisnost stranice ni generatora.
python3 scripts/prepare_images.py
python3 scripts/build.py
```

Alat priprema 600w fotografiju pergole te 240w/480w inačice dostavljenog portreta.
Slike se ne generiraju. Fontovi su lokalni WOFF2 s WOFF rezervom, uz licence u
`fonts/`. Za ponovno pretvaranje fontova razvojno trebaju fontTools i Brotli;
objava i uobičajeni build ih ne trebaju.

## Obrasci i privatnost

Sačuvani su Web3Forms endpoint i javni klijentski ključ. Kontakt i analiza imaju
odvojene naslove poruke. URL bez protokola dopunjava se na HTTPS, kontakt za
analizu prihvaća e-mail ili telefon. Bez JavaScripta obrasci šalju stvarni POST;
za URL tada treba upisati punu adresu, što piše u uputi.

Potvrda se prikazuje samo na HTTP uspjeh i izričito `success: true`. Greška ili
istek vremena čuvaju uneseni tekst i nude e-mail. Testovi koriste simulirane
odgovore i ne šalju stvarne poruke.

Nema prozora o kolačićima ni nove pohrane. Stari ključ
`nimbusit.cookie-notice.v1` uklanja se pri sljedećem otvaranju. Buduće praćenje
zahtijeva zasebnu konfiguraciju privola; sada ništa nije aktivirano.

## Prije produkcije

[Popis za vlasnika](docs/launch.md) i [rezultati provjere](docs/verification-hr.md).
Područje rada je **Hrvatska i EU**, prema zadnjoj uputi vlasnika. Slavonski Brod
je lokacija poslovanja, ne ograničenje tržišta. Usluga je na
`/izrada-web-stranica/`; prvotno predloženi lokalni URL ima 301 preusmjerenje.
`workers_dev` je promijenjen na `false` samo u konfiguraciji ove grane. Ne
primjenjuje se na račun dok se naknadno ne odobri produkcijska objava.
