/* Motion stays local: no libraries, tracking or saved browser preferences. */
(() => {
  "use strict";
  const root = document.documentElement;
  const hr = root.lang === "hr";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const journey = document.querySelector(".journey");
  const button = document.querySelector("[data-motion-toggle]");
  if (!journey || !button) return;

  let paused = false;
  let observer;
  let heroObserver;
  const reveals = [
    ...document.querySelectorAll(
      ".section-heading, .packages > .package, .monthly, .project-visual, .project-copy, .project-phases, .process > li, .faq-section > div, .contact-layout > div",
    ),
  ];

  function renderButton() {
    button.dataset.paused = String(paused);
    button.querySelector("[data-motion-label]").textContent = paused
      ? hr
        ? "Nastavite animacije"
        : "Resume animations"
      : hr
        ? "Pauzirajte animacije"
        : "Pause animations";
    button.querySelector("[data-motion-icon]").textContent = paused
      ? "▶"
      : "Ⅱ";
  }
  function pause(value) {
    paused = value;
    root.classList.toggle("motion-paused", paused);
    if (paused) {
      reveals.forEach((el) => el.classList.add("is-visible"));
    }
    renderButton();
  }
  function setup() {
    observer?.disconnect();
    heroObserver?.disconnect();
    root.classList.remove("motion-ready", "hero-offscreen", "tab-inactive");
    reveals.forEach((el) => el.classList.remove("will-reveal", "is-visible"));
    button.hidden = reduced.matches;
    if (reduced.matches) return;

    root.classList.add("motion-ready");
    root.classList.toggle("motion-paused", paused);
    renderButton();
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
      );
      reveals.forEach((el, index) => {
        el.classList.add(`reveal-delay-${index % 3}`);
        if (!paused && el.getBoundingClientRect().top > innerHeight - 30) {
          el.classList.add("will-reveal");
          observer.observe(el);
        }
      });
      heroObserver = new IntersectionObserver(
        (entries) => {
          root.classList.toggle("hero-offscreen", !entries[0].isIntersecting);
        },
        { threshold: 0 },
      );
      heroObserver.observe(journey);
    }
  }
  button.addEventListener("click", () => pause(!paused));
  reduced.addEventListener("change", setup);
  document.addEventListener("visibilitychange", () => {
    root.classList.toggle("tab-inactive", document.hidden);
  });
  setup();
})();
