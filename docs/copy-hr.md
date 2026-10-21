# Hrvatski tekst — NimbusIT

Radna grana: `redesign/hr-copy`, iz `master` commita `bf659d6`.
Prije izmjena pregledana je stvarna produkcija na https://nimbusit.hr/.
Zadržane su novije dorade mobilnog prikaza, kontaktne kartice, oba obrasca,
izgled, animacije te dopunjeni podaci obrta i porezna napomena.

## Smjer teksta

**Pokažite što vaš posao vrijedi.**

Web dizajn i digitalni marketing za poduzetnike koji imaju što ponuditi.
Pokažimo to budućim klijentima.

Uvod predstavlja ponudu i kome je namijenjena. Pristup ukratko prolazi
vidljivost, povjerenje, razgovor i daljnji razvoj. Podrobnija objašnjenja
ostaju na stranicama usluga i u detaljima paketa. Koristi se malo slovo
u obraćanju „vi/vaš“, jednostavni pozivi i kratke potvrde slanja.

## Reference

- [JT Digital](https://jt-digital.eu/): ponuda i razlog za suradnju prije
  tehničkih detalja, zatim usluge i konkretni projekti.
- [JT Digital — web i oglašavanje](https://jt-digital.eu/blog/): povezanost
  ponude, stranice i kampanje objašnjena iz perspektive kupca.
- [Dreamwave](https://dreamwave-digital.com/): kratki naslovi, vidljiv
  identitet i jednostavan kontakt.

Tekst je nov. Nisu preuzete njihove rečenice, klijenti, rezultati,
recenzije, certifikati, članovi tima ni usluge koje NimbusIT ne nudi.

## Opseg dorade

- Hrvatska naslovnica, tri stranice usluga i besplatna analiza.
- Nazivi i opisi paketa te mjesečnih usluga, FAQ i tekstovi obrazaca.
- Naslovi i opisi za tražilice te hrvatska slika za dijeljenje.
- Inicijali AL ostaju inicijali; natpis nosi ime i naziv obrta.
- Ponovljeni naziv projekta i podaci obrta uklonjeni su iz tijela
  naslovnice. Puni pravni podaci ostaju u zajedničkom podnožju.

Cijene, broj stranica, kampanja, ulaznih podataka, integracija, izmjena i
sati nisu povećani. Zasebno su navedeni izrada, mjesečno vođenje, oglasni
budžet, hosting, domena, licence i alati. Engleski sadržaj ostaje sačuvan.
U primjeru pergola zadržana je razlika između izrađenih funkcija i
planiranih kampanja. Vanjski projekt nije mijenjan.

## Provjera

- `build.py --release`, `check.py`, `export.py`, provjera sintakse oba JS-a
  i `git diff --check` prolaze. Provjereno je svih 13 generiranih stranica,
  metapodataka, poveznica, strukturiranih podataka i cijena.
- Postojeći `qa_browser.py` izvršen je u lokalnom Chromiumu: 14 kombinacija
  stranice i prikaza te 4 provjere oba obrasca sa simuliranim odgovorima.
  Provjere teksta, kontrasta, dodirnih površina, konzole, prelijevanja i
  obrazaca prolaze. Prave poruke nisu slane.
- **Jedna postojeća provjera ostaje crvena:** fiksni limit visine naslovnice
  od 8.000 px. Na 390 px izmjerena produkcijska polazna verzija ima 8.586 px,
  a nova 8.248 px. Stranica je kraća za 338 px; prag testa i CSS nisu mijenjani
  radi tog rezultata. Puni rezultat sa sačuvanim neuspjehom je u
  `docs/qa/hr-copy-browser-checks.json`, usporedba u `hr-copy-baseline.json`.
- Chrome DevTools MCP zasebno je provjerio prikaze 320, 390 i 1440 px,
  font, nulto vodoravno prelijevanje i zaustavljanje animacija uz reduced
  motion. Stvarnim klikovima provjereni su uvod → analiza, cijene → cjenik
  i paket → odabrani paket u projektnom obrascu. Rezultat je u
  `docs/qa/hr-copy-mcp-checks.json`.
- Vizualno pregledani desktop, mobitel i slika za dijeljenje. Snimke uvoda:
  `docs/screenshots/hr-copy-home-desktop.png` i `hr-copy-home-mobile.png`.
  Mobilne provjere koriste emulaciju, ne fizički telefon.

## Objava

Dorada je prvo pripremljena za pregled na zasebnoj grani, bez objave.
Vlasnik je 21. listopada 2026. naknadno izričito odobrio push u produkcijsku
granu i objavu putem postojeće Cloudflare integracije. Produkcijska grana ovog
repozitorija je `master`. Ta uputa zamjenjuje raniju uputu „Ne deployaj“.
DNS, postavke Cloudflare računa, oglasi i praćenje ostaju u postojećem stanju.
