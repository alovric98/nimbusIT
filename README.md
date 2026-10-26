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
src/data/powershell.ts    German and English PowerShell landing page content
src/layouts/Layout.astro Shared HTML head, navigation, preview notice and footer
src/components/          Page content and reusable presentation components
src/pages/[...page].astro Fourteen statically generated localized pages
src/pages/sitemap.xml.ts Static sitemap with language alternates
src/styles/global.css    Design tokens, components and responsive CSS
public/brand/            Proposal 02 SVG logos/symbols, provenance and font license
public/                  Symbol favicon, robots.txt and static host headers
scripts/validate-build.mjs Generated-output checks; no test dependencies
```

Permanent project guidance: [AGENTS.md](AGENTS.md), [DESIGN.md](DESIGN.md), [CONTENT.md](CONTENT.md).

## Routes

| Page | German (default) | English |
| --- | --- | --- |
| Home | `/` | `/en/` |
| Services | `/leistungen/` | `/en/services/` |
| PowerShell automation | `/powershell-automatisierung/` | `/en/powershell-automation/` |
| About | `/ueber-uns/` | `/en/about/` |
| Contact | `/kontakt/` | `/en/contact/` |
| Imprint draft | `/impressum/` | `/en/imprint/` |
| Privacy draft | `/datenschutz/` | `/en/privacy/` |

Every language switch leads to the equivalent page across seven localized route pairs. Canonical URLs use the intended domain `https://nimbusit.hr`; configuring that metadata does not attach or deploy the domain. The sitemap includes the ten non-legal pages with reciprocal language alternates. Legal drafts are omitted.

## Review protections and release dependencies

All pages always emit `noindex, nofollow, noarchive`. `robots.txt` (`src/pages/robots.txt.ts`) blocks crawling; `_headers` (generated in `astro.config.mjs`) supplies the equivalent response header for a compatible static host. The only switch is the build variable `PUBLIC_RELEASE=true`, which drops the robots meta (except on the legal draft pages, which keep it while `legalDraft` in `src/data/site.ts` is true and stay out of the sitemap), the `X-Robots-Tag` header, the `Disallow` rule and the preview bar, and lets `robots.txt` allow crawling and reference the sitemap. It is unset by default and must not be set in any configuration (local, CI or Cloudflare) until the release is approved. When it is set, set it for the Pages **production** environment only so preview deployments stay `noindex`. `npm test` validates both modes (`npm run test:release` builds into `dist-release/`). These are indexing controls, not authentication or privacy controls. The local server is the intended review surface.

## Release (approved by the owner on 2026-10-26)

- Hosting: Cloudflare Pages project `nimbusit-web`, production branch `release`, build `npm run build`, output `dist`, `NODE_VERSION=24`, `PUBLIC_RELEASE=true` in the **production** environment only. Preview deployments are disabled. Custom domain `nimbusit.hr`; `www` redirects to the apex via a Cloudflare redirect rule.
- Development continues on `rebuild/astro` (builds stay `noindex`). Publishing means fast-forwarding `release` to a tested `rebuild/astro` commit and pushing it.
- `*.pages.dev` aliases keep `X-Robots-Tag: noindex` in release builds, so only `nimbusit.hr` is indexed. `public/_redirects` sends the three legacy privacy/cookie URLs to the new privacy pages; other legacy URLs return 404.
- Legal pages were published without a separate legal review by owner decision (`legalDraft = false`). Open items stay in [LEGAL-RELEASE-CHECKLIST.md](LEGAL-RELEASE-CHECKLIST.md).
- Rollback: in Pages, roll back to the previous deployment, or remove the `nimbusit.hr` custom domain and re-add it to the legacy Worker `nimbusit` (kept, unchanged, production branch `master`). Email Routing (MX, SPF, DKIM) is independent of the website records.

The verified business email is `info@nimbusit.hr`, displayed as a `mailto:` link on both Contact pages. The owner confirmed email routing is active and tested. Forwarding destination details are not included in the website. The site uses system fonts and no external media, analytics, trackers, cookies, React, client-side JavaScript or contact backend. The approved horizontal Proposal 02 identity has been reconstructed as SVG paths, including outlined wordmark lettering, from the supplied raster reference. Original designer vectors were unavailable; see [brand provenance and usage](public/brand/README.md). Both light- and dark-surface assets are included, with no neon glow. The favicon contains only the cloud/N symbol. The infrastructure diagram illustrates a workflow; it does not display customer data or performance metrics.

