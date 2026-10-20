# NimbusIT

Nova hrvatska poslovna stranica za samostalnog web i marketing specijalista.
Čisti HTML, CSS i JavaScript, bez frameworka, backenda, runtime ovisnosti,
analitičkih oznaka ili vanjskih fontova. Postojeća Git povijest i Cloudflare
konfiguracija ostaju sačuvane.

## Lokalni pregled

```sh
python3 -m http.server 8000
```

Otvorite http://localhost:8000. Stranicu poslužite kroz HTTP; apsolutne putanje
resursa namijenjene su korijenu domene.

## Izmjene i provjera

- `templates/index.html`: izvor glavne stranice i tekstovi.
- `data/pricing.json`: **jedino mjesto za uređivanje cijena i opsega paketa**.
- `css/style.css`: boje, tipografija, raspored i prilagodbe zaslonima.
- `js/main.js`: mobilni izbornik, izbor paketa, validacija i Web3Forms slanje.
- `privatnost/index.html`, `404.html`: dodatne javne stranice.
- `fonts/`: lokalno posluženi, podskupirani fontovi i njihove OFL licence.
- `docs/`: istraživanje, provjere i otvorene stavke za objavu.

Nakon promjene predloška ili cijena:

```sh
python3 scripts/build.py
python3 scripts/check.py
node --check js/main.js
```

`index.html` je generirani, verzionirani rezultat. **Ne uređujte ga izravno.**
Generator koristi samo standardnu Python biblioteku. Cijene i sav sadržaj
vidljivi su i bez JavaScripta; posjetiteljima se JSON ne dohvaća u pregledniku.

## Cloudflare objava

Postojeći `wrangler.jsonc`, naziv `nimbusit`, domena i `workers_dev` postavka
nisu mijenjani. Workers Static Assets i dalje poslužuje korijen repozitorija;
`.assetsignore` isključuje Git, razvojne izvore, dokumentaciju i alate.
Prije objave pokrenite generator i provjere iznad. Postojeći Pages način
posluživanja statičnog HTML-a također ostaje kompatibilan.

Za **Pages s izlaznim direktorijem `/`**: `.assetsignore` je namijenjen Workersu,
pa predložak, razvojni alati i dokumentacija mogu biti javno dostupni. Za čišći
Pages izlaz upotrijebite `python3 scripts/build.py && python3 scripts/export.py`
i direktorij `dist`. To je opcija za Pages, ne promjena postojećeg Workers postupka.

`_headers` čuva postojeća sigurnosna zaglavlja. CSS i JS sada se revalidiraju
kako posjetitelj nakon nove objave ne bi godinu dana dobivao stare datoteke.
Kanonikalne adrese, robots i sitemap koriste potvrđenu domenu `https://nimbusit.hr`.
Stari PDF i glavna sidra (`#pristup`, `#usluge`, `#analiza`, `#projekti`, `#tijek`,
`#kontakt`) sačuvani su.

## Kontakt

Sačuvan je postojeći Web3Forms endpoint i javni klijentski `access_key`, koji je
prema izvornim uputama vezan uz `info.nimbusit@gmail.com`. To nije tajni API token.
Obrazac ima četiri kratka polja, honeypot, provjeru grešaka, zaštitu od dvostrukog
slanja i vremensko ograničenje. Uspjeh se prikazuje samo uz HTTP uspjeh i izričit
`success: true` odgovor servisa. U slučaju greške poruka ostaje u obrascu, uz
poveznicu na e-mail. Bez JavaScripta šalje se stvarni POST prema Web3Formsu.

Testovi koriste simulirane odgovore i ne šalju stvarne poruke. Prije produkcije
potrebno je potvrditi dostavu jedne stvarne testne poruke i eventualno odobriti
produkcijsku domenu u postavkama Web3Formsa. Provjereni e-mail i telefon uvijek
su vidljivi kao alternativa.

## Prije produkcije

Pročitajte [docs/launch.md](docs/launch.md). Otvorene stavke uključuju porezni
tekst, potpune pravne podatke poslovanja i završnu provjeru dostave obrasca.
Nisu aktivirani oglasi, praćenje ni plaćeni alati.

## Kolačići i pohrana

`/kolacici/` objašnjava stvarnu pohranu, a `js/cookies.js` prikazuje informacijsku
obavijest na svim stranicama. Nema aktivnih analitičkih ili oglasnih alata,
pa obavijest ne traži marketinšku privolu. Gumb „U redu, zapamti” samo sprema
verziju obavijesti i vrijeme zatvaranja pod ključem
`nimbusit.cookie-notice.v1` u localStorage. Odabir vrijedi 180 dana; istekao zapis
briše se pri sljedećem otvaranju. Prije korisnikova odabira nema novog zapisa.

Obavijest se može ponovno otvoriti iz podnožja, a odabir izbrisati na stranici
pravila. Ako je pohrana blokirana, stranica i obrazac ostaju upotrebljivi.
Ovo nije privola za buduće praćenje. Uključivanje analitike ili oglasnih oznaka
zahtijeva zasebnu implementaciju blokiranja do privole i korisničkih odabira.
