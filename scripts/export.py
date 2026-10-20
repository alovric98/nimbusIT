#!/usr/bin/env python3
"""Optional allowlisted static export for Cloudflare Pages; Workers remains buildless."""
from pathlib import Path
import shutil
ROOT = Path(__file__).resolve().parent.parent
out = ROOT / 'dist'
if out.exists(): shutil.rmtree(out)
out.mkdir()
for name in ['index.html', '404.html', '_headers', 'robots.txt', 'sitemap.xml', 'css', 'js', 'img', 'fonts', 'privatnost', 'dokumenti']:
    source = ROOT / name
    if source.is_dir(): shutil.copytree(source, out / name)
    else: shutil.copy2(source, out / name)
print('Exported allowlisted public assets to dist/. No Git, configuration or development sources.')
