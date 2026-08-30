/* ==========================================================================
   NimbusIT — main.js (Korak 3: kostur)
   Sadrži samo ono što struktura treba da radi: mobilni izbornik,
   provjeru obrasca i slanje bez napuštanja stranice.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- godina u podnožju ---------- */
  document.querySelectorAll('[data-godina]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- mobilni izbornik ---------- */
  var gumb = document.querySelector('.izbornik-gumb');
  var izbornik = document.getElementById('glavni-izbornik');

  if (gumb && izbornik) {
    var postavi = function (otvoren) {
      gumb.setAttribute('aria-expanded', String(otvoren));
      izbornik.classList.toggle('je-otvoren', otvoren);
    };

    gumb.addEventListener('click', function () {
      postavi(gumb.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && gumb.getAttribute('aria-expanded') === 'true') {
        postavi(false);
        gumb.focus();
      }
    });

    // Zatvori kad se prijeđe na širi ekran, da izbornik ne ostane zaključan
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) postavi(false);
    });
  }

  /* ---------- obrazac ---------- */
  var obrazac = document.getElementById('kontakt-obrazac');
  if (!obrazac) return;

  var status = obrazac.querySelector('.obrazac__status');
  var potvrda = document.getElementById('potvrda');

  var PORUKE = {
    prazno: 'Ovo polje je obavezno.',
    email: 'Provjerite e-mail adresu — nedostaje @ ili nastavak.',
    telefon: 'Upišite broj na koji vas mogu dobiti.',
    privola: 'Bez ovoga vam ne smijem odgovoriti.',
    slanje: 'Šaljem…',
    greska: 'Slanje nije uspjelo. Nazovite me na +385 98 915 7800 ili pišite na info.nimbusit@gmail.com.'
  };

  function prikaziGresku(polje, poruka) {
    var omotac = polje.closest('.polje');
    var el = obrazac.querySelector('[data-greska-za="' + polje.id + '"]');
    if (omotac) omotac.classList.add('polje--nevaljano');
    polje.setAttribute('aria-invalid', 'true');
    if (el) { el.textContent = poruka; el.hidden = false; }
  }

  function ocistiGresku(polje) {
    var omotac = polje.closest('.polje');
    var el = obrazac.querySelector('[data-greska-za="' + polje.id + '"]');
    if (omotac) omotac.classList.remove('polje--nevaljano');
    polje.removeAttribute('aria-invalid');
    if (el) { el.hidden = true; el.textContent = ''; }
  }

  function provjeriPolje(polje) {
    ocistiGresku(polje);

    if (polje.type === 'checkbox') {
      if (polje.required && !polje.checked) { prikaziGresku(polje, PORUKE.privola); return false; }
      return true;
    }

    var vrijednost = (polje.value || '').trim();

    if (polje.required && vrijednost === '') { prikaziGresku(polje, PORUKE.prazno); return false; }
    if (vrijednost === '') return true;

    if (polje.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(vrijednost)) {
      prikaziGresku(polje, PORUKE.email); return false;
    }
    if (polje.type === 'tel' && vrijednost.replace(/\D/g, '').length < 8) {
      prikaziGresku(polje, PORUKE.telefon); return false;
    }
    return true;
  }

  var polja = Array.prototype.slice.call(
    obrazac.querySelectorAll('input:not([type="hidden"]), select, textarea')
  ).filter(function (p) { return p.name !== 'botcheck'; });

  polja.forEach(function (polje) {
    polje.addEventListener('blur', function () { provjeriPolje(polje); });
    polje.addEventListener('input', function () {
      if (polje.getAttribute('aria-invalid') === 'true') provjeriPolje(polje);
    });
  });

  obrazac.addEventListener('submit', function (e) {
    e.preventDefault();

    // honeypot: ako je popunjeno, tiho odustani
    var med = obrazac.querySelector('[name="botcheck"]');
    if (med && med.value !== '') return;

    var prvoNevaljano = null;
    polja.forEach(function (polje) {
      if (!provjeriPolje(polje) && !prvoNevaljano) prvoNevaljano = polje;
    });
    if (prvoNevaljano) { prvoNevaljano.focus(); return; }

    var gumbSlanje = obrazac.querySelector('button[type="submit"]');
    if (gumbSlanje) gumbSlanje.disabled = true;
    if (status) { status.hidden = false; status.textContent = PORUKE.slanje; }

    fetch(obrazac.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(obrazac)
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data.success) throw new Error(data.message || 'greska');
        obrazac.hidden = true;
        if (potvrda) {
          potvrda.hidden = false;
          potvrda.setAttribute('tabindex', '-1');
          potvrda.focus();
          potvrda.scrollIntoView({ block: 'start' });
        }
      })
      .catch(function () {
        if (status) status.textContent = PORUKE.greska;
        if (gumbSlanje) gumbSlanje.disabled = false;
      });
  });
})();