## Git boundaries

Work and push only on `rebuild/astro`. Preserve existing history. Never force push or merge into `master`. A push of this branch is not permission to configure, publish or deploy the site.

## Initial review validation

- Astro/TypeScript check: zero errors, warnings or hints.
- Static build: all twelve pages plus sitemap generated successfully; no client JavaScript output.
- Generated-output checks: twelve pages and 230 local references passed.
- Browser review: all twelve routes at effective CSS widths of 320px and 390px, plus homepage/service/about/contact layouts at 1440px; no horizontal overflow found.
- Verified equivalent-page language switching, service anchor navigation, primary contact CTA, visible keyboard skip-link focus and focus transfer to main content.
- Inspected desktop and mobile layouts, including the portrait reservation and contact preview. This is a focused implementation review, not a full assistive-technology or legal audit.

## Content and UX refinement — 2026-10-26

- German and English service details use scope-specific explanations and concrete, conditional automation examples: VM provisioning from configuration, Windows Server roles/services and deployment prerequisite checks with logging. These are possible tasks, not customer case studies.
- About explains practical engineering, maintainable PowerShell, Git history, focused code review, agreed testing environments and handover documentation.
- Mobile header and stacked hero spacing are tighter. The logo, typography, colors, page grids, desktop hero, contact preview and release blockers are preserved.
- Validation: Astro/TypeScript check, static build and generated-output checks pass (12 pages, 256 local references). Source-level responsive checks cover 320–1440px, confirm only spacing changes below 901px and preserve 44px navigation targets.
- Fresh visual responsive and keyboard checks remain pending: browser permission for the local preview was declined during this refinement. The earlier browser results above describe the previous revision.

## PowerShell landing pages — 2026-10-26

- Added German and English service landing pages through the existing route registry and static page generator. Each includes practical automation capabilities, implementation and handover steps, collaboration details, five visible FAQ answers and localized contact CTAs.
- Infrastructure Automation on Services links to the landing page; the landing page links back to Services. Primary navigation, shared layout, typography, colors, SVG identity and dependencies are unchanged.
- Canonical metadata, contextual language switching and the sitemap derive from the same route registry. Validation now covers 14 HTML pages, seven localized pairs, ten sitemap entries and 302 local references, including landing-page titles, H1s, CTAs, FAQ entries and reciprocal sitemap alternates.
- `npm run check`: zero errors, warnings or hints. `npm run build` and `npm test`: passed. No client scripts, external dependencies or trackers were introduced. Contact/legal previews, robots policy and indexing protections are preserved.
- Source-level CSS checks at 320, 390, 600, 601, 760, 768, 900, 1024 and 1440px confirm applicable hero spacing, wrapping and stacked layout rules. Existing focus styles and 44px navigation targets are unchanged. **Rendered desktop/mobile appearance, overflow and keyboard interaction were not tested for this revision:** a saved browser permission blocks local-preview access. Complete these checks before release; source checks do not substitute for browser testing.
- Local preview: [German](http://127.0.0.1:4321/powershell-automatisierung/) and [English](http://127.0.0.1:4321/en/powershell-automation/). All release dependencies listed above still apply.

## Verified business contact — 2026-10-26

- Replaced the inactive contact panel with a direct email section in German and English. Both pages display `info@nimbusit.hr` as a clickable link that opens the visitor's email application. Existing project CTAs continue to lead to the localized Contact page.
- Updated Contact titles/descriptions, the PowerShell project-start FAQ and the site-wide notice. The notice now refers only to pending legal information; legal drafts and all indexing/crawl protections remain intact.
- Validation passed: `npm run check` (zero errors, warnings or hints), `npm run build` and `npm test` (14 pages, 302 local references, two verified email links, localized CTAs, metadata, language pairs and sitemap). Generated HTML is checked for unexpected public email addresses and inactive contact wording. No dependency or infrastructure configuration changed.
- The existing responsive layout and keyboard focus styles are retained; the email link has a minimum 44px target and can wrap. Rendered visual, overflow and keyboard checks remain unavailable because of the saved browser permission restriction described above. Email delivery was confirmed by the owner; this website change does not reconfigure or send mail.
- Local review: [German Contact](http://127.0.0.1:4321/kontakt/) and [English Contact](http://127.0.0.1:4321/en/contact/). Legal completion and the other release dependencies above remain outstanding.
