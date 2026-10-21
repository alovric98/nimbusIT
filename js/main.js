/* Small progressive enhancements. No analytics, animation loop or dependencies. */
(() => {
  "use strict";
  try {
    if (localStorage.getItem("nimbusit.cookie-notice.v1") !== null)
      localStorage.removeItem("nimbusit.cookie-notice.v1");
  } catch (_) { /* Browsing and forms work when storage is blocked. */ }
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#main-nav");
  if (toggle && nav) {
    toggle.hidden = false;
    document.documentElement.classList.add("has-menu");
    const close = () => toggle.setAttribute("aria-expanded", "false");
    toggle.addEventListener("click", () =>
      toggle.setAttribute(
        "aria-expanded",
        String(toggle.getAttribute("aria-expanded") !== "true"),
      ),
    );
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) close();
    });
    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        toggle.getAttribute("aria-expanded") === "true"
      ) {
        close();
        toggle.focus();
      }
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".header")) close();
    });
    window.matchMedia("(min-width: 801px)").addEventListener("change", close);
  }
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
  const form = document.querySelector("#kontakt-obrazac");
  if (!form) return;
  form.noValidate = true;
  const status = document.querySelector("#form-status");
  const success = document.querySelector("#potvrda");
  const submit = form.querySelector("[type=submit]");
  const selection = document.querySelector("#odabrani-paket");
  const packageField = document.querySelector("#paket");
  const fields = [...form.querySelectorAll("[required]")];
  let sending = false;
  const setPackage = (name) => {
    packageField.value = name || "General enquiry";
    selection.hidden = !name;
    selection.querySelector("span").textContent = name
      ? `Interested in: ${name}`
      : "";
  };
  document
    .querySelectorAll("[data-package]")
    .forEach((link) =>
      link.addEventListener("click", () => setPackage(link.dataset.package)),
    );
  selection.querySelector("button").addEventListener("click", () => {
    setPackage("");
    document.querySelector("#ime").focus();
  });
  function validate(field) {
    const error = document.getElementById(`${field.id}-greska`);
    let message = "";
    if (!field.value.trim()) message = "Please fill in this field.";
    else if (
      field.type === "email" &&
      (!field.validity.valid ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim()))
    )
      message = "Please enter a valid email address.";
    field.setAttribute("aria-invalid", String(Boolean(message)));
    error.textContent = message;
    error.hidden = !message;
    return !message;
  }
  fields.forEach((field) => {
    field.addEventListener("blur", () => validate(field));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") validate(field);
    });
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (sending || form.elements.botcheck.value) return;
    const validity = fields.map(validate);
    if (validity.includes(false)) {
      fields[validity.indexOf(false)].focus();
      return;
    }
    sending = true;
    submit.disabled = true;
    form.setAttribute("aria-busy", "true");
    status.hidden = false;
    status.textContent = "Sending your enquiry…";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || result.success !== true)
        throw new Error("Submission not confirmed");
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch (_) {
      status.replaceChildren(
        document.createTextNode(
          "I couldn’t confirm that your enquiry was sent. Try again, or email me at ",
        ),
      );
      const link = document.createElement("a");
      link.href = "mailto:info.nimbusit@gmail.com";
      link.textContent = "info.nimbusit@gmail.com";
      status.append(
        link,
        document.createTextNode(". Your message is still here in the form."),
      );
    } finally {
      clearTimeout(timeout);
      sending = false;
      submit.disabled = false;
      form.removeAttribute("aria-busy");
    }
  });
  document.querySelector("#novi-upit").addEventListener("click", () => {
    form.reset();
    setPackage("");
    fields.forEach((field) => {
      field.removeAttribute("aria-invalid");
      document.getElementById(`${field.id}-greska`).hidden = true;
    });
    status.hidden = true;
    success.hidden = true;
    form.hidden = false;
    document.querySelector("#ime").focus();
  });
})();
