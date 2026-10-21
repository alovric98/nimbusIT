#!/usr/bin/env python3
"""Verify generated pages, bilingual SEO, prices, CSP compatibility and retained URLs."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import hashlib, json, re, subprocess, xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
subprocess.run(["python3", str(ROOT / "scripts/build.py"), "--check"], check=True)
SITE = json.loads((ROOT / "data/site.json").read_text())
DOMAIN = SITE["domain"]
SERVICES = json.loads((ROOT / "data/services.json").read_text())
paths = [
    "/",
    "/en/",
    "/privatnost/",
    "/kolacici/",
    "/en/privacy/",
    "/en/cookies/",
    "/besplatna-analiza/",
    *[s["path"] for s in SERVICES],
    "/privacy/",
    "/cookies/",
    "/404.html",
]


def file_for(path):
    return ROOT / (
        path.lstrip("/") + "index.html" if path.endswith("/") else path.lstrip("/")
    )


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.ids = []
        self.links = []
        self.schemas = []
        self.chunks = []
        self.h1 = 0
        self.canonical = None
        self.alternates = {}
        self.in_schema = False
        self.lang = None
        self.scripts = []
        self.visible = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.append(a["id"])
        if tag == "html":
            self.lang = a.get("lang")
        if tag == "h1":
            self.h1 += 1
        assert "style" not in a, ("Inline style", a)
        assert not any(k.startswith("on") for k in a), ("Inline handler", a)
        if tag in ["a", "link", "script", "img"]:
            for key in ["href", "src"]:
                if key in a:
                    self.links.append(a[key])
        if tag == "link" and a.get("rel") == "canonical":
            self.canonical = a["href"]
        if tag == "link" and a.get("rel") == "alternate":
            self.alternates[a.get("hreflang")] = a["href"]
        if tag == "script":
            assert (
                "src" in a or a.get("type") == "application/ld+json"
            ), "Executable inline script"
            self.in_schema = a.get("type") == "application/ld+json"
            self.chunks = []
            if "src" in a:
                self.scripts.append(a["src"])

    def handle_data(self, data):
        if self.in_schema:
            self.chunks.append(data)
        else:
            self.visible.append(data)

    def handle_endtag(self, tag):
        if tag == "script" and self.in_schema:
            self.schemas.append(json.loads("".join(self.chunks)))
            self.in_schema = False


pages = {path: Page(file_for(path).read_text()) for path in paths}
allowed = {"{{ADRESA_OBRTA}}", "{{OIB}}", "{{PDV_NAPOMENA}}"}
for path, page in pages.items():
    text = file_for(path).read_text()
    assert page.h1 == 1, (path, "H1")
    assert len(page.ids) == len(set(page.ids)), (path, "duplicate IDs")
    assert set(re.findall(r"\{\{.*?\}\}", text)) <= allowed, (
        path,
        "unknown placeholder",
    )
    alias = {"/privacy/": "/en/privacy/", "/cookies/": "/en/cookies/"}
    assert page.canonical == DOMAIN + alias.get(path, path), (path, page.canonical)
    expected = "en" if path.startswith("/en/") or path in alias else "hr"
    assert page.lang == expected, (path, page.lang)
    assert not any("cookies.js" in src for src in page.scripts), (
        path,
        "cookie controller",
    )
    assert "data-cookie-notice" not in text and 'cookie-notice"' not in text, (
        path,
        "cookie UI",
    )
    for link in page.links:
        u = urlsplit(link)
        if u.scheme or u.netloc:
            if u.scheme == "mailto":
                assert u.path == SITE["email"], (path, "email not centralised")
            continue
        assert link != "#", (path, "dead link")
        target_path = u.path or path
        target = (
            file_for(unquote(target_path))
            if target_path.startswith("/")
            else file_for(path).parent / unquote(target_path)
        )
        if target.is_dir():
            target /= "index.html"
        assert target.is_file(), (path, "missing", link)
        if u.fragment:
            target_page = pages.get(target_path)
            if target_page:
                assert u.fragment in target_page.ids, (path, "missing anchor", link)
        if u.path.endswith((".css", ".js", ".woff", ".woff2")):
            assert u.query.startswith("v="), (path, "unversioned asset", link)
            assert (
                u.query[2:] == hashlib.sha256(target.read_bytes()).hexdigest()[:12]
            ), (path, "asset hash mismatch", link)
    for lang, url in page.alternates.items():
        if lang == "x-default":
            assert url == DOMAIN + "/"
            continue
        other = pages[url.removeprefix(DOMAIN)]
        assert other.lang == lang, (path, "hreflang target language")
        assert other.alternates.get(page.lang) == DOMAIN + path, (
            path,
            "nonreciprocal hreflang",
        )
    for schema in page.schemas:
        assert schema["@context"] == "https://schema.org"
        if not json.loads((ROOT / "data/reviews.json").read_text()):
            assert "aggregateRating" not in json.dumps(schema)
for original in [
    "pristup",
    "usluge",
    "analiza",
    "projekti",
    "tijek",
    "kontakt",
    "glavno",
    "how-it-works",
    "pricing",
    "project",
    "process",
    "contact",
    "strategy",
]:
    assert original in pages["/"].ids, original
for service in SERVICES:
    path = service["path"]
    graph = pages[path].schemas[0]["@graph"]
    assert {s["@type"] for s in graph} == {"Service", "FAQPage", "BreadcrumbList"}
    data = next(s for s in graph if s["@type"] == "Service")
    group, i = service["price_source"].split(":")
    assert (
        data["offers"]["price"]
        == json.loads((ROOT / "data/pricing.json").read_text())[group][int(i)]["price"]
    )
    assert data["provider"]["@id"] == DOMAIN + "/#poslovanje"
faq = next(s for s in pages["/"].schemas[0]["@graph"] if s["@type"] == "FAQPage")
for question in faq["mainEntity"]:
    assert question["name"] in "".join(pages["/"].visible)
xml = ET.parse(ROOT / "sitemap.xml")
ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
urls = [el.text for el in xml.findall("s:url/s:loc", ns)]
assert set(urls) == {
    DOMAIN + p for p in paths if p not in ["/privacy/", "/cookies/", "/404.html"]
}
assert len(urls) == len(set(urls))
assert all(el.text == SITE["updated"] for el in xml.findall("s:url/s:lastmod", ns))
assert "https://nimbusit.hr/sitemap.xml" in (ROOT / "robots.txt").read_text()
assert (ROOT / "dokumenti/NimbusIT-primjer-analize.pdf").is_file()
for line in (ROOT / "_redirects").read_text().splitlines():
    if line.strip():
        old, new, status = line.split()
        assert status == "301" and file_for(new).exists() and old != new, line
# Existing commercial decisions must remain intact.
base = json.loads(
    subprocess.check_output(
        ["git", "show", "4b99d97:data/pricing.json"], cwd=ROOT, text=True
    )
)
current = json.loads((ROOT / "data/pricing.json").read_text())
assert base["strategy"]["price"] == current["strategy"]["price"]
for group in ["packages", "monthly"]:
    for old, new in zip(base[group], current[group]):
        assert all(new[k] == v for k, v in old.items()), (
            "Changed existing pricing/scope",
            group,
            old["name"],
        )
print(
    f"Passed: {len(pages)} pages, reciprocal hreflang, canonicals, JSON-LD, CSP-compatible HTML, hashed assets, retained URLs, redirects, sitemap and unchanged prices/scope."
)
