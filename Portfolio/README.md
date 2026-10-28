# Deep Manera — Portfolio source

## Brand identity

The owner-provided brand direction is royal navy `#0B1F3A`, champagne gold `#C6A15B`, warm beige `#F3EBDD`, warm ivory `#FFFCF6` and graphite `#252A32`, with the supplied muted, border, surface, success, warning, error and focus utility colors recorded in `plan.md`. The navbar and favicon use an original scalable DM SVG monogram. `brand-lockup.svg` supplies the wordmark and “Websites / Business systems / Custom software” descriptor for brand uses that need the full logo. These SVGs are hand-built vector assets based on the supplied reference; the image itself is not used in the site or source ZIP.

A responsive, multi-page static freelancer portfolio made from the user's supplied project archives and screen-animation reference. The site contains archive-grounded case-study notes, a standalone motion showcase, service tiers, a comparison matrix, an INR/USD package estimate calculator, remote-engagement notes, FAQs, privacy notes and project-scope terms.

## Run locally

No dependency installation or build step is needed. From the project root:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. Serve the files over HTTP rather than opening the HTML files as `file://`: the estimator loads its public `pricing.json` by same-origin `fetch`.

## Deploy the same files on Vercel

1. Create or choose the Vercel account/project that will own the site. Review that account's current plan, billing, usage limits and deployment terms; no Vercel account, subscription, domain or deployment was purchased or created for this delivery.
2. Import the Git repository or upload this folder with the files at the project root, so `index.html`, the HTML pages, `css/styles.css`, the scripts under `js/`, the data under `data/`, the SVG assets under `assets/` and `vercel.json` are directly inside that root.
3. Choose **Other** as the framework preset. This is a plain static website: do not run a package install, build command or server command; serve the project root as static output. No environment variables or private build secrets are required.
4. Deploy a preview and inspect `/`, `/pricing.html`, `/showcase.html`, `/privacy.html` and `/terms.html` at mobile and desktop widths before attaching a custom domain.

`vercel.json` adds same-origin browser-security headers (MIME sniff protection, a restrained referrer policy, a small Content Security Policy and unused-device-permission denial). It intentionally does not set `X-Frame-Options` or `frame-ancestors`, so a host preview embedded by a development tool is not blocked. The website itself does not require Vercel-specific build output, rewrites or proprietary APIs; it can also be served from any static host that preserves the JSON file and named HTML pages.

## Contents and behavior

| File | Purpose |
|---|---|
| `index.html` | Freelancer introduction, seven project archive summaries, service abilities, process, scope boundaries and FAQ. |
| `pricing.html` + `data/pricing.json` + `js/pricing-page.js` | Earlier package catalog, separate INR/USD figures, scope matrix and client-side estimator with add-ons, quantities, rush option and monthly care. |
| `showcase.html` + `js/showcase.js` | Scroll-led process and two working, fictional workflow examples. Sample entries are clearly marked; nothing connects to a client system. |
| `privacy.html` | Product-specific privacy draft for this static site and mailto workflow. |
| `terms.html` | Informational scope, price, IP, support and project-agreement notes; not a contract. |
| `css/styles.css` + `js/app.js` + `js/theme.js` | Responsive editorial visual system, filtering, navigation, motion, and non-persisted light/dark theme. |
| `assets/favicon.svg` | Original vector monogram. No supplied archive photographs, screenshots, client marks, customer records or source projects are included. |
| `vercel.json` | Static-host security headers. No third-party service, API, build secret or paid library is required by the source. |
| `manus-routes.json` | Page-route declaration for the Manus preview environment. |

The package calculator operates only in the visitor's browser, performs the math from `pricing.json`, and can prepare a draft in the visitor's email application. It does **not** send, store or transmit the quote, and it is not a booking or payment tool. The interface stores no currency or theme preference. The package values are separate archive-provided INR and USD amounts, not live conversions.

## Pricing and legal review before publishing

The price, delivery, support and payment examples were extracted from the supplied `Portfolio.zip` configuration, which has no verified last-review date. The pricing page intentionally labels them as prior, non-binding estimates. Confirm current values, included deliverables, revision rules, support periods, rush availability, taxes, payment schedule and third-party cost responsibility before representing them as current offers or signing a project.

The Privacy and Terms pages are owner-review drafts. Confirm the identity/contact and selected host/email providers, hosting logs and retention, enquiry retention, privacy request process, governing law, intellectual property terms and applicable Indian DPDP Act/Rules commencement before public commercial use. Obtain legal and tax advice for the actual jurisdiction. They are not legal advice, a signed freelance contract or a guarantee of compliance.

## Cost and service status

| Item | Status in this package | Cost/owner note |
|---|---|---|
| Website source and interactive estimate | Included; no third-party JS libraries or commercial assets | No service fee added by this source. |
| Manus Website preview | Project files were built in the initialized Manus project | Preview is not a public Vercel deployment. Existing Manus account terms/limits still apply. |
| Vercel hosting and custom domain | Not deployed or purchased | Select the account owner and review current plan, usage charges and domain renewal costs before deployment. |
| Email/contact delivery | `mailto:` link only; no form-processing/email API | Visitor's and owner's chosen email provider applies its own terms/costs. No message is sent automatically. |
| APIs, hosting, domain, third-party licences | Not activated in the source | Add only by written scope and explicit approval; future costs vary by provider and use. |

## Maintenance

The site is plain HTML/CSS/JavaScript. After changing `pricing.json`, verify INR and USD figures, add-on caps, any package-included options and the estimate totals. When adding or removing a page, update `manus-routes.json`, page navigation, and this README. Keep the security headers compatible with any future form, embed or analytics integration; do not add secrets to public static files.


## Checks run and limits

The site was served over local HTTP, not opened as `file://`. JavaScript syntax (`node --check`), JSON configuration, route-manifest/page agreement, internal page links/anchors and required assets were checked. All five HTML routes, the stylesheet, scripts, pricing JSON, route manifest, favicon and crawler file returned HTTP 200. Chromium browser checks covered all five pages across 320–1920px widths; pricing-page breakpoints that initially exposed overflow were corrected and rechecked. A filtered work list, responsive menu/Escape behavior, color control, reduced-motion handling, a labelled skip link, quote validation/error state, synthetic inventory search/history and the sample workflow stepper were exercised.

The calculator was checked with a Web Application plus two additional languages and the optional 25% rush setting: ₹217,500 in the prior INR table and $4,346 in the separately entered USD table. The selected ₹5,000/$70 monthly support remains separate, and the add-on maximum of five was enforced (₹262,500 INR with that selection). Selected text/background pairs were measured for contrast; this is not a certification or full WCAG audit. The page sources contain no external font, image, analytics, API or JavaScript-library requests. No performance score under production network conditions, production security scan, mail delivery, actual Vercel deployment, host-side header inspection, or legal review was performed. No enquiry email was sent.

## Final folder layout

```text
portfolio/
├── index.html
├── work.html
├── method.html
├── lab.html
├── styles.html
├── pricing.html
├── showcase.html
├── privacy.html
├── terms.html
├── vercel.json
├── manus-routes.json
├── assets/
│   ├── brand-mark.svg
│   ├── brand-lockup.svg
│   └── favicon.svg
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── theme.js
│   ├── pricing-page.js
│   └── showcase.js
└── data/
    └── pricing.json
```
