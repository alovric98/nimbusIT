#!/usr/bin/env python3
"""Check public static pages, URLs, metadata and generated pricing without dependencies."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
import subprocess
import xml.etree.ElementTree as ET
ROOT = Path(__file__).resolve().parent.parent
subprocess.run(['python3', str(ROOT / 'scripts/build.py'), '--check'], check=True)
class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.ids, self.links, self.schema = [], [], []
        self.h1, self.in_schema = 0, False
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a: self.ids.append(a['id'])
        if tag == 'h1': self.h1 += 1
        if tag in ['a', 'link', 'script', 'img']:
            for key in ['href', 'src']:
                if key in a: self.links.append(a[key])
        if tag == 'script' and a.get('type') == 'application/ld+json': self.in_schema = True
    def handle_data(self, data):
        if self.in_schema: self.schema.append(data)
    def handle_endtag(self, tag):
        if tag == 'script': self.in_schema = False
paths = [ROOT / 'index.html', ROOT / '404.html', ROOT / 'privatnost/index.html']
pages = {path: Page(path.read_text()) for path in paths}
for path, page in pages.items():
    assert page.h1 == 1, f'{path}: expected one H1'
    assert len(page.ids) == len(set(page.ids)), f'{path}: duplicate IDs'
    for schema in page.schema: json.loads(schema)
    for link in page.links:
        parsed = urlsplit(link)
        if parsed.scheme or parsed.netloc: continue
        assert link != '#', f'{path}: placeholder link'
        target = ROOT / unquote(parsed.path).lstrip('/') if parsed.path.startswith('/') else path.parent / unquote(parsed.path)
        if not parsed.path: target = path
        if target.is_dir(): target /= 'index.html'
        assert target.is_file(), f'{path}: missing target {link}'
        if parsed.fragment and target in pages:
            assert parsed.fragment in pages[target].ids, f'{path}: missing anchor {link}'
for original in ['pristup', 'usluge', 'analiza', 'projekti', 'tijek', 'kontakt', 'glavno']:
    assert original in pages[ROOT / 'index.html'].ids
ET.parse(ROOT / 'sitemap.xml')
assert 'https://nimbusit.hr/sitemap.xml' in (ROOT / 'robots.txt').read_text()
assert (ROOT / 'dokumenti/NimbusIT-primjer-analize.pdf').is_file()
print('Passed: public links, fragments, unique IDs, headings, structured data, sitemap and retained URLs.')
