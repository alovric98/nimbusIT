# Objava i završne stavke

Redizajn je implementiran za `alovric98/nimbusIT`. Produkcijska domena i
Cloudflare konfiguracija nisu preusmjereni. Privatni pregled služi provjeri
prije objave na postojećem hostingu.

## Stavke koje trebaju vlasnikov podatak ili provjeru

1. **Porezni tekst uz cijene.** Status PDV-a nije potvrđen. Prije produkcije
   uz cjenik treba dodati točnu formulaciju jesu li cijene s PDV-om, bez PDV-a
   ili se primjenjuje drugo pravilo. Nijedan status nije izmišljen; trenutni
   tekst upućuje na porezni obračun u konačnoj ponudi.
2. **Pravni podaci.** Potvrditi puni registrirani naziv poslovanja, adresu,
   identifikacijske/registracijske podatke i voditelja obrade te njima dopuniti
   privatnost i podatke poslovanja. Osobno ime i kontakti potječu iz repozitorija.
   Pregledati rokove čuvanja, ugovore s Web3Formsom, Googleom i Cloudflareom te
   tekst uskladiti sa stvarnim poslovnim postupkom.
3. **Stvarna dostava upita.** Sačuvan je javni Web3Forms ključ. Automatske
   provjere simuliraju uspjeh, odbijanje i mrežnu grešku; nisu poslale poruku.
   Potrebno je poslati jednu vlastitu testnu poruku, potvrditi primitak u
   `info.nimbusit@gmail.com` i provjeriti dopuštenu domenu u računu servisa.
4. **Produkcijska objava.** Odobriti konačan pregled, zatim primijeniti promjene
   na produkcijsku granu/Cloudflare deploy prema postojećem računu. Nije dodan
   novi backend niti je promijenjen DNS. GitHub i Cloudflare prava upisa treba
   imati u okruženju koje objavljuje.

Ovo nisu prepreke lokalnom ili privatnom pregledu dovršene stranice.

## Postupak za postojeći Cloudflare Workers Static Assets

```sh
python3 scripts/build.py
python3 scripts/check.py
node --check js/main.js
# S autoriziranim Cloudflare računom, nakon završnog pregleda:
# npx wrangler deploy
```

Provjeriti da `.assetsignore` isključuje `.git`, razvojne izvore, dokumentaciju,
konfiguraciju, `dist` i ovisnosti. `_headers`, `robots.txt` i `sitemap.xml` moraju
ostati uključeni. Domena `https://nimbusit.hr` ostaje kanonska. U postojećoj
konfiguraciji `workers_dev` ostaje `true`; eventualno ga isključivanje nakon
provjere produkcijske domene treba biti odvojena konfiguracijska odluka.

Za Pages je opcionalni čisti izlaz: `python3 scripts/build.py && python3
scripts/export.py`, build output `dist`. Ne objavljivati `docs/`, `templates/`
i `scripts/` kao javne datoteke.

## Nakon produkcijske objave

- Provjeriti naslov, Open Graph sliku, favicon, HTTPS i kanonsku adresu.
- Otvoriti glavnu stranicu, `/privatnost/`, nepostojeći URL i stari PDF.
- Provjeriti obrazac na produkcijskoj domeni te klik na e-mail i telefon.
- Provjeriti izbornik, cijene i kontakt na mobitelu.
- Predati novi sitemap u postojeći Search Console ako je račun konfiguriran.

Oglašavanje, mjerenje i vanjske pretplate nisu aktivirani. Za bilo kakvo kasnije
praćenje prvo treba dogovoriti račune, privole i konfiguraciju. Stranica u ovoj
verziji ne postavlja analitičke ni oglasne kolačiće.
