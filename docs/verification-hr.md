# Provjera hrvatske i engleske verzije

Naknadna uputa vlasnika: uklonjeni su opis ispod hero ilustracije i gumb za
animacije u oba jezika. Lagano lebdenje, zaustavljanje izvan ekrana i
`prefers-reduced-motion` ostaju. Brojevi ispod odnose se na prethodnu cjelovitu
provjeru; ova je izmjena zasebno provjerena na oba jezika i na mobitelu.

Provjereno 21. listopada 2026. Grana `redesign/hr-polish`, cilj pull requesta
`redesign/hr-lokalno`. Nije izveden deploy; javni Sites preview nije mijenjan.

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

## Dorada F1–F12, 21. listopada 2026.

Mjereno skriptom [`scripts/qa_browser.py`](../scripts/qa_browser.py) (Playwright,
razvojni alat) na 390 × 844 i 1440 × 900, uz onemogućene reveal animacije kako bi
sav sadržaj bio mjerljiv. Sažetak izlaza: [qa/browser-checks.json](qa/browser-checks.json). Stupac „prije“
izmjeren je istim alatom nad commitom `5aab9bc` u odvojenom checkoutu. Zbroj je
po svim provjerenim stranicama i objema širinama; labele manje od 14 px dio su i
retka o tekstu manjem od 12 px.

| Provjera | Prije | Poslije | Cilj |
| --- | ---: | ---: | ---: |
| Vidljive oznake `{{` u tekstu | 38 | 0 | 0 |
| Tekst manji od 12 px | 23 | 0 | 0 |
| Labele obrazaca manje od 14 px | 17 | 0 | ≥ 14 px |
| Dodirni ciljevi manji od 44 px | 17 | 0 | 0 |
| Kontrast ispod 4,5 : 1 | 0 | 0 | 0 |
| Spojene riječi u naslovima | 2 | 0 | 0 |
| Greške u konzoli | 0 | 0 | 0 |
| Vodoravno prelijevanje na 360 px | ne | ne | ne |
| Visina naslovnice na 390 px | 9.715 px | 8.398 px | ≤ 8.000 px |
| Riječi vidljivog teksta na naslovnici | 894 | 754 | — |
| Vidljive stavke trake usluga na 390 px | 2 od 4 | 4 od 4 | 4 |

Cilj visine nije dosegnut: preostalih 398 px (4,7 %) nalazi se u sekcijama koje
upute štite od skraćivanja — hero, česta pitanja, kontakt i kartice paketa s
cijenama. Skraćen je tekst mjesečnih usluga, koraka, primjera projekta i „O meni“,
te su stisnuti okomiti razmaci na mobitelu; veličine slova, boje i redoslijed
sekcija nisu mijenjani.

Oba obrasca na naslovnici provjerena su protiv simuliranog odgovora: HTTP 200
`{success:true}` prikazuje potvrdu, HTTP 500 prikazuje poruku greške i zadržava
upisane vrijednosti. Bez JavaScripta obje su forme vidljive s naslovima.
**Nijedna stvarna poruka nije poslana.**

Potvrda slanja prikazuje se kao prozor u stilu ranih operativnih sustava, s
trakom naslova i pikselnim gumbom za zatvaranje koji vraća obrazac. Animacija
poštuje `prefers-reduced-motion`, a gumb zadržava površinu 44 × 44 px.
