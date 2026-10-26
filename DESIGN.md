# Design direction

Precise European infrastructure consultancy: mostly light surfaces, one dark navy hero, spacious editorial sections, fine rules and restrained cyan details. Approved horizontal Proposal 02 cloud/N identity and a conceptual workflow diagram; no stock imagery required.

## Tokens
- Ink `#142c40`; muted ink `#50616c`; navy `#102b3e`.
- Paper `#ffffff`; soft surface `#f3f6f7`; lines `#d7e0e5`.
- Action blue `#1759b8`; accent cyan `#8ee3ef` on navy only.
- Sans: system UI / Segoe UI / Arial. Mono: SFMono-Regular / Consolas for numbering and small technical labels. No remote fonts.
- Content width 1200px; gutters 24px mobile / 40px desktop. Spacing scale 8, 12, 16, 24, 32, 48, 64, 96px.
- Fluid headings; body at least 16px, line-height 1.65. Body copy max 65ch.

## Components and behavior
- Clear wordmark, simple navigation and page-specific DE/EN links. Mobile navigation stays visible and works without JavaScript.
- Square or lightly rounded controls; text links use underlines or clear arrows. Minimum 44px navigation/control targets and visible focus rings.
- Services use numbered editorial rows. Process steps use open columns. Avoid repeating boxed-card grids.
- At 900px split layouts stack; at 760px navigation wraps to accommodate the approved logo; at 600px typography and spacing reduce. Respect reduced motion; no animated decoration.
- Portrait area is a labeled reserved space, never a fabricated person. No decorative gradients outside the approved logo, glass effects, fake dashboards, client logos, testimonials or unsourced statistics.
- Preview notice, contact status and legal draft labels must remain visible and localized.

## Approved brand identity
- Use the latest horizontal “Proposal 02 refinement” reference, not the earlier stacked mockup or simplified pasted SVG.
- Assets in `public/brand/` are manual vector reconstructions; original designer SVGs were not supplied. See `public/brand/README.md` for provenance and exact asset usage.
- Cloud/N symbol plus horizontal NimbusIT wordmark; four circular terminals. Navy `#0B2135`, cyan `#00B7D6`, with the restrained navy-to-cyan transition shown in the reference. Dark-surface artwork uses white lettering and cyan/blue strokes, with no glow or shadow.
- Preserve the full logo's 800:220 aspect ratio and the symbol's 304:220 aspect ratio. Never stretch, crop, restack, recolor via CSS filters, or use the mockup itself as an asset.
- Header and footer use `logo-on-light.svg`; `Brand` also accepts `variant="dark"` for dark surfaces. Sizes: 208px desktop, 190px footer, 166px mobile. Site typography, surfaces, navigation and hero layout stay unchanged.
- Favicon uses only the cloud/N symbol, with a transparent square canvas and a dark-scheme color adaptation. Logo lettering is outlined; no font request is needed.
