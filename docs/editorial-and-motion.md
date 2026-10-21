# English copy and motion

Implemented and checked on 21 October 2026, following the owner's language
and animation requests. Work remains confined to NimbusIT.

## Current hero refinement

At the owner's request, removed the moving SVG wires, pointer offsets, hero
entrance animations and sticker rocking. Only the three browser panels float,
with an 8-second cycle and 4 px vertical travel. Their angles stay fixed.
Pause/resume, offscreen pausing and reduced-motion support remain. The background
is static. Targeted Chromium checks confirm exactly three running hero animations,
pause/resume, reduced motion, no JavaScript errors and no overflow at 320, 390,
768 or 1440 px. Desktop/mobile screenshots and the updated social image were
reviewed. The earlier implementation notes below describe the original version.

## Focused reference findings

- [JT Digital blog](https://jt-digital.eu/blog/): conversational explanations,
  concrete customer problems and the relationship between a website and ads.
  Some article content was available through indexed pages; the blog listing
  itself is JS-heavy. The useful lesson was specificity, rather than slogans.
- [DreamWave Digital](https://dreamwave-digital.com/): short direct statements,
  a personal introduction, a recognisable character and obvious contact routes.
  Used as a tone reference, without importing its team, claims or results.
- [Superdesign: Tubes Interactive Background](https://superdesign.dev/library/tubes-interactive-background):
  flowing paths and pointer response make a composition feel alive. The
  reference uses a neon Three.js effect. NimbusIT uses its own lightweight SVG
  paths in cyan and mint, bounded to the hero, to fit the existing light design.

The main page, form messages, cookies, legal pages, metadata and social image
are now English. Text was rewritten around actual deliverables and the enquiry
journey. No wording, layouts, branded assets or business claims were copied.
The original four-site commercial research remains in `research.md`.

## Implementation

- SVG wires with moving dashes behind layered browser panels.
- Staggered hero entry, slow floating panels and a gently moving sticker.
- Small local pointer offsets on fine pointers; no global cursor effects.
- One-time scroll reveals, button press/hover and package/detail feedback.
- An explicit pause/resume control next to the illustration caption.
- Reduced-motion support, including preference changes while the page is open.
- Hero loops pause offscreen and when the browser tab is hidden.
- No external library, continuous JavaScript render loop, sound, storage or tracking.

No-JS and reduced-motion visitors see static, fully readable content. Pausing
also reveals any offscreen content immediately. Standard links and navigation
remain the primary way to use the site. Prices and package limits are unchanged.
New English section fragments retain the old fragment IDs as compatibility anchors.

## Verification

72 browser checks passed in Chromium, including English validation messages,
mocked form failure/success, cookie storage behaviour, mobile menu and contact,
native package details, pause/resume and live reduced-motion changes.
Widths 320–1920 px were checked, including expanded package scopes, with no
horizontal overflow. Axe WCAG A/AA scans at 320, 390 and 1440 px found no violations.
Pointer response and offscreen pausing were also inspected separately.

Desktop and mobile views, the full page and social image were rendered and
reviewed. Mobile checks use Chromium emulation; physical iOS/Android devices
were not available. No real form submissions, paid services, trackers or
production deployments were triggered by these checks.
