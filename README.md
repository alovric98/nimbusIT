# NimbusIT

Statična poslovna stranica Antonija Lovrića za Hrvatsku i EU. Hrvatska verzija
je na `/`, engleska na `/en/`. Ilustrirani dizajn prati vlasnikovu referencu
[Find a HUD Consultant](https://findahudconsultant.com/): nebo, originalne SVG
scene, grad, obojene usluge i animacije povezane sa skrolanjem.

HTML, CSS, JavaScript i generator u Pythonovoj standardnoj biblioteci. Stranica
nema framework, backend, paketni bundler, vanjsku biblioteku za animaciju,
analitiku ili udaljene fontove. Git povijest i Cloudflare Workers hosting ostaju.

## Pokretanje

```sh
python3 scripts/build.py --release
python3 scripts/serve.py
```

Otvorite http://127.0.0.1:8000. Razvojni poslužitelj primjenjuje `_headers`
i `_redirects`. Nije produkcijski backend.

## Gdje mijenjati sadržaj

- `data/home.json`: hrvatski i engleski tekst naslovnice, usluge, koraci i CTA-i.
- `templates/index.html`: zajednički predložak obje naslovnice.
- `data/pricing.json`: jedini izvor svih cijena, opsega i prijevoda paketa.
- `data/services.json`: tri detaljne stranice usluga, pitanja i veze na cjenik.
- `data/home-faq.json` i `data/home-faq-en.json`: HTML i JSON-LD pitanja naslovnice.
- `data/site.json`: podaci obrta, kontakti, područje rada i porezna napomena.
  `email_future` ne aktivira sandučić. Kontakt je `info.nimbusit@gmail.com`.
- `data/reviews.json`: prazan niz; objavljuju se isključivo stvarne recenzije.
- `templates/partials/`: navigacija, obrasci i zajednički elementi.
- `templates/en/`: engleski pravni predlošci. Engleska naslovnica koristi zajednički
  `templates/index.html` i `data/home.json`, bez zasebnog duplikata.
- `templates/style.css`: izvor CSS-a. `css/style.css` generira se s hashovima
  fontova. `css/local.css` zadržan je kao kompatibilna putanja.
- `js/main.js`: navigacija, kontaktne kartice i Web3Forms. `js/motion.js`:
  parallax, otkrivanje sadržaja, zaustavljanje scena i reduced motion.

Ne uređujte generirane HTML datoteke ni `css/style.css` izravno. Naslovnice,
pravne stranice, cijene i osnovna navigacija rade i bez JavaScripta.

## Ilustracije i fontovi

Originalni SVG crteži su u `templates/partials/world-*.html` i `art-*.html`.
Izvor geometrije je `scripts/build_art.py`. Nakon izmjene crteža pokrenite:

```sh
python3 scripts/build_art.py
python3 scripts/build.py --release
```

Referentni kod, logotipi i ilustracije nisu uvezeni. Dva lika su dekorativni
prikaz suradnje; nisu fotografije vlasnika ili članovi izmišljenog tima.
Stvarni portret nije dostavljen pa se koristi označeni prikaz inicijala AL.
Fotografija pergole preuzeta je iz postojećeg NimbusIT projekta; vanjski
repozitorij pergola nije mijenjan.

Lexend, Dela Gothic One i Anton učitavaju se lokalno kao WOFF2, uz DM Sans za
tekst. Podskupovi sadrže č, ć, ž, š, đ i velika slova; licence su u `fonts/`.
Izrada/izvoz ne zahtijeva fontTools ni Brotli. To su samo razvojni alati za fontove.

Slike za dijeljenje nastaju iz iste originalne scene:

```sh
# Razvojno zahtijeva Playwright i Chromium.
python3 scripts/render_social.py --browser /usr/bin/chromium
python3 scripts/build.py --release
```

## Provjere

```sh
python3 scripts/build.py --release
python3 scripts/check.py
node --check js/main.js
node --check js/motion.js
python3 scripts/export.py
git diff --check
# Razvojno: Playwright i postojeći Chromium.
python3 scripts/qa_browser.py --browser /usr/bin/chromium --max-home-height 15000
```

Novi visinski budžet od 15.000 px eksplicitno prati ilustriranu naslovnicu s
četiri prikaza usluga; izvorni QA zadani prag od 8.000 px ostaje dostupan.
Izmjerena visina, rezultati i dodatne provjere su u
[bilješkama redizajna](docs/illustrated-world.md). Testovi slanja koriste
simulirane odgovore i ne šalju prave upite.

## Hosting i privatnost

Produkcija: https://nimbusit.hr/. Produkcijska grana je **`master`** i njezin
push pokreće postojeći Cloudflare Workers build za `nimbusit`. `wrangler.jsonc`
i dalje poslužuje statične datoteke iz korijena uz `.assetsignore`.

`dist/` je dodatni izvoz samo dopuštenih javnih datoteka. Izvori, dokumentacija,
snimke, Git i razvojni alati nisu javni resursi. Nema promjene DNS-a, novog
hostinga, dodatnog računa ili pretplate.

Oba jezika koriste postojeći Web3Forms endpoint i javni klijentski ključ.
Potvrda se pokazuje isključivo kada HTTP odgovor uspije i `success` je `true`.
Pogreška zadržava unos i nudi provjereni e-mail. URL bez protokola dopunjava
se na HTTPS; bez JS-a uputa traži punu adresu.

Nema prozora o kolačićima, nove pohrane ili praćenja. Stari ključ obavijesti
uklanja se kao i prije. Buduće oglašavanje i mjerenje traže zasebnu stvarnu
konfiguraciju; ova dorada ih ne aktivira.
