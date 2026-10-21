/* Progressive navigation and real Web3Forms submissions. No tracking or new storage. */
(() => {
  "use strict";
  try {
    if (localStorage.getItem("nimbusit.cookie-notice.v1") !== null)
      localStorage.removeItem("nimbusit.cookie-notice.v1");
  } catch (_) {
    /* The site also works when storage is blocked. */
  }
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#main-nav");
  if (toggle && nav) {
    toggle.hidden = false;
    document.documentElement.classList.add("has-menu");
    nav.hidden = false;
    const close = () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.querySelectorAll("details[open]").forEach((el) => {
        el.open = false;
      });
    };
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
      if (e.key === "Escape") {
        const wasOpen = toggle.getAttribute("aria-expanded") === "true";
        close();
        if (wasOpen) toggle.focus();
      }
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".header")) close();
    });
    window.matchMedia("(min-width: 801px)").addEventListener("change", close);
  }
  // Contact window tabs: progressive enhancement over two always-visible forms.
  const tabList = document.querySelector(".contact-tabs");
  if (tabList) {
    const tabs = [...tabList.querySelectorAll('[role="tab"]')];
    const panelFor = (tab) =>
      document.getElementById(tab.getAttribute("aria-controls"));
    const select = (tab, focus) => {
      tabs.forEach((other) => {
        const current = other === tab;
        other.setAttribute("aria-selected", String(current));
        other.tabIndex = current ? 0 : -1;
        panelFor(other).hidden = !current;
      });
      if (focus) tab.focus();
    };
    tabList.hidden = false;
    document.querySelector("[data-contact-label]").hidden = true;
    tabList.closest(".contact-window").classList.add("has-tabs");
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => select(tab));
      tab.addEventListener("keydown", (e) => {
        const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[
          e.key
        ];
        if (step) {
          e.preventDefault();
          select(tabs[(index + step + tabs.length) % tabs.length], true);
        }
      });
    });
    select(tabs[0]);
    document.querySelectorAll("[data-package]").forEach((link) =>
      link.addEventListener("click", () => {
        select(tabs[tabs.length - 1]);
      }),
    );
  }
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
  const hr = document.documentElement.lang === "hr";
  const copy = hr
    ? {
        required: "Ispunite ovo polje.",
        email: "Upišite valjanu e-mail adresu.",
        contact: "Upišite valjan e-mail ili broj telefona.",
        url: "Upišite valjanu adresu stranice, primjerice vas-obrt.hr.",
        sending: "Šaljem Vaš zahtjev…",
        failure: "Nisam dobio potvrdu slanja. Pokušajte ponovno ili pišite na ",
        retained: ". Vaš tekst je ostao u obrascu.",
        general: "Opći upit",
        selected: "Zanima Vas: ",
      }
    : {
        required: "Please fill in this field.",
        email: "Please enter a valid email address.",
        contact: "Please enter a valid email address or phone number.",
        url: "Please enter a valid website address.",
        sending: "Sending your enquiry…",
        failure:
          "I couldn’t confirm that your enquiry was sent. Try again, or email me at ",
        retained: ". Your message is still here in the form.",
        general: "General enquiry",
        selected: "Interested in: ",
      };
  const email = document.body.dataset.contactEmail;
  const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  function normaliseURL(value) {
    try {
      const url = new URL(
        /^https?:\/\//i.test(value) ? value : "https://" + value,
      );
      if (
        !["https:", "http:"].includes(url.protocol) ||
        !url.hostname.includes(".") ||
        /\s/.test(value) ||
        url.username ||
        url.password
      )
        return null;
      return url.href;
    } catch (_) {
      return null;
    }
  }
  document
    .querySelectorAll("form[data-inquiry-form], #kontakt-obrazac")
    .forEach((form) => {
      form.noValidate = true;
      const shell = form.closest("[data-form-shell], .contact-window");
      const status = form.querySelector(".form-status");
      const success = shell.querySelector(".form-success");
      const submit = form.querySelector('[type="submit"]');
      const fields = [...form.querySelectorAll("[required]")];
      const packageField = form.querySelector('[name="paket"]');
      const selection = form.querySelector(".selected-package");
      let sending = false;
      const setPackage = (name) => {
        if (!packageField || !selection) return;
        packageField.value = name || copy.general;
        selection.hidden = !name;
        selection.querySelector("span").textContent = name
          ? copy.selected + name
          : "";
      };
      if (packageField) {
        document
          .querySelectorAll("[data-package]")
          .forEach((link) =>
            link.addEventListener("click", () =>
              setPackage(link.dataset.package),
            ),
          );
        selection.querySelector("button").addEventListener("click", () => {
          setPackage("");
          fields[0].focus();
        });
      }
      const errorFor = (field) =>
        document.getElementById(field.id + "-error") ||
        document.getElementById(field.id + "-greska");
      function validate(field) {
        const value = field.value.trim();
        let message = "";
        if (!value) message = copy.required;
        else if (field.type === "email" && !validEmail(value))
          message = copy.email;
        else if (field.type === "url") {
          const url = normaliseURL(value);
          if (!url) message = copy.url;
          else field.value = url;
        } else if (
          field.name === "contact" &&
          !(
            validEmail(value) ||
            /^\+?\d{7,15}$/.test(value.replace(/[\s().-]/g, ""))
          )
        )
          message = copy.contact;
        field.setAttribute("aria-invalid", String(Boolean(message)));
        const error = errorFor(field);
        if (error) {
          error.textContent = message;
          error.hidden = !message;
        }
        return !message;
      }
      fields.forEach((field) => {
        field.addEventListener("blur", () => validate(field));
        field.addEventListener("input", () => {
          if (field.getAttribute("aria-invalid") === "true") validate(field);
        });
      });
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (sending || form.elements.botcheck.value) return;
        const results = fields.map(validate);
        if (results.includes(false)) {
          fields[results.indexOf(false)].focus();
          return;
        }
        sending = true;
        submit.disabled = true;
        form.setAttribute("aria-busy", "true");
        status.hidden = false;
        status.textContent = copy.sending;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        try {
          const data = new FormData(form);
          const contact = form.querySelector('[name="contact"]');
          if (contact)
            data.set(
              validEmail(contact.value.trim()) ? "email" : "phone",
              contact.value.trim(),
            );
          const response = await fetch(form.action, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: data,
            signal: controller.signal,
          });
          const result = await response.json();
          if (!response.ok || result.success !== true)
            throw new Error("Submission not confirmed");
          form.hidden = true;
          success.hidden = false;
          success.focus();
        } catch (_) {
          const link = document.createElement("a");
          link.href = "mailto:" + email;
          link.textContent = email;
          status.replaceChildren(
            document.createTextNode(copy.failure),
            link,
            document.createTextNode(copy.retained),
          );
        } finally {
          clearTimeout(timeout);
          sending = false;
          submit.disabled = false;
          form.removeAttribute("aria-busy");
        }
      });
      shell
        .querySelector("[data-form-reset], #novi-upit")
        .addEventListener("click", () => {
          form.reset();
          setPackage("");
          fields.forEach((field) => {
            field.removeAttribute("aria-invalid");
            const error = errorFor(field);
            if (error) error.hidden = true;
          });
          status.hidden = true;
          success.hidden = true;
          form.hidden = false;
          fields[0].focus();
        });
    });
})();
