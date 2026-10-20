/* Information notice only. No optional tracking is configured or loaded. */
(() => {
  "use strict";
  const storageKey = "nimbusit.cookie-notice.v1";
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const openers = [...document.querySelectorAll("[data-cookie-notice]")];
  let returnFocus = null;

  function remembered() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      const age = Date.now() - saved?.dismissedAt;
      if (saved?.version === 1 && Number.isFinite(age) && age >= lifetime) {
        localStorage.removeItem(storageKey);
        return false;
      }
      return (
        saved?.version === 1 &&
        Number.isFinite(age) &&
        age >= 0 &&
        age < lifetime
      );
    } catch (_) {
      return false;
    }
  }

  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <section class="cookie-notice window" id="cookie-notice" aria-labelledby="cookie-notice-title" tabindex="-1" hidden>
      <div class="window__bar"><span class="window__dots" aria-hidden="true"><i></i><i></i><i></i></span><span>PRIVATNOST / KOLAČIĆI</span></div>
      <div class="cookie-notice__body">
        <h2 class="pixel" id="cookie-notice-title">Malo o kolačićima.</h2>
        <p>Ova stranica ne koristi analitičke ni oglasne kolačiće. Ako želite, mogu zapamtiti da ste zatvorili ovu obavijest na 180 dana.</p>
        <div class="cookie-notice__actions">
          <button class="button button--mint" type="button" data-cookie-dismiss>U redu, zapamti <span aria-hidden="true">✓</span></button>
          <a href="/kolacici/">Pravila o kolačićima <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>`,
  );

  const notice = document.getElementById("cookie-notice");
  function show(opener) {
    returnFocus = opener || null;
    notice.hidden = false;
    if (opener) notice.focus({ preventScroll: true });
  }
  function close(remember) {
    if (remember) {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({ version: 1, dismissedAt: Date.now() }),
        );
      } catch (_) {
        // The site remains usable when browser storage is unavailable.
      }
    }
    const hadFocus = notice.contains(document.activeElement);
    notice.hidden = true;
    if (hadFocus) {
      const target = returnFocus || document.querySelector("main");
      if (target) {
        if (!returnFocus) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    }
    returnFocus = null;
  }
  notice
    .querySelector("[data-cookie-dismiss]")
    .addEventListener("click", () => close(true));
  notice.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close(false);
  });
  openers.forEach((button) => {
    button.hidden = false;
    button.addEventListener("click", () => show(button));
  });
  document.querySelectorAll("[data-cookie-forget]").forEach((button) => {
    button.hidden = false;
    button.addEventListener("click", () => {
      let removed = false;
      try {
        localStorage.removeItem(storageKey);
        removed = true;
      } catch (_) {
        // Report the storage limitation instead of claiming deletion.
      }
      const status = document.getElementById("cookie-storage-status");
      if (status) {
        status.hidden = false;
        status.textContent = removed
          ? "Zapamćeni odabir je izbrisan. Obavijest je ponovno otvorena."
          : "Preglednik nije dopustio brisanje zapisa. Obrišite podatke ove stranice u postavkama preglednika.";
      }
      show(button);
    });
  });
  if (!remembered()) show();
})();
