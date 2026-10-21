/* Motion stays local: no libraries, tracking or saved browser preferences. */
(() => {
  "use strict";
  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const journey = document.querySelector(".journey");
  const button = document.querySelector("[data-motion-toggle]");
  if (!journey || !button) return;

  let paused = false;
  let observer;
  let heroObserver;
  let frame = 0;
  let pointer;
  const reveals = [
    ...document.querySelectorAll(
      ".section-heading, .packages > .package, .monthly, .project-visual, .project-copy, .project-phases, .process > li, .faq-section > div, .contact-layout > div",
    ),
  ];

  function resetPointer() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    journey.style.removeProperty("--pointer-x");
    journey.style.removeProperty("--pointer-y");
  }
  function renderButton() {
    button.dataset.paused = String(paused);
    button.querySelector("[data-motion-label]").textContent = paused
      ? "Resume animations"
      : "Pause animations";
    button.querySelector("[data-motion-icon]").textContent = paused
      ? "▶"
      : "Ⅱ";
  }
  function pause(value) {
    paused = value;
    root.classList.toggle("motion-paused", paused);
    if (paused) {
      resetPointer();
      reveals.forEach((el) => el.classList.add("is-visible"));
    }
    renderButton();
  }
  function setup() {
    observer?.disconnect();
    heroObserver?.disconnect();
    resetPointer();
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
        el.style.setProperty("--reveal-delay", `${(index % 3) * 60}ms`);
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
  journey.addEventListener(
    "pointermove",
    (event) => {
      if (paused || reduced.matches || !finePointer.matches) return;
      pointer = { x: event.clientX, y: event.clientY };
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const box = journey.getBoundingClientRect();
        const x = Math.max(
          -1,
          Math.min(1, ((pointer.x - box.left) / box.width - 0.5) * 2),
        );
        const y = Math.max(
          -1,
          Math.min(1, ((pointer.y - box.top) / box.height - 0.5) * 2),
        );
        journey.style.setProperty("--pointer-x", `${(x * 7).toFixed(2)}px`);
        journey.style.setProperty("--pointer-y", `${(y * 5).toFixed(2)}px`);
      });
    },
    { passive: true },
  );
  journey.addEventListener("pointerleave", resetPointer);
  setup();
})();
