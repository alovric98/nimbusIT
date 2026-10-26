# Nimbus IT

- Work exclusively on `rebuild/astro`. Preserve history. Never merge into, push to, or reuse the legacy `master` branch.
- Astro, strict TypeScript, static HTML and plain CSS. Keep dependencies minimal; no framework or client JavaScript without a concrete need.
- Keep route pairs and localized metadata in `src/data/site.ts`. German has no prefix; English uses `/en/`. Update both languages together.
- Follow DESIGN.md and CONTENT.md. Use semantic HTML, visible keyboard focus, accessible contrast and responsive layouts.
- No invented identities, credentials, clients, metrics or business details. Contact is live via the verified `info@nimbusit.hr` mailto link (no form or backend); legal pages stay drafts.
- All builds must remain `noindex` with crawl blocking until a separately approved release. Do not configure deployment, Workers, DNS or production domains. Do not add deployment workflows.
- Run `npm run check`, `npm run build`, `npm test`; inspect mobile and desktop when a browser is available. Check internal links, language switching, keyboard access and overflow.
- Push authorized development commits only to `rebuild/astro`. Never force push. Document outstanding release dependencies in README.md.
