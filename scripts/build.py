#!/usr/bin/env python3
"""Render static pricing from the single source of truth. No dependencies."""
from pathlib import Path
from html import escape
import json
import sys

ROOT = Path(__file__).resolve().parent.parent
data = json.loads((ROOT / 'data/pricing.json').read_text())

def price(value):
    assert isinstance(value, int) and value > 0
    return f'€{value:,}'

cards = []
for p in data['packages']:
    items = ''.join(f'<li>{escape(item)}</li>' for item in p['scope'])
    cards.append(f'''<article class="package{' package--featured' if p.get('featured') else ''}">
      <p class="eyebrow">{escape(p['label'])}</p>
      <h3>{escape(p['name'])}</h3>
      <p class="package__description">{escape(p['description'])}</p>
      <p class="price"><span>from</span> {price(p['price'])}</p>
      <p class="price-caption">one-time build</p>
      <p class="package__scope-summary">{escape(p['summary'])}</p>
      <details class="package__details">
        <summary>Full scope <span aria-hidden="true">+</span></summary>
        <ul class="checklist">{items}</ul>
        <p class="package__note">{escape(p['note'])}</p>
      </details>
      <a class="button {'button--ink' if p.get('featured') else 'button--white'}" href="#contact" data-package="{escape(p['name'])}" aria-label="Discuss: {escape(p['name'])}">Let’s talk <span aria-hidden="true">↗</span></a>
    </article>''')
monthly = ''.join(f'''<div class="monthly__row"><dt>{escape(p['name'])}<span>{escape(p['scope'])}</span></dt><dd>from {price(p['price'])}<span> / month</span></dd></div>''' for p in data['monthly'])
strategy = data['strategy']
html = (ROOT / 'templates/index.html').read_text()
for key, value in {
    'PACKAGES': '\n'.join(cards), 'MONTHLY': monthly,
    'STRATEGY_NAME': escape(strategy['name']), 'STRATEGY_PRICE': price(strategy['price']),
    'STRATEGY_SCOPE': escape(strategy['scope']),
}.items():
    html = html.replace('{{' + key + '}}', value)
assert '{{' not in html, 'Unresolved template token'
target = ROOT / 'index.html'
if '--check' in sys.argv:
    if target.read_text() != html:
        raise SystemExit('index.html is out of date. Run python3 scripts/build.py')
    print('Generated HTML matches pricing and template.')
else:
    target.write_text(html)
    print('Built index.html — static HTML, no runtime dependencies.')
