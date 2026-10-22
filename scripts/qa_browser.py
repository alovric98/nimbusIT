#!/usr/bin/env python3
"""Local QA only: browser checks for the Croatian release.

Development tool, never a site dependency. Needs Playwright:

    python3 -m venv .venv && .venv/bin/pip install playwright
    .venv/bin/playwright install chromium
    .venv/bin/python scripts/qa_browser.py

Writes docs/qa/browser-checks.json and exits non-zero when a check fails.
Form submits are routed to a mock responder, so no real enquiry is ever sent.
"""

from pathlib import Path
import argparse, json, re, socket, subprocess, sys, time

ROOT = Path(__file__).resolve().parent.parent
PAGES = [
    "/",
    "/izrada-web-stranica/",
    "/google-oglasi-za-obrte/",
    "/konfigurator-proizvoda-za-web/",
    "/besplatna-analiza/",
    "/privatnost/",
    "/en/",
]
VIEWPORTS = [(390, 844), (1440, 900)]
HOME_MAX_HEIGHT = 8000

# Collect every visible text node with its computed size, colour and nearest
# opaque background, plus interactive boxes and hidden-<br> word joins.
AUDIT_JS = r"""
() => {
  const px = (v) => parseFloat(v) || 0;
  const label = (el) => {
    const t = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 60);
    return el.tagName.toLowerCase() + (t ? ": " + t : "");
  };
  const suppressed = (el) =>
    el.closest("[aria-hidden='true'], .sr-only, .honeypot, template") !== null;
  const shown = (el) => {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return false;
    const s = getComputedStyle(el);
    return s.visibility !== "hidden" && s.display !== "none" && px(s.opacity) > 0.05;
  };
  const parse = (c) => {
    const m = c.match(/[\d.]+/g);
    if (!m) return null;
    const [r, g, b] = m.map(Number);
    const a = m.length > 3 ? Number(m[3]) : 1;
    return { r, g, b, a };
  };
  // ponytail: nearest opaque ancestor background; gradients and images are
  // reported as "unknown" instead of guessed. Upgrade to axe-core if needed.
  const backdrop = (el) => {
    for (let n = el; n; n = n.parentElement) {
      const s = getComputedStyle(n);
      if (s.backgroundImage && s.backgroundImage !== "none") return "unknown";
      const c = parse(s.backgroundColor);
      if (c && c.a >= 0.95) return c;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };
  const lum = ({ r, g, b }) =>
    [r, g, b]
      .map((v) => v / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
      .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
    return (x + 0.05) / (y + 0.05);
  };

  const small = [], labels = [], helpers = [], contrast = [], targets = [], joined = [];

  for (const el of document.querySelectorAll("body *")) {
    if (suppressed(el) || !shown(el)) continue;
    const own = [...el.childNodes].some(
      (n) => n.nodeType === 3 && n.textContent.trim().length > 1
    );
    const style = getComputedStyle(el);
    const size = px(style.fontSize);

    if (own) {
      if (size < 12) small.push({ el: label(el), size });
      const fg = parse(style.color);
      const bg = backdrop(el);
      if (fg && bg !== "unknown" && fg.a >= 0.95) {
        const r = ratio(fg, bg);
        const large = size >= 24 || (size >= 18.66 && px(style.fontWeight) >= 700);
        if (r < (large ? 3 : 4.5)) contrast.push({ el: label(el), ratio: +r.toFixed(2) });
      }
      if (el.closest("form")) {
        if (el.tagName === "LABEL" && size < 14) labels.push({ el: label(el), size });
        else if (el.matches(".field__hint, .hint, small, .field small") && size < 13)
          helpers.push({ el: label(el), size });
      }
    }

    if (el.matches("a, button, summary, [role='tab'], input[type='submit']")) {
      if (el.closest("p, li, dd")) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 44 || r.height < 44)
        targets.push({ el: label(el), w: +r.width.toFixed(1), h: +r.height.toFixed(1) });
    }
  }

  for (const h of document.querySelectorAll("h1, h2, h3")) {
    for (const br of h.querySelectorAll("br")) {
      if (getComputedStyle(br).display !== "none") continue;
      const before = (br.previousSibling?.textContent || "").slice(-1);
      const after = (br.nextSibling?.textContent || "").slice(0, 1);
      if (before.trim() && after.trim()) joined.push(label(h));
    }
  }

  return {
    markers: (document.body.innerText.match(/\{\{/g) || []).length,
    small, labels, helpers, contrast, targets, joined,
    height: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
    words: document.body.innerText.trim().split(/\s+/).filter(Boolean).length,
  };
}
"""


