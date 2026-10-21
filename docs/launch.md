# Prije objave — podatke dopunjava vlasnik

Radna grana: `redesign/hr-lokalno`. Pull request ide prema
`redesign/retro-digital`, ne prema `master`. Nije izveden deploy ni promjena DNS-a
ili Cloudflare računa. Postojeći javni preview ostaje prethodna engleska verzija.

## Podaci i koraci za vlasnika

1. **Adresa, OIB i PDV napomena.** U `data/site.json` zamijenite
   `{{ADRESA_OBRTA}}`, `{{OIB}}` i `{{PDV_NAPOMENA}}` stvarnim podacima. Puni naziv
   obrta preuzet je iz Vaše upute. Potvrdite da odgovara registraciji. Ne
   objavljujte produkciju s ovim oznakama. Porezni status nije pretpostavljen.
   Dok su polja prazna, adresa, OIB i PDV napomena se ne prikazuju nigdje na
   stranici i ne ulaze u strukturirane podatke; nema praznih oznaka. Zaštita
   izdanja: `python3 scripts/build.py --release` i `python3 scripts/export.py`
   **padaju** s porukom koja navodi koja polja nedostaju, pa izvoz za objavu
   nije moguć bez podataka obrta. `vat_note` je jedno od dva: „Obveznik nije u
   sustavu PDV-a. PDV nije obračunat temeljem čl. 90. st. 1. Zakona o PDV-u.“
   ili „Sve cijene navedene su bez PDV-a.“ — potvrdite s knjigovođom.
2. **Portret.** Dodajte stvarnu fotografiju `img/antonio.webp`; po želji i 1–2
   stvarne fotografije s posla. Pokrenite `python3 scripts/prepare_images.py`
   (razvojno zahtijeva Pillow) i build. Alat priprema dvije veličine portreta.
   Do tada se prikazuju označeni inicijali `AL`, bez AI fotografije ili oblačića
   umjesto osobe. Portret nije preduvjet tehničkog pregleda grane.
3. **E-mail na domeni.** U vlastitom Cloudflare računu podesite i provjerite
   `info@nimbusit.hr` (Email Routing). Tek kada dostava proradi, promijenite
   `email` u `data/site.json` i ponovno generirajte stranice. Routing prosljeđuje
   dolazne poruke; za slanje s te adrese podesite odgovarajući sandučić ili SMTP
   prema stvarnoj usluzi. `email_future` sam po sebi ništa ne aktivira.
4. **Google profil tvrtke.** Vlasnik otvara ili dopunjuje stvarni Business
   Profile, s kategorijom „Web-dizajner“ i odgovarajućim područjem usluge.
   Primarno tržište stranice je Hrvatska i EU. Ne navoditi poslovnice koje ne
   postoje; Slavonski Brod je lokacija poslovanja, ne jedino tržište.
5. **Search Console.** Nakon stvarne objave provjerite vlasništvo domene i
   predajte `https://nimbusit.hr/sitemap.xml` na postojećem ili vlastitom računu.
   Nema jamstva pozicija ni broja upita.
6. **Stvarne recenzije, po želji.** Dodajte 2–3 provjerene recenzije u
   `data/reviews.json`: `name`, `text`, `date`, `source`. Trenutačno je niz prazan
   i nema bloka recenzija ni ocjene. `rating` (1–5) dodajte samo kada postoji
   stvarna brojčana ocjena; prosjek se ne izmišlja iz samog teksta.
7. **Stvarna dostava oba obrasca.** Nakon produkcijske objave pošaljite jedan
   vlastiti test kontakta i jedan zahtjev za besplatnu analizu. Provjerite naslov,
   sve podatke, primitak u sandučiću i dopuštenu domenu u Web3Forms računu.
   Po potrebi testirajte analizu jednom s e-mailom i jednom s telefonom. U ovoj
   grani korišteni su samo simulirani odgovori; nijedna stvarna poruka nije poslana.
8. **Pravila privatnosti i besplatna analiza.** Potvrdite stvarne postupke
   obrade, čuvanja i dogovore s Web3Formsom, Googleom i Cloudflareom. Besplatna
   ponuda iz Vaše upute znači 15 minuta razgovora i PDF s 5 konkretnih popravaka.
   Provjerite da Vam takav način rada odgovara prije produkcijske objave.

## Konfiguracija pripremljena za kasniju objavu

- `wrangler.jsonc`: `workers_dev: false` radi izbjegavanja duplikata uz
  `nimbusit.hr`. Promijenjena je samo datoteka u ovoj grani; postavka računa se
  nije mijenjala. Ova će se promjena primijeniti pri budućoj objavi.
- `_headers`: HSTS i CSP bez izvršivog inline koda; dozvoljeno slanje na
  `api.web3forms.com`. CSS, JS i fontovi imaju hash u `?v=`. Cloudflare pravila
  zaglavlja odgovaraju putanji, ne queryju, pa se immutable zaglavlje primjenjuje
  na te putanje; sav generirani HTML/CSS koristi verzionirane URL-ove.
- `_redirects`: `/privacy/` i `/cookies/` vode na `/en/privacy/` i `/en/cookies/`.
  `/privatnost/` i `/kolacici/` vraćene su kao hrvatske stranice.
- Nakon Vaše dopune o tržištu, glavni URL usluge je `/izrada-web-stranica/`.
  `/izrada-web-stranica-slavonski-brod/` ima 301 prema njemu. Nema gomilanja
  gotovo istih gradskih stranica. Sitemap i canonical koriste produkcijsku domenu.
- Oglasi, mjerenje, pretplate, novi sandučić i drugi plaćeni servisi nisu aktivirani.

## Provjera prije kasnije autorizirane produkcijske objave

```sh
python3 scripts/build.py
python3 scripts/check.py
node --check js/main.js
node --check js/motion.js
python3 scripts/export.py
git diff --check
```

Zadržan je Workers Static Assets način s `.assetsignore`. Za Pages je moguć
izvoz `dist/`. Ne objavljivati `templates/`, `scripts/`, `data/`, `docs/` ili Git
kao javne datoteke. Ne koristiti naredbu za deploy u sklopu ove dorade.

Nakon kasnije objave pregledajte hrvatsku i englesku verziju, jezični prekidač,
preusmjerenja, stari PDF, nepostojeću adresu, forme, e-mail, telefon i WhatsApp.
Provjerite i prikaz na stvarnom mobitelu. Testovi ovdje koriste Chromium
emulaciju; fizički iOS/Android uređaji nisu bili dostupni.

## Dostavljene reference

U ovoj poruci dostavljen je samo tekst uputa; spomenutih pet JPG mockupa nije
bilo među prilozima. Zadržan je postojeći retro-digitalni dizajn sustav. Nije
izmišljena fotografija, recenzija, rezultat kampanje ili nedostajući pravni podatak.
