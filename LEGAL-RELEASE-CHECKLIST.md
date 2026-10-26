# Nimbus IT — legal release checklist

Status: **incomplete; publication is not approved**. Reviewed on 2026-10-26 against the static `rebuild/astro` implementation. This is an information-gathering and review checklist, not a completed legal notice or a determination that every listed disclosure applies.

## Where verified information belongs

- `src/data/legal.ts` holds shared business details, unresolved privacy topics and bilingual technical observations. Missing values are `null` with explicit `TODO` comments. Only approved public details belong in these fields. Do not put private mailbox addresses, account identifiers, contracts or credentials in source control.
- `src/data/site.ts` remains the source for the verified public email, localized routes and metadata. `info@nimbusit.hr` is already supplied; do not ask for or publish the forwarding address.
- `src/components/Legal.astro` renders verified details and missing topics using the existing layout. Both languages remain visibly marked as drafts. Filling a field does not remove draft labels or approve legal wording.
- Record supporting evidence, provider records and legal review privately. For a conditional topic, record an explicit applicability decision rather than inventing a value or silently treating an unknown as not applicable. Review the final German and English wording together.

## Actual implementation and limits of this review

| Area | Observed behavior / evidence | Still unverified |
| --- | --- | --- |
| Website delivery | `astro.config.mjs` uses static output. The page generator produces 14 HTML pages; the sitemap is generated at build time. There is no runtime application API or contact backend in this branch. | Eventual host, CDN/security services, response behavior and provider logs. |
| Assets | CSS, SVG logo/favicon and images are served with the site; CSS uses system fonts. Canonical/hreflang URLs and XML namespace declarations are metadata, not embedded remote assets. | Anything an eventual hosting layer might inject or enable. |
| Visitor interaction | No emitted client scripts, forms, analytics, tracking pixels, external embeds or browser-storage code. Source review finds no application cookie/session mechanism. | Hosting-level cookies, logs or other processing cannot be excluded by reading this repository. No consent tool is implemented. |
| Contact | Both Contact pages link to `mailto:info@nimbusit.hr`. Opening the link hands off to the visitor's email application; sending is a separate user action. The website does not send, capture or store the email. | Content, sender address, headers and attachments are subsequently handled by email services; their exact handling is not established by the website code. |
| Email services | Owner confirmed Cloudflare Email Routing is active, tested and forwards messages to Gmail. This is supplied information, not a provider/account audit performed here. | Provider legal entities, account type, processing locations, access, retention, deletion, contractual roles and any transfer arrangements. |
| Preview controls | All HTML has `noindex, nofollow, noarchive`; `robots.txt` blocks crawling. `_headers` contains the corresponding response-header instruction for a compatible future host. Legal drafts are excluded from the sitemap. | Actual host support for `_headers` is not established. Indexing controls do not authenticate visitors or prevent data processing. |

The source/build review does not establish the behavior of a live production host, DNS, provider accounts or a visitor's email application. Browser visual/keyboard checks are unavailable under the saved browser permission restriction. No provider configuration or email delivery test was performed in this task.

Preparation validation: `npm run check` passed with zero errors, warnings or hints; `npm run build` and `npm test` passed for 14 pages, 302 local references and two verified email links. Generated assets contain no client JavaScript or remote asset imports. Draft warnings, missing-information lists, language pairs, metadata, sitemap and preview protections are checked in the build validator.

## Business information to supply

- [x] Resolved: full registered legal operator name, including the individual's legal name if the operator is a sole trader. Confirm how the Nimbus IT brand relates to that operator.
- [x] Resolved: exact legal form and country of establishment, supported by current business records. The site's Croatian positioning does not establish the legal identity or applicable disclosure rules.
- [x] Resolved: public business/service address: street and number, postal code, city and country. Confirm the address approved for the legal notice.
- [ ] Open: authorized representative's name and role, **if applicable**; otherwise supply a reviewed not-applicable decision.
- [ ] Open: registry/court or issuing authority and registration number (MBO), **if applicable**; otherwise supply a reviewed not-applicable decision.
- [x] Resolved: OIB approved by the owner for publication and entered in `src/data/legal.ts`. Decision: no VAT ID (PDV-ID) exists for now; revisit if one is issued. Do not send unrelated personal identifiers.
- [x] Resolved: the number of years is not published in the public text (draft wording refers to statutory retention obligations). Internal rule: the owner keeps invoices and the KPR (cash book) for at least 11 years. Statutory figures remain unconfirmed secondary-source values; legal review may confirm.
- [ ] Confirm whether any further contact detail or sector/professional disclosure applies to this specific operator and service. Supply exact details only where applicable and approved for publication.
- [x] Resolved: privacy controller's legal identity/address are verified in `src/data/legal.ts`. Still to confirm: whether `info@nimbusit.hr` is also the contact for privacy requests. Any separate controller, representative or DPO contact (open, see DPO item below) only if applicable.

## Hosting and processing details to supply

