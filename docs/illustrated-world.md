# NimbusIT — ilustrirani redizajn

Nova grana `redesign/illustrated-world`, iz produkcijskog `master` commita
`615a846`. Zahtjev vlasnika: izgled i animacije vrlo bliski stranici
https://findahudconsultant.com/, uz postojeću ponudu i sadržaj NimbusIT-a.

## Vizualni smjer

Referenca je pregledana u Chromiumu preko Chrome DevTools MCP-a, na desktopu
1440 px i mobitelu 390 px, s animacijama i sa smanjenim kretanjem.

Primijenjeni su plavo nebo, velike ravne ilustracije, slojevi pri skrolanju,
urbana scena s poveznicama, tople neutralne podloge, obojeni blokovi usluga,
zaobljene plohe i tipografski naglašeni naslovi. Lokalni Lexend, Dela Gothic
One i Anton prate karakter tipografije reference; DM Sans ostaje za tekst.

NimbusIT ilustracije su originalni SVG crteži: prikaz suradnje uz web,
konfigurator, e-mail, poslovni prostori i četiri vrste usluga. Iz referentne
stranice nisu kopirani kod, ilustracije, logotipi, certifikati, rezultati ili
tekst. Nema tvrdnje da ilustrirani likovi predstavljaju stvarni tim.

## Što je zadržano

- Stvarna ponuda, cijene i sve granice paketa u `data/pricing.json`.
- Provjereni kontakti, poslovni i porezni podaci, Hrvatska i EU kao tržište.
- Postojeći Web3Forms, provjera stvarnog uspjeha i čuvanje unosa pri grešci.
- Hrvatska i engleska naslovnica, pravne stranice, kanonske adrese,
  hreflang, sitemap, stara sidra, postojeća preusmjerenja i analiza u PDF-u.
- Autentična fotografija i iskreno označen status projekta pergola.
  Vanjski projekt i njegov repozitorij nisu uređivani.
- Postojeći Cloudflare Workers način objave, domena, DNS i postavke računa.

Engleska i hrvatska naslovnica sada dijele predložak i stilove. Engleski
obrasci i FAQ dodani su u isti dizajn, uz isti endpoint i pravila slanja.

## Animacije

CSS pokreće oblake, malu omotnicu i vozila; promjene slojeva pri skrolanju
obrađuju se jednim zakazanim `requestAnimationFrame` pozivom. Visina scene
pamti se za izračun i osvježava pri promjeni prozora.

IntersectionObserver jednokratno otkriva sadržaj i pauzira scene izvan ekrana.
Skrivanje kartice pauzira animacije. `prefers-reduced-motion` isključuje
animacije i parallax, uključujući promjenu postavke dok je stranica otvorena.
Navigacija i skrolanje ostaju standardni; sve je čitljivo bez JavaScripta.

## Provjera

- Release build, provjera 13 stranica, sintaksa JS-a, javni izvoz i diff.
- Postojeći browser QA: 14 kombinacija stranice i prikaza te 4 provjere oba
  obrasca sa simuliranim odgovorima; bez neuspjeha. Provjereni kontrast,
  veličine teksta, dodirne površine, konzola i vodoravno prelijevanje.
- Dodatnih 55 provjera: širine 320–1440 px, oba jezika, navigacija tipkovnicom,
  izbor sva tri paketa, CRM kontakt, kartice obrasca, engleska greška/uspjeh,
  reset, parallax, reduced motion, pauza izvan ekrana i rad bez JavaScripta.
- Puni QA zapis je u `docs/qa/world-browser-checks.json`, dodatne provjere u
  `docs/qa/world-interaction-checks.json`.
- Vizualno pregledani uvod, grad, usluge, cijene, projekt, suradnja, kontakt i
  slike za dijeljenje. Snimke su u `docs/screenshots/world-*.png`.
- Sve nove datoteke fontova provjerene su za č, ć, ž, š, đ i velika slova.
- Mobilne provjere koriste emulaciju. Fizički iOS/Android uređaj nije korišten.

Novi izgled dodaje četiri ilustrirana prikaza usluga i grad. Visina naslovnice
na 390 px je 13.651 px, unutar eksplicitnog budžeta od 15.000 px za ovaj dizajn.
QA opcija mijenja budžet za odabrani dizajn; stari zadani prag od 8.000 px
nije potajno povećan. Sekcije imaju prirodnu visinu sadržaja.

## Konfiguracija za objavu

Nema nove vanjske konfiguracije. Fontovi i ilustracije poslužuju se lokalno;
nisu dodani trackeri, plaćeni servisi ili nove baze. Za produkciju se koristi
postojeća Git integracija Cloudflarea s granom `master`. Prije objave pripremljen
je i pregledan stvarni lokalni preview. Odgovori obrazaca bili su simulirani;
produkcijski upiti nisu slani tijekom testiranja.

## Lighthouse — lokalni mobilni pregled

performance 97/100, accessibility 100/100, best-practices 100/100, seo 100/100. CLS 0.
Provjera podudaranja vidljivog teksta i pristupačnog naziva gumba također prolazi.
Mjerenje je lokalni laboratorijski rezultat, ne podatak o stvarnim posjetiteljima.
Sažetak je u `docs/qa/world-lighthouse-summary.json`.
