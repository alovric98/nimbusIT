#!/usr/bin/env python3
"""Development only: render both share images from the original SVG scene.

Requires Playwright and Chromium. No form submission or third-party request.
Run build.py again afterwards to refresh the image hashes in page metadata.
"""

import argparse
from html import escape
from pathlib import Path
import json
import socket
import subprocess
import sys
import time

ROOT = Path(__file__).resolve().parent.parent


def main():
    from playwright.sync_api import sync_playwright

    parser = argparse.ArgumentParser()
    parser.add_argument("--browser", default="/usr/bin/chromium")
    args = parser.parse_args()
    with socket.socket() as listener:
        listener.bind(("127.0.0.1", 0))
        port = listener.getsockname()[1]
    server = subprocess.Popen(
        [sys.executable, str(ROOT / "scripts/serve.py"), "--port", str(port)],
        stdout=subprocess.DEVNULL,
    )
    try:
        for _ in range(60):
            try:
                socket.create_connection(("127.0.0.1", port), 0.2).close()
                break
            except OSError:
                time.sleep(0.1)
        base = f"http://127.0.0.1:{port}"
        content = json.loads((ROOT / "data/home.json").read_text())
        template = (ROOT / "templates/social-card.html").read_text()
        partial = ROOT / "templates/partials"
        with sync_playwright() as p:
            browser = p.chromium.launch(executable_path=args.browser)
            for lang in ["hr", "en"]:
                values = {
                    "LANG": lang,
                    "CSS_URL": base + "/css/style.css",
                    "SYMBOLS": (partial / "symbols.html").read_text()
                    + (partial / "world-symbols.html").read_text(),
                    "WORLD_HERO": (partial / "world-hero.html").read_text(),
                    **{
                        key.upper(): escape(value)
                        for key, value in content[lang].items()
                        if isinstance(value, str)
                    },
                }
                html = template
                for key, value in values.items():
                    html = html.replace("{{" + key + "}}", value)
                page = browser.new_page(
                    viewport={"width": 1200, "height": 630},
                    reduced_motion="reduce",
                )
                page.route(base + "/social-preview", lambda route: route.fulfill(
                    status=200, content_type="text/html", body=html,
                ))
                page.goto(base + "/social-preview", wait_until="networkidle")
                page.evaluate("document.fonts.ready")
                filename = "nimbusit-og.png" if lang == "hr" else "nimbusit-og-en.png"
                page.screenshot(path=str(ROOT / "img" / filename))
                page.close()
                print("Rendered", filename)
            browser.close()
    finally:
        server.terminate()
        server.wait(timeout=5)


if __name__ == "__main__":
    main()
