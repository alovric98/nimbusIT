# Provjera redizajna

Provjereno 20. listopada 2026., lokalni HTTP pregled u Chromiumu.

## Automatizirane provjere

- `python3 scripts/build.py`: uspješno generiran statični `index.html`.
- `python3 scripts/check.py`: cijene odgovaraju izvoru, javne datoteke i sidra
  postoje, nema ponovljenih ID-eva, po jedan H1, valjan JSON-LD i XML sitemap.
- `node --check js/main.js`: uspješna provjera sintakse.
- `python3 scripts/export.py`: uspješan opcionalni javni izvoz bez razvojnih
  izvora, Git podataka i konfiguracije.
- `git diff --check`: bez grešaka razmaka.
- axe-core 4.10.3, WCAG 2 A/AA i 2.1 AA: bez prijavljenih kršenja na glavnoj
  stranici u desktop i mobilnom prikazu; provjerena i privatnost.

Automatski alati ne dokazuju potpunu sukladnost; uz njih su provjereni fokus,
čitanje, kontrast, prijelomi teksta i sadržaj u stvarnom prikazu.

## 35 funkcionalnih provjera u pregledniku

Provjereni su redoslijed tipkovnice i preskok na sadržaj, glavna navigacija,
sva tri odabira paketa i uklanjanje izbora, obavezna polja i pogrešan e-mail,
vidljive hrvatske poruke greške, FAQ tipkovnicom, mobilni izbornik i Escape,
povrat fokusa, privatnost, 404, rad navigacije i cijena bez JavaScripta.

Web3Forms odgovori su **simulirani**, bez stvarnog slanja poruka:

- odbijanje servisa ne prikazuje uspjeh;
- HTTP 500 ne prikazuje uspjeh ni kada JSON sadrži `success: true`;
- mrežna greška otključava gumb, čuva uneseni tekst i daje e-mail alternativu;
- samo HTTP uspjeh s `success: true` otvara potvrdu i premješta fokus;
- novi upit resetira polja, a honeypot zaustavlja slanje.

Na početnom učitavanju nema zahtjeva prema trećim stranama. Nisu učitani
oglasni pikseli, analitika, vanjski fontovi ni udaljene fotografije.

## Prikaz i performanse

- Desktop 1440 × 1000 i mobitel 390 × 844 pregledani i snimljeni.
- Širine 320, 360, 390, 480, 600, 768, 800, 801, 1024, 1280 i 1920 px:
  bez vodoravnog prelijevanja.
- Reduced motion isključuje glatko skrolanje i prijelaze gumba.
- Fontovi DM Sans, Space Mono i Pixelify Sans poslužuju se lokalno. Font cmap
  provjera potvrđuje `ČčĆćŽžŠšĐđ` u svim korištenim fontovima; provjereno je i
  učitavanje u pregledniku.
- Fotografija ima definirane dimenzije i lazy loading; snimke cijele stranice
  napravljene su nakon pomicanja kroz sadržaj i učitavanja fotografije.
- Ažurirani su favicon, Apple ikona i Open Graph slika.

## Granice provjere

Dostava u stvarni e-mail sandučić, vlasnikov porezni status i potpuni registrirani
podaci nisu potvrđeni. To su stavke u `docs/launch.md` prije produkcije. Nisu
pokrenute kampanje i nema tvrdnji o rezultatima oglasa. Produkcijski Cloudflare
račun i DNS nisu mijenjani. Referentni projekt pergola pregledan je samo za
NimbusIT prikaz projekta i nije uređivan.

## Dopuna: kolačići i pohrana

Dodana je stranica `/kolacici/` i informacijska obavijest na svim javnim
stranicama. Prošlo je 36 dodatnih provjera, uključujući izostanak pohrane prije
odabira, pamćenje između stranica, istek nakon 180 dana, ponovno otvaranje,
brisanje, blokiranu pohranu i rad bez JavaScripta. Axe provjere obavijesti na
desktopu i mobitelu prolaze bez prijavljenih kršenja. Detalji: `docs/cookies.md`.