- [ ] Intended website hosting provider's legal entity and exact product/service. Identify any separate CDN, reverse proxy, security/bot protection or monitoring service that will actually be enabled. Existing email routing does not prove Cloudflare hosts the website.
- [ ] For each enabled hosting/security service: actual request/error/security log fields, purpose, who can access them, storage/processing locations, retention period or criteria, rotation/deletion and any backups. Confirm whether IP addresses, timestamps, requested URLs, referrers and user-agent information are recorded; do not assume all or none are logged.
- [ ] Confirm any host-injected scripts, cookies or storage against the intended release configuration. The branch currently implements none. Reassess disclosures and any consent requirements only for the actual release setup.
- [x] Gmail account type: consumer (non-Workspace) account, confirmed by the owner on 2026-10-26. Still open: Google contracting entity, applicable terms and processing conditions. Do not provide the private forwarding address for publication.
- [ ] Open: contracting Cloudflare entity and service for website delivery (Pages/CDN) and Email Routing, plus applicable provider terms. The `nimbusit-web` Pages project exists on `*.pages.dev` only; no custom domain is attached.
- [ ] Open: actual hosting/request log fields, purpose, access, retention and processing locations for Cloudflare Pages and Email Routing. The legacy Worker `nimbusit` has invocation logs enabled; the Pages project's logging has not been reviewed.
- [ ] Explain how enquiries are handled: who can read them, where replies are sent from, whether other people/services receive them, and whether messages or attachments are copied into any other system. No CRM, ticket system or newsletter service is implemented in this branch; include one only if actually used for these enquiries.
- [ ] Retention (draft wording entered in `privacyDetails`, pending legal review): enquiries without an order are deleted 6 months after the last message; correspondence that is a business record is kept as long as statutory retention obligations require. No year count is published. Internally the owner keeps invoices and the KPR (cash-book) for at least 11 years (Zakon o računovodstvu; General Tax Act: 10 years from start of limitation). Both figures come from secondary sources and are unconfirmed against the statutes. Hosting/log retention remains open.
- [ ] Supply provider evidence for processing locations, recipients/subprocessors, roles and applicable agreements. Have any transfers outside the relevant jurisdiction and their arrangements assessed against the actual services/account terms. Do not assume a region or safeguard from the provider's brand name.

## Legal decisions and approved wording still required

- [ ] Determine the publication/disclosure requirements applicable to the verified operator, establishment, services and target market. A German translation alone does not settle this. Confirm whether any further sector-specific or other notice is needed, or explicitly record that it is not applicable.
- [ ] Approve the controller identity and the purpose and legal basis for each actual activity: website delivery/security and handling email enquiries, plus any additional activity confirmed above. Do not infer a legal basis or consent requirement from this checklist.
- [ ] Approve retention criteria, recipient/transfer disclosures, applicable rights and the route for handling requests/complaints, including the competent authority where applicable. Assess any further information required for this particular processing; do not paste generic clauses for absent services.
- [ ] Decide whether a DPO or representative is applicable, and whether any consent mechanism is required for the actual release configuration. Neither is appointed or implemented by this task.
- [ ] Supply or approve final German and English Impressum/Privacy wording based on the verified facts and applicability decisions. The technical observations currently on the draft page are not a final privacy policy or a compliance claim.

The review topics above are informed by the EU's [Your Europe guidance on transparent information](https://europa.eu/youreurope/business/governance-and-sustainability/digital-and-data-compliance/data-protection-gdpr/index_en.htm). It describes identity, purposes, legal bases, recipients and context-dependent information such as retention, rights and transfers. It does not determine this operator's local publication requirements or supply the missing account facts.

## Completion and separate publication approval

- [ ] Resolve source TODOs using approved public facts or documented applicability decisions; complete and compare both language versions. Keep supporting private evidence outside the repository.
- [ ] Review the final pages against the actual intended hosting and email arrangements. Re-run checks/build/tests and review responsive appearance and keyboard access when browser access is available.
- [ ] Before setting `PUBLIC_RELEASE=true`, resolve every open item in this checklist, or keep `legalDraft = true` in `src/data/site.ts`. While it is true, the legal pages (Imprint and Privacy, both languages) keep `noindex, nofollow, noarchive` and stay out of the sitemap even in a release build. `legalDraft` is the only switch holding them out of the index; set it to `false` only after the legal review is complete and the owner has explicitly approved changing the draft labels.
- [ ] Old URL handling at launch. Search Console (read 2026-10-26) shows 13 indexed URLs from the legacy `master` site, last crawled 21-22 Oct 2026: `/google-oglasi-za-obrte/`, `/besplatna-analiza/`, `/konfigurator-proizvoda-za-web/`, `/izrada-web-stranica/`, `/kolacici/`, `/privatnost/`, `/en/cookies/`, `/en/privacy/`, `/en/`, plus `http://` variants. Add `public/_redirects` only at launch, with 301s `/privatnost/` and `/kolacici/` to `/datenschutz/` and `/en/cookies/` to `/en/privacy/`; the redirect to `/datenschutz/` only makes sense once that page is no longer a draft. The other four old URLs return 404 with no redirect to the home page. `/en/` and `/en/privacy/` exist in the new site. Before launch also check the `www` variant (currently a 301 to the apex via a Cloudflare redirect rule).
- [ ] Obtain separate release approval before changing draft labels, site-wide preview/noindex/robots controls or sitemap inclusion, or publishing the site. This task does not authorize those changes.

**Next information package:** representative and MBO/registry disclosures; controller/privacy contact confirmation; intended hosting/logging settings; email provider/account details and enquiry retention/access rules; reviewed legal decisions and approved bilingual notices. The business email itself is already verified.