/* ==========================================================================
   Animacije
   Sve ovisi o postavci "smanji animacije" na uređaju. Ako je uključena,
   ovaj dio ne radi ništa i stranica je odmah u konačnom stanju.
   ========================================================================== */
(function () {
  'use strict';

  var mirno = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- otkrivanje sadržaja pri skrolanju ---------- */
  var stavke = document.querySelectorAll('[data-anim]');

  if (mirno || !('IntersectionObserver' in window)) {
    stavke.forEach(function (el) { el.classList.add('vidljivo'); });
  } else {
    var promatrac = new IntersectionObserver(function (unosi) {
      unosi.forEach(function (u) {
        if (!u.isIntersecting) return;
        u.target.classList.add('vidljivo');
        promatrac.unobserve(u.target);   // svaki element se otkriva samo jednom
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    stavke.forEach(function (el) { promatrac.observe(el); });
  }

  /* ---------- brojke se izbrajaju ---------- */
  function izbroji(el) {
    var cilj = parseInt(el.dataset.broj, 10);
    var sufiks = el.dataset.sufiks || '';
    if (isNaN(cilj)) return;

    var trajanje = 1100, pocetak = null;

    function korak(vrijeme) {
      if (pocetak === null) pocetak = vrijeme;
      var t = Math.min((vrijeme - pocetak) / trajanje, 1);
      var lako = 1 - Math.pow(1 - t, 3);          // usporava pred kraj
      el.textContent = Math.round(cilj * lako) + (t === 1 ? sufiks : '');
      if (t < 1) requestAnimationFrame(korak);
    }
    el.textContent = '0';
    requestAnimationFrame(korak);
  }

  var brojke = document.querySelectorAll('[data-broj]');
  if (!mirno && brojke.length) {
    // kreće nakon ulazne sekvence naslova, da se ne preklapaju
    setTimeout(function () { brojke.forEach(izbroji); }, 620);
  }

  /* ---------- zaglavlje dobiva sjenu tek kad se skrola ---------- */
  var zaglavlje = document.querySelector('.zaglavlje');
  if (zaglavlje) {
    var zadnje = null;
    var provjeri = function () {
      var sad = window.scrollY > 8;
      if (sad !== zadnje) { zaglavlje.classList.toggle('je-skrolano', sad); zadnje = sad; }
    };
    provjeri();
    window.addEventListener('scroll', provjeri, { passive: true });
  }

  /* ---------- u izborniku se označava sekcija u kojoj se nalazimo ---------- */
  var veze = document.querySelectorAll('.navigacija ul a[href^="#"]');
  if (veze.length && 'IntersectionObserver' in window) {
    var poId = {};
    var ciljevi = [];
    veze.forEach(function (a) {
      var el = document.querySelector(a.getAttribute('href'));
      if (el) { poId[el.id] = a; ciljevi.push(el); }
    });

    var pratitelj = new IntersectionObserver(function (unosi) {
      unosi.forEach(function (u) {
        var a = poId[u.target.id];
        if (a) a.classList.toggle('je-tu', u.isIntersecting);
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    ciljevi.forEach(function (el) { pratitelj.observe(el); });
  }
})();


/* ==========================================================================
   Interakcija
   ========================================================================== */
(function () {
  'use strict';

  var mirno = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- traka napretka čitanja ---------- */
  var traka = document.querySelector('.napredak span');
  if (traka) {
    var ceka = false;
    var crtaj = function () {
      var doseg = document.documentElement.scrollHeight - window.innerHeight;
      var udio = doseg > 0 ? (window.scrollY / doseg) : 0;
      traka.style.width = (Math.min(Math.max(udio, 0), 1) * 100) + '%';
      ceka = false;
    };
    window.addEventListener('scroll', function () {
      if (!ceka) { ceka = true; requestAnimationFrame(crtaj); }
    }, { passive: true });
    window.addEventListener('resize', crtaj, { passive: true });
    crtaj();
  }

  /* ---------- projekti: otvoren je samo jedan ---------- */
  var projekti = document.querySelectorAll('.projekt');
  projekti.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      projekti.forEach(function (drugi) { if (drugi !== d) drugi.open = false; });
    });
  });

  /* ---------- klik na uslugu ispuni obrazac ---------- */
  var izbor = document.getElementById('usluga');
  document.querySelectorAll('[data-usluga]').forEach(function (kartica) {
    kartica.addEventListener('click', function () {
      if (!izbor) return;
      var trazena = kartica.dataset.usluga;
      var nasao = Array.prototype.some.call(izbor.options, function (o) {
        if (o.text.trim() !== trazena) return false;
        izbor.value = o.value || o.text;
        return true;
      });
      if (!nasao) return;

      var omotac = izbor.closest('.polje');
      if (omotac && !mirno) {
        omotac.classList.add('polje--doskocilo');
        setTimeout(function () { omotac.classList.remove('polje--doskocilo'); }, 1800);
      }
    });
  });
})();


/* ==========================================================================
   Dubina
   Naginjanje ploha prema pokazivaču i slojevi koji se kreću različitim
   brzinama. Sve se piše u CSS varijable, a crta ih preglednik — nijedan
   izračun ne dira raspored stranice.
   Na dodirnim uređajima naginjanje se ne uključuje.
   ========================================================================== */
(function () {
  'use strict';

  var mirno = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (mirno) return;

  var pokazivac = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- naginjanje prema pokazivaču ---------- */
  if (pokazivac) {
    var NAGIB = 7;   // najveći nagib u stupnjevima

    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      var ceka = false, zadnji = null;

      function crtaj() {
        ceka = false;
        if (!zadnji) return;
        var o = el.getBoundingClientRect();
        var x = (zadnji.clientX - o.left) / o.width;
        var y = (zadnji.clientY - o.top) / o.height;
        el.style.setProperty('--ry', ((x - 0.5) * NAGIB * 2).toFixed(2) + 'deg');
        el.style.setProperty('--rx', ((0.5 - y) * NAGIB).toFixed(2) + 'deg');
        el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      }

      el.addEventListener('pointerenter', function () { el.classList.add('je-nagnut'); });
      el.addEventListener('pointermove', function (e) {
        zadnji = e;
        if (!ceka) { ceka = true; requestAnimationFrame(crtaj); }
      });
      el.addEventListener('pointerleave', function () {
        el.classList.remove('je-nagnut');
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ---------- slojevi koji klize različitim brzinama ---------- */
  var slojevi = Array.prototype.map.call(
    document.querySelectorAll('[data-dubina]'),
    function (el) { return { el: el, faktor: parseFloat(el.dataset.dubina) || 0, unutra: true }; }
  );

  if (!slojevi.length) return;

  // sloj se računa samo dok je na ekranu
  if ('IntersectionObserver' in window) {
    var oko = new IntersectionObserver(function (unosi) {
      unosi.forEach(function (u) {
        var s = slojevi.filter(function (x) { return x.el === u.target; })[0];
        if (s) s.unutra = u.isIntersecting;
      });
    }, { rootMargin: '120px 0px' });
    slojevi.forEach(function (s) { oko.observe(s.el); });
  }

  var ceka2 = false;
  function pomakni() {
    ceka2 = false;
    var y = window.scrollY;
    slojevi.forEach(function (s) {
      if (!s.unutra) return;
      s.el.style.setProperty('--pomak', (y * s.faktor).toFixed(1) + 'px');
    });
  }
  window.addEventListener('scroll', function () {
    if (!ceka2) { ceka2 = true; requestAnimationFrame(pomakni); }
  }, { passive: true });
  pomakni();
})();
