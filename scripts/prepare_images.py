#!/usr/bin/env python3
"""Optional asset preparation with Pillow (development only; not needed to build/serve)."""
from pathlib import Path
from PIL import Image, ImageOps
ROOT=Path(__file__).resolve().parent.parent
source=ROOT/'img/pergola-sunbreaker-400.webp'
with Image.open(source) as image:
    image.resize((600,round(image.height*600/image.width)),Image.Resampling.LANCZOS).save(ROOT/'img/pergola-sunbreaker-600.webp','WEBP',quality=82,method=6)
portrait=ROOT/'img/antonio.webp'
if portrait.exists():
    with Image.open(portrait) as image:
        for size in [240,480]:
            ImageOps.fit(image,(size,size),Image.Resampling.LANCZOS).save(ROOT/f'img/antonio-{size}.webp','WEBP',quality=85,method=6)
    print('Prepared pergola and supplied portrait variants. No images generated.')
else:
    print('Prepared pergola 600w. Owner portrait not supplied; honest initials fallback retained.')
