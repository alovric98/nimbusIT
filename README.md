# nimbusit.hr

Prezentacijska stranica NimbusIT-a. Čisti HTML, CSS i JavaScript — bez frameworka,
bez build koraka i bez ijednog vanjskog zahtjeva.

## Struktura

```
index.html      cijela stranica (one-pager)
404.html        stranica za nepostojeće adrese
css/style.css   jedini stylesheet
js/main.js      izbornik, obrazac, animacije
img/            favicon, ikona za mobitel, og slika
dokumenti/      primjer izvještaja u PDF-u
robots.txt      dopuštenje tražilicama + poveznica na sitemap
sitemap.xml     popis adresa za Google
_headers        zaglavlja i predmemorija za Cloudflare Pages
```

## Objava

Cloudflare Pages, bez build naredbe. Postavke:

- **Build command:** ostaviti prazno
- **Build output directory:** `/`

Sve datoteke se poslužuju kakve jesu.

## Izmjene

Tekst se mijenja izravno u `index.html`. Boje i razmaci su na vrhu `css/style.css`
kao varijable — mijenja se ondje, ne kroz cijelu datoteku.

Primjer izvještaja izrađuje se iz zasebne HTML datoteke i pretvara u PDF
otvaranjem u pregledniku pa Ispis → Spremi kao PDF.

## Ne dirati bez razloga

- Redak `<script>document.documentElement.classList.add('js')</script>` u zaglavlju.
  Bez njega animacije pri skrolanju prestaju raditi.
- `access_key` u obrascu — vezan je na info.nimbusit@gmail.com. Ako se promijeni,
  upiti prestaju stizati.
