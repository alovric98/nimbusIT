/* Motion stays local: no libraries, tracking or saved browser preferences. */
(() => {
  "use strict";
  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const journey = document.querySelector(".journey");
  if (!journey) return;

  let observer;
  let heroObserver;
  const reveals = [
    ...document.querySelectorAll(
      ".section-heading, .packages > .package, .monthly, .project-visual, .project-copy, .project-phases, .process > li, .faq-section > div, .contact-layout > div",
    ),
  ];

  function setup() {
    observer?.disconnect();
    heroObserver?.disconnect();
    root.classList.remove("motion-ready", "hero-offscreen", "tab-inactive");
    reveals.forEach((el) => el.classList.remove("will-reveal", "is-visible"));
    if (reduced.matches) return;

    root.classList.add("motion-ready");
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
        if (el.getBoundingClientRect().top > innerHeight - 30) {
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
  reduced.addEventListener("change", setup);
  document.addEventListener("visibilitychange", () => {
    root.classList.toggle("tab-inactive", document.hidden);
  });
  setup();
})();
