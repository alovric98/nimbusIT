# Nimbus IT

- Work exclusively on `rebuild/astro`. Preserve history. Never merge into, push to, or reuse the legacy `master` branch.
- Astro, strict TypeScript, static HTML and plain CSS. Keep dependencies minimal; no framework or client JavaScript without a concrete need.
- Keep route pairs and localized metadata in `src/data/site.ts`. German has no prefix; English uses `/en/`. Update both languages together.
- Follow DESIGN.md and CONTENT.md. Use semantic HTML, visible keyboard focus, accessible contrast and responsive layouts.
- No invented identities, credentials, clients, metrics or business details. Contact is live via the verified `info@nimbusit.hr` mailto link (no form or backend). Legal pages are published without a separate legal review; open items are in LEGAL-RELEASE-CHECKLIST.md.
- The site is live on Cloudflare Pages from the `release` branch (owner-approved 2026-10-26). Builds without `PUBLIC_RELEASE=true` stay `noindex`. Do not change DNS, Workers or Pages settings, or push `release`, without owner approval.
- Run `npm run check`, `npm run build`, `npm test`; inspect mobile and desktop when a browser is available. Check internal links, language switching, keyboard access and overflow.
- Push authorized development commits to `rebuild/astro`; `release` only fast-forwards to a tested `rebuild/astro` commit. Never force push. Document outstanding release dependencies in README.md.
