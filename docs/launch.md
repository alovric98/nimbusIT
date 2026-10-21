# Production launch

The redesign is confined to `alovric98/nimbusIT`, branch `redesign/retro-digital`.
The private review preview is separate from `nimbusit.hr`. The original
Cloudflare deployment, domain and DNS have not been changed.

## Owner information and checks still required

1. **Tax wording.** VAT/tax status is unverified. Add the correct statement
   beside pricing before launch. The current copy says the quote will state
   the tax treatment; no tax status has been invented.
2. **Registered business details.** Confirm the full registered business name,
   address, registration/identification details and data controller. Complete
   the privacy and business information accordingly. Name and contact details
   are verified from the original repository. Review retention and processing
   arrangements with Web3Forms, Google and Cloudflare against actual practice.
3. **Real inbox delivery.** The original public Web3Forms key is preserved.
   Automated checks simulate provider responses; no message has been sent.
   Submit one owner-controlled test, confirm delivery to `info.nimbusit@gmail.com`,
   and check permitted domains in the Web3Forms account.
4. **Production deployment.** Review `redesign/retro-digital` and deploy through
   the existing GitHub/Cloudflare account. GitHub authentication is connected;
   production deployment remains a separate step after the launch checks. No
   new framework or backend is required. The private preview is already usable.

## Existing Workers Static Assets deployment

```sh
python3 scripts/build.py
python3 scripts/check.py
node --check js/main.js
node --check js/cookies.js
node --check js/motion.js
# With the existing authorised Cloudflare account, after final review:
# npx wrangler deploy
```

Keep `.assetsignore` exclusions for Git, development sources, docs, config,
`dist/` and dependencies. Include `_headers`, `_redirects`, robots and sitemap.
The canonical domain remains `https://nimbusit.hr`. `workers_dev` retains its
existing `true` setting; changing that is a separate domain decision.

For Pages, an optional clean build is `python3 scripts/export.py` with output
directory `dist`. Do not publish development directories as static content.

## Production smoke test

- Verify HTTPS, page title, social image, icons and production canonicals.
- Open `/`, `/privacy/`, `/cookies/`, an unknown URL and the retained PDF.
- Verify `/privatnost/` and `/kolacici/` redirect to the English routes.
- Test the form, email/phone links, mobile menu, package links and full scope.
- Check animation pause/resume and the OS reduced-motion preference.
- Check cookie-notice dismissal, reopening and deletion.
- Submit the updated sitemap to the existing Search Console, if configured.

Ads, conversion tracking and external subscriptions are not activated. Agree
accounts, configuration and consent handling before adding tracking tags.
The current cookie notice is informational and does not grant future consent.
