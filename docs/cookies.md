> Povijesna bilješka prethodne verzije. U grani `redesign/hr-lokalno` prozor i
> pohrana uklonjeni su; aktualno stanje opisuje `docs/verification-hr.md`.

# Kolačići i lokalna pohrana

Dodano na NimbusIT grani `redesign/retro-digital`, bez promjene produkcije.

- Nova stranica `/kolacici/`, poveznice iz podnožja svih javnih stranica te
  informacijska obavijest usklađena s vizualnim stilom.
- Ne učitavaju se analitičke ili oglasne oznake. Nema opcija za prihvaćanje
  nepostojećeg praćenja. Zatvaranje obavijesti ne daje takvu privolu.
- Na izričit zahtjev posjetitelja `localStorage` pamti verziju i vrijeme
  zatvaranja. Nema identifikatora, podataka iz obrasca ili prijenosa zapisa
  vanjskim servisima. Odabir vrijedi 180 dana i provjerava se pri otvaranju
  stranice; istekao zapis tada se briše.
- Obavijest se može ponovno otvoriti i odabir izbrisati. Escape zatvara
  obavijest bez pamćenja. Fokus se vraća gumbu koji ju je otvorio.
- Pristup pohrani zaštićen je od grešaka, uključujući zabranu pohrane i
  nevaljan JSON. Neuspjelo brisanje ne prikazuje lažnu potvrdu uspjeha.
- Bez JavaScripta pravila i poveznice rade, a kontrolni gumbi su skriveni.

Prošlo je 36 provjera ponašanja u Chromiumu, uključujući 320 px zaslon,
landscape 600 × 250, istek odabira, blokiranu pohranu, povrat fokusa i
nepromijenjen rad validacije kontakta. Axe WCAG A/AA provjera obavijesti na
mobitelu i desktopu nije prijavila kršenja. Nema novih zahtjeva prema trećim
stranama ili stvarnih testnih slanja obrasca.

Prije eventualnog dodavanja praćenja potreban je zaseban mehanizam privole koji
te alate stvarno blokira do odabira, omogućuje odbijanje i povlačenje privole te
briše/zaustavlja odgovarajuću pohranu. Postojeća potvrda obavijesti ne smije se
koristiti za aktiviranje novih alata. Pregledati stvarnu konfiguraciju produkcije
ako se promijene hosting ili integracije. Privatni ChatGPT pregled ima vlastiti
sloj prijave koji nije dio NimbusIT aplikacije.

Temelj za opseg, pregledano 20. listopada 2026.:
[AZOP – obrada podataka putem kolačića](https://azop.hr/obrada-osobnih-podataka-kolacici/)
i [AZOP – kolačići i usklađivanje](https://azop.hr/kolacici-gdpr/).
