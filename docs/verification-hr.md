# Provjera hrvatske i engleske verzije

Naknadna uputa vlasnika: uklonjeni su opis ispod hero ilustracije i gumb za
animacije u oba jezika. Lagano lebdenje, zaustavljanje izvan ekrana i
`prefers-reduced-motion` ostaju. Brojevi ispod odnose se na prethodnu cjelovitu
provjeru; ova je izmjena zasebno provjerena na oba jezika i na mobitelu.

Provjereno 21. listopada 2026. Grana `redesign/hr-lokalno`, cilj pull requesta
`redesign/retro-digital`. Nije izveden deploy; javni Sites preview nije mijenjan.

## Lighthouse mobile: izmjereno prije i poslije

Lighthouse 13.0.1, Chromium, standardna mobilna simulacija, lokalni HTTP.
Početna verzija je stvarno izmjerena iz commita `4b99d97` u odvojenom checkoutu.
Tablica prikazuje završni prolaz. Performanse mogu varirati između pokretanja i
na stvarnom hostingu; ovo nije jamstvo produkcijskih rezultata.

| Stranica | Performance | Accessibility | Best Practices | SEO | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| Naslovnica prije | 88 | 100 | 100 | 100 | 0,218 |
| `/` poslije | 95 | 100 | 100 | 100 | 0 |
| `/izrada-web-stranica/` | 99 | 100 | 100 | 100 | 0 |
| `/besplatna-analiza/` | 99 | 100 | 100 | 100 | 0 |

Stranice usluge i analize prije nisu postojale. Početni prijenos naslovnice
izmjeren je na 212.021 bajt, završni na 196.254 bajta, bez produkcijske kompresije.
Potpuni izvještaji i sažetak nalaze se u [qa/](qa/lighthouse-summary.json).

Uz preloade fontova, uklonjeno je kasno skupljanje mobilnog izbornika nakon
prvog prikaza. Izbornik se priprema skriven, a bez JavaScripta vidljiv je zaseban
semantički navigacijski blok. Time je izbjegnuto pomicanje cijelog glavnog sadržaja.

## Statične provjere

[Potpuni izlaz traženih naredbi](qa/commands.txt):

- `python3 scripts/build.py`: 14 generiranih izlaza, uključujući sitemap.
- `python3 scripts/check.py`: 13 HTML stranica, vlastiti canonical, recipročne
  jezične poveznice, valjan JSON-LD, ispravni hashirani resursi, sidra, sitemap,
  preusmjerenja i nepromijenjeni izvorni engleski opseg i cijene.
- `node --check js/main.js` i `node --check js/motion.js`: prolaze.
- `python3 scripts/export.py`: čist javni izvoz `dist/`.
- `git diff --check`: prolazi.

Jedini dopušteni neriješeni podaci su `{{ADRESA_OBRTA}}`, `{{OIB}}` i
`{{PDV_NAPOMENA}}`. Nema izvršivih inline skripti, inline stilova ili event
handlera u javnom HTML-u. JSON-LD je podatkovna skripta. CSP i preusmjerenja
provjereni su kroz lokalni statični QA poslužitelj koji primjenjuje konfiguraciju.

## Preglednik i pristupačnost

[211 osnovnih provjera](qa/browser-checks.json) i
[13 dodatnih provjera](qa/edge-checks.json) prošli su u Chromiumu:

- svih 11 stvarnih sadržajnih stranica, uz provjeru preusmjerenja;
- širine 360, 390, 600, 768, 801, 1024 i 1440 px bez vodoravnog prelijevanja;
- tekst od najmanje 12 px i dodirne površine od najmanje 44 × 44 px;
- besplatna analiza vidljiva bez skrolanja na 390 × 844, bez prozora o kolačićima;
- axe WCAG 2 A/AA i 2.1 AA na svim sadržajnim stranicama bez prijavljenih kršenja;
- izbornik usluga, Escape, početni skip link, nativni detalji i tri odabira paketa;
- navigacija, pune cijene i stvarna POST alternativa obrazaca bez JavaScripta;
- tri blago lebdeća panela, hrvatska pauza/nastavak i promjena reduced-motion
  postavke tijekom rada; ilustracija je skrivena ispod 600 px;
- brisanje starog cookie ključa, bez nove pohrane, te rad uz blokiranu pohranu;
- hrvatska i engleska validacija, točan subject kontakta i analize, URL bez
  protokola, odbijanje nevaljanog URL-a i telefonski kontakt;
- HTTP 500 sa `success: true` i HTTP 200 sa `success: false` ne glume uspjeh;
  prekid veze i timeout čuvaju podatke i otključavaju obrazac;
- potvrđeni HTTP uspjeh, reset, honeypot i fokus nakon potvrde.

Web3Forms odgovori bili su simulirani. **Nijedna stvarna poruka nije poslana.**
Početno učitavanje nema zahtjeva trećim stranama, nekontroliranih JS pogrešaka
ili CSP pogrešaka. Namjerno simulirani HTTP 500 odgovori odvojeni su od provjere
pogrešaka pri učitavanju. Lokalni fontovi pregledani su u prikazu i provjereni za
hrvatske znakove `č ć đ š ž Č Ć Đ Š Ž`.

## Vizualni pregled

Pregledane su pune snimke, naslovnica, kontakt i društvena slika. Hrvatska i
engleska društvena slika su odvojene. Fotografija pergole je autentični postojeći
resurs, sada sa 600w i 1100w inačicom. Portret nije dostavljen, pa su prikazani
jasno označeni inicijali. Oblak se koristi samo kao logotip.

- [Naslovnica, desktop 1440](screenshots/hr-home-desktop.png)
- [Naslovnica, mobitel 390](screenshots/hr-home-mobile.png)
- [Usluga, desktop 1440](screenshots/hr-service-desktop.png)
- [Usluga, mobitel 390](screenshots/hr-service-mobile.png)
- [Analiza, mobitel 390](screenshots/hr-analysis-mobile.png)

Mobilni pregled koristi emulaciju, ne fizičke iOS/Android uređaje. Automatski
alati ne dokazuju potpunu pristupačnost; uz njih provjereni su čitanje, tipkovnica,
razmaci, kontrast i razumljivost sadržaja. Stvarna dostava, pravni podaci, PDV,
portret i eventualne stvarne recenzije ostaju vlasnikove stavke iz
[launch.md](launch.md).

## Odstupanja prema zadnjoj uputi vlasnika

Primarno tržište je Hrvatska i EU, ne isključivo Slavonski Brod. Zbog toga je
usluga na `/izrada-web-stranica/`; prvotno predloženi lokalni URL preusmjerava se
na nju. Slavonski Brod ostaje lokacija u poslovnim podacima. Spomenutih pet JPG
mockupa nije bilo u prilogu; korišten je postojeći dizajn sustav.
