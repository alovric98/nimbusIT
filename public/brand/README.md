# Nimbus IT — Proposal 02 horizontal identity

These assets are **manual vector reconstructions of the owner's approved raster reference**, not original designer exports. The earlier pasted SVG and stacked mockup do not match this reference and are not used. No part of the raster mockup is embedded in the assets.

The cloud/N path topology, four terminals, horizontal arrangement and symbol/wordmark proportions follow the latest “Proposal 02 refinement” image. Exact source paths and original typeface were unavailable. The wordmark uses outlined Inter Bold (optical size 32); it is a close typographic reconstruction, not a claim to match the original typeface exactly. The source font is from the Google Fonts Inter distribution under the SIL Open Font License; see `Inter-LICENSE.txt`. No font file or runtime font dependency is shipped.

| Asset | Intended surface | Notes |
| --- | --- | --- |
| `logo-on-light.svg` | White or pale backgrounds | Navy Nimbus, cyan IT; filled terminals |
| `logo-on-dark.svg` | Navy or similarly dark backgrounds | White Nimbus, cyan IT; open terminals |
| `symbol-on-light.svg` | Light backgrounds | Cloud/N symbol only |
| `symbol-on-dark.svg` | Dark backgrounds | Cloud/N symbol only |
| `../favicon.svg` | Browser tab | Symbol only, square transparent canvas, adapts to the browser's color scheme |

Full lockup: `viewBox="0 0 800 220"`. Symbol: `viewBox="0 0 304 220"`. Both variants use the same geometry and wordmark paths. Scale uniformly with `height: auto`. There are no blur filters, neon effects, shadows, external resources, raster payloads or live text elements in the artwork. Use the dark asset on dark surfaces rather than applying a CSS filter to the light asset.

If original approved vectors become available, replace these reconstructions while preserving the public filenames, intrinsic proportions and component accessibility. Inspect the favicon at 16px and 32px and the header at 320px and 390px widths after any replacement.
