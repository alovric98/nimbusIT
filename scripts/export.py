#!/usr/bin/env python3
"""Optional allowlisted static export for Cloudflare Pages; Workers remains buildless."""

from pathlib import Path
import shutil, subprocess, sys

ROOT = Path(__file__).resolve().parent.parent
build = subprocess.run([sys.executable, str(ROOT / "scripts/build.py"), "--release"])
if build.returncode:
    sys.exit(build.returncode)
out = ROOT / "dist"
if out.exists():
    shutil.rmtree(out)
out.mkdir()
for name in [
    "index.html",
    "404.html",
    "_headers",
    "_redirects",
    "robots.txt",
    "sitemap.xml",
    "css",
    "js",
    "img",
    "fonts",
    "privacy",
    "cookies",
    "privatnost",
    "kolacici",
    "en",
    "besplatna-analiza",
    "izrada-web-stranica",
    "google-oglasi-za-obrte",
    "konfigurator-proizvoda-za-web",
    "dokumenti",
]:
    source = ROOT / name
    if source.is_dir():
        shutil.copytree(source, out / name)
    else:
        shutil.copy2(source, out / name)
print(
    "Exported allowlisted public assets to dist/. No Git, configuration or development sources."
)