def free_port() -> int:
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(ROOT / "docs/qa/browser-checks.json"))
    ap.add_argument("--screenshots", action="store_true")
    ap.add_argument("--browser", help="Optional path to an existing Chromium executable")
    ap.add_argument("--max-home-height", type=int, default=HOME_MAX_HEIGHT,
                    help="Explicit mobile height budget for the design being reviewed")
    args = ap.parse_args()

    try:
        from playwright.sync_api import sync_playwright
    except ModuleNotFoundError:
        print("Playwright is not installed; skipping browser checks.", file=sys.stderr)
        print("See the module docstring for the one-time setup.", file=sys.stderr)
        return 2

    port = free_port()
    server = subprocess.Popen(
        [sys.executable, str(ROOT / "scripts/serve.py"), "--port", str(port)],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    base = f"http://127.0.0.1:{port}"
    failures, report = [], {}

    def fail(msg):
        failures.append(msg)
        print("FAIL " + msg)

    try:
        for _ in range(100):
            try:
                socket.create_connection(("127.0.0.1", port), 0.2).close()
                break
            except OSError:
                time.sleep(0.1)

        with sync_playwright() as p:
            browser = p.chromium.launch(
                **({"executable_path": args.browser} if args.browser else {})
            )
            for width, height in VIEWPORTS:
                for path in PAGES:
                    page_report = {}
                    context = browser.new_context(
                        viewport={"width": width, "height": height},
                        reduced_motion="reduce",
                    )
                    page = context.new_page()
                    errors = []
                    page.on("console", lambda m: m.type == "error" and errors.append(m.text))
                    page.on("pageerror", lambda e: errors.append(str(e)))
                    page.goto(base + path, wait_until="load")
                    page.wait_for_timeout(400)

                    data = page.evaluate(AUDIT_JS)
                    where = f"{path} @{width}"
                    page_report.update(data, console=errors)

                    if data["markers"]:
                        fail(f"{where}: {data['markers']} visible '{{{{' markers")
                    for key, msg in (
                        ("small", "text under 12px"),
                        ("labels", "form labels under 14px"),
                        ("helpers", "helper text under 13px"),
                        ("contrast", "text under 4.5:1"),
                        ("targets", "touch targets under 44px"),
                        ("joined", "joined words in headings"),
                    ):
                        if data[key]:
                            fail(f"{where}: {len(data[key])} {msg} -> {data[key][:5]}")
                    if errors:
                        fail(f"{where}: {len(errors)} console errors -> {errors[:3]}")
                    if path == "/" and width == 390 and data["height"] > args.max_home_height:
                        fail(f"{where}: home height {data['height']}px > {args.max_home_height}px")

                    if width == 390:
                        page.set_viewport_size({"width": 360, "height": height})
                        page.wait_for_timeout(200)
                        overflow = page.evaluate(
                            "() => document.documentElement.scrollWidth - window.innerWidth"
                        )
                        page_report["overflow_360"] = overflow
                        if overflow > 1:
                            fail(f"{path} @360: horizontal overflow {overflow}px")

                    report[where] = page_report
                    context.close()

            # Both contact forms against a mocked endpoint: success, then failure
            # with the typed values kept. Nothing reaches api.web3forms.com.
            for status, body, expect in (
                (200, '{"success":true}', "success"),
                (500, '{"success":false,"message":"nope"}', "error"),
            ):
                context = browser.new_context(
                    viewport={"width": 390, "height": 844}, reduced_motion="reduce"
                )
                page = context.new_page()
                page.route(
                    "**api.web3forms.com/**",
                    lambda route: route.fulfill(
                        status=status, content_type="application/json", body=body
                    ),
                )
                page.goto(base + "/", wait_until="load")
                # Same hook list main.js binds to, so a renamed form cannot slip past.
                forms = page.locator("form[data-inquiry-form], #kontakt-obrazac")
                if forms.count() == 0:
                    fail("no contact form matched the main.js hooks")
                for i in range(forms.count()):
                    form = forms.nth(i)
                    kind = form.get_attribute("data-kind") or form.get_attribute("id") or str(i)
                    # With JS on, only the selected panel is shown, so open this
                    # form's tab before filling it in.
                    if not form.is_visible():
                        tabs = page.locator("[role='tab']")
                        for t in range(tabs.count()):
                            tabs.nth(t).click()
                            if form.is_visible():
                                break
                    form.scroll_into_view_if_needed()
                    typed = {}
                    fields = form.locator(
                        "input:not([type=hidden]):not([tabindex='-1']), textarea"
                    )
                    for j in range(fields.count()):
                        field = fields.nth(j)
                        if not field.is_visible():
                            continue
                        name = field.get_attribute("name") or ""
                        shape = field.get_attribute("type") or field.evaluate(
                            "el => el.tagName.toLowerCase()"
                        )
                        # Values the site's own validation accepts: a URL for the
                        # website field, an address for anything contact-shaped.
                        if shape == "url" or "url" in name or "website" in name:
                            value = "https://primjer.hr"
                        elif shape in ("email", "tel") or re.search(
                            r"mail|contact|kontakt|tel", name, re.I
                        ):
                            value = "qa@example.com"
                        else:
                            value = "QA provjera, ne odgovarajte."
                        field.fill(value)
                        typed[name] = value
                    form.locator("button[type=submit], input[type=submit]").first.click()
                    page.wait_for_timeout(900)
                    shell = form.locator(
                        "xpath=ancestor::*[@data-form-shell or contains(@class,'contact-window')][1]"
                    )
                    ok = shell.locator(".form-success").first.is_visible()
                    note = form.locator(".form-status").first
                    said = note.inner_text().strip() if note.count() else ""
                    key = f"form[{kind}] mock {status}"
                    if expect == "success":
                        if not ok:
                            fail(f"{key}: no confirmation shown")
                    else:
                        if ok:
                            fail(f"{key}: confirmation shown despite a 500")
                        if not said:
                            fail(f"{key}: no error message shown")
                        kept = {
                            name: fields.nth(j).input_value()
                            for j in range(fields.count())
                            for name in [fields.nth(j).get_attribute("name") or ""]
                            if name in typed
                        }
                        same = lambda a, b: a.rstrip("/") == b.rstrip("/")
                        if any(not same(kept.get(n, ""), v) for n, v in typed.items()):
                            fail(f"{key}: typed values were lost")
                    report[key] = {"success_shown": ok, "status_text": said}
                context.close()

            if args.screenshots:
                shots = ROOT / "docs/screenshots"
                for name, path, size in (
                    ("hr-home-mobile.png", "/", (390, 844)),
                    ("hr-home-desktop.png", "/", (1440, 900)),
                    ("hr-service-mobile.png", "/izrada-web-stranica/", (390, 844)),
                    ("hr-service-desktop.png", "/izrada-web-stranica/", (1440, 900)),
                    ("hr-analysis-mobile.png", "/besplatna-analiza/", (390, 844)),
                ):
                    context = browser.new_context(
                        viewport={"width": size[0], "height": size[1]},
                        reduced_motion="reduce",
                    )
                    page = context.new_page()
                    page.goto(base + path, wait_until="load")
                    page.wait_for_timeout(600)
                    page.screenshot(path=str(shots / name), full_page=True)
                    context.close()

            browser.close()
    finally:
        server.terminate()
        server.wait(timeout=5)

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(
        json.dumps({"failures": failures, "pages": report}, indent=2, ensure_ascii=False) + "\n"
    )
    home = report.get("/ @390", {})
    print(
        f"\nHome at 390px: {home.get('height')}px, {home.get('words')} visible words."
        f"\n{len(report)} measurements, {len(failures)} failures. Wrote {out}."
    )
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
