/* Original scene motion. Scroll remains native; no animation library or tracking. */
(() => {
  "use strict";
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const header = document.querySelector(".header");
  const hero = document.querySelector(".sky-hero");
  const sections = [
    ...document.querySelectorAll(".sky-hero, .city-section, .process-section"),
  ];
  const reveals = [...document.querySelectorAll("[data-reveal]")];
  let revealObserver;
  let sceneObserver;
  let frame = 0;
  let heroHeight = hero?.offsetHeight || 1;

  function update() {
    frame = 0;
    header?.classList.toggle("is-scrolled", scrollY > 24);
    if (
      hero &&
      !reduced.matches &&
      !hero.classList.contains("motion-offscreen")
    ) {
      hero.style.setProperty(
        "--scene-shift",
        `${Math.min(55, scrollY * 0.08).toFixed(1)}px`,
      );
      const progress = Math.min(1, scrollY / heroHeight);
      hero.style.setProperty("--board-scale", (1 + progress * 0.12).toFixed(3));
      hero.style.setProperty(
        "--person-shift",
        `${(progress * 85).toFixed(1)}px`,
      );
    }
  }
  function onScroll() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  function setup() {
    revealObserver?.disconnect();
    sceneObserver?.disconnect();
    root.classList.remove("motion-ready");
    reveals.forEach((el) => el.classList.remove("will-reveal", "is-visible"));
    sections.forEach((el) => el.classList.remove("motion-offscreen"));
    hero?.style.removeProperty("--scene-shift");
    hero?.style.removeProperty("--board-scale");
    hero?.style.removeProperty("--person-shift");
    if (reduced.matches) return;
    root.classList.add("motion-ready");
    if ("IntersectionObserver" in window) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.06, rootMargin: "0px 0px -24px 0px" },
      );
      for (const el of reveals) {
        if (el.getBoundingClientRect().top > innerHeight) {
          el.classList.add("will-reveal");
          revealObserver.observe(el);
        }
      }
      sceneObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries)
            entry.target.classList.toggle(
              "motion-offscreen",
              !entry.isIntersecting,
            );
        },
        { threshold: 0 },
      );
      sections.forEach((el) => sceneObserver.observe(el));
    }
    update();
  }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener(
    "resize",
    () => {
      heroHeight = hero?.offsetHeight || 1;
      onScroll();
    },
    { passive: true },
  );
  document.addEventListener("visibilitychange", () =>
    root.classList.toggle("tab-inactive", document.hidden),
  );
  reduced.addEventListener("change", setup);
  setup();
  update();
})();
