# Nimbus IT

Fresh, bilingual static website for an independent Croatian IT consultancy serving German-speaking IT service providers. Built from the cleaned `rebuild/astro` branch with Astro, strict TypeScript and plain CSS. No legacy code or assets are reused.

**Review implementation only. No deployment is configured or authorized.** The existing `master` branch, Cloudflare Workers setup and domain remain outside this project's scope.

## Local development

Use Node.js 22.23.4+ (validated with Node 24.21.0) and npm. Install the exact dependency versions from the lockfile:

```sh
npm ci
npm run dev
```

Open the local URL printed by Astro (normally `http://127.0.0.1:4321/`). The server binds only to loopback. In restricted environments, prefix commands with `ASTRO_TELEMETRY_DISABLED=1` to avoid Astro's user-preference write.

```sh
npm run check
npm run build
npm test
npm run preview
```

The static build is in `dist/`. `npm test` validates the generated build, so run it after `npm run build`. It checks all routes, heading hierarchy, internal links/assets/anchors, language switching, unique metadata, canonical/hreflang pairs, sitemap and preview protections. `npm run preview` serves the actual build for review; restart or rebuild after source edits as appropriate. Astro 7 may run its development server in the background; use `npx astro dev status` and `npx astro dev stop` to inspect or stop it.

## Structure

```text
src/data/site.ts          Route pairs, localized metadata and service content
src/layouts/Layout.astro Shared HTML head, navigation, preview notice and footer
src/components/          Page content and reusable presentation components
src/pages/[...page].astro Twelve statically generated localized pages
src/pages/sitemap.xml.ts Static sitemap with language alternates
src/styles/global.css    Design tokens, components and responsive CSS
public/                  Original SVG favicon, robots.txt and static host headers
scripts/validate-build.mjs Generated-output checks; no test dependencies
```

Permanent project guidance: [AGENTS.md](AGENTS.md), [DESIGN.md](DESIGN.md), [CONTENT.md](CONTENT.md).

## Routes

| Page | German (default) | English |
| --- | --- | --- |
| Home | `/` | `/en/` |
| Services | `/leistungen/` | `/en/services/` |
| About | `/ueber-uns/` | `/en/about/` |
| Contact | `/kontakt/` | `/en/contact/` |
| Imprint draft | `/impressum/` | `/en/imprint/` |
| Privacy draft | `/datenschutz/` | `/en/privacy/` |

Every language switch leads to the equivalent page. Canonical URLs use the intended domain `https://nimbusit.hr`; configuring that metadata does not attach or deploy the domain. The sitemap includes the eight non-legal pages. Legal drafts are omitted.

## Review protections and release dependencies

All pages always emit `noindex, nofollow, noarchive`. `robots.txt` blocks crawling; `public/_headers` supplies the equivalent response header for a future compatible static host. There is deliberately no production-mode switch yet. These are indexing controls, not authentication or privacy controls. The local server is the intended review surface.

Before a separately approved publication:

- Supply and verify the business contact email, or explicitly select and implement a real form backend. The contact page currently displays a labeled placeholder, has no form and cannot send enquiries.
- Supply the legal operator name, legal form, business address and applicable registration/tax/contact details. Replace both legal drafts with reviewed text in both languages. The current pages are not legal advice or completed legal notices.
- Confirm the eventual hosting services, logging/retention and any data processing used, then finalize the privacy notice accordingly.
- Optionally supply the consultant's preferred public name and an authentic portrait. The reserved area currently shows an original monogram and an explicit portrait placeholder.
- Review copy, design and accessibility. Remove the preview notice and indexing protections together only after approval and after incomplete pages are resolved. Review sitemap inclusion at that point.
- Set up Cloudflare **Pages** separately after explicit approval: build command `npm run build`, output `dist`. There is no adapter, Worker, deployment workflow or Cloudflare account configuration here. Do not change the legacy Worker or DNS as part of this implementation.

The site uses system fonts and no external media, analytics, trackers, cookies, React, client-side JavaScript or contact backend. All visuals are original CSS/SVG. The infrastructure diagram illustrates a workflow; it does not display customer data or performance metrics.

## Git boundaries

Work and push only on `rebuild/astro`. Preserve existing history. Never force push or merge into `master`. A push of this branch is not permission to configure, publish or deploy the site.

## Initial review validation

- Astro/TypeScript check: zero errors, warnings or hints.
- Static build: all twelve pages plus sitemap generated successfully; no client JavaScript output.
- Generated-output checks: twelve pages and 230 local references passed.
- Browser review: all twelve routes at effective CSS widths of 320px and 390px, plus homepage/service/about/contact layouts at 1440px; no horizontal overflow found.
- Verified equivalent-page language switching, service anchor navigation, primary contact CTA, visible keyboard skip-link focus and focus transfer to main content.
- Inspected desktop and mobile layouts, including the portrait reservation and contact preview. This is a focused implementation review, not a full assistive-technology or legal audit.
