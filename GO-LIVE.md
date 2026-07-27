# Sun Gallery — go-live report

Everything that could be fixed without information only you have, has been
fixed. The site is ready to upload.

---

## Your details, now live across the site

| | |
|---|---|
| Domain | `www.sungallery.info` |
| Email | info@sunminerals.net |
| Phone | +91 91168 72953 |
| WhatsApp | wa.me/919116872953 |
| Founded | 2008 (18 years, calculated — never goes stale) |

The domain is set in `seo.js`, `sitemap.xml`, `robots.txt`, `CNAME`, every
canonical tag and every `og:image`. The phone appears in the footer, the
overlay menu, the contact page and the structured data. WhatsApp is now a
working link rather than a dead `#`.

---

## Fixed in this pass

**Navigation — the serious one.** 44 links were dead in the single-file
build: header, footer, menu, stone cards, application rows, finish cards.
Everything the JavaScript renders kept real `.html` paths, which don't exist
when the site is one file. All generated links now go through one helper that
emits the right form for each build. Verified by clicking: 59 links, 0 dead.

**Absolute URLs.** Canonical tags and `og:image` were relative. Google treats
relative canonicals inconsistently, and Facebook, WhatsApp and LinkedIn cannot
resolve a relative image at all — link previews would have been blank. All
absolute now, plus `og:url` added to every page.

**Form hardening.**
- Honeypot field — bots that fill it get the normal confirmation, nothing is sent
- `aria-live` on the confirmation and `aria-invalid` on bad fields, so screen readers announce both
- `autocomplete` and `inputmode` on every input — correct mobile keyboards, working autofill
- Underscore-prefixed internals stripped from the payload

**Accessibility.**
- Heading structure repaired — 16 level-jumps down to 0, without changing a pixel
- Skip-to-content link for keyboard users
- `<noscript>` fallback with your email and phone on all 13 pages
- 404 page marked `noindex`

**Touch.** 44px minimum tap targets on phones, larger FAQ and chip hit areas,
and a hero size step for screens under 380px so the headline can't overflow.

---

## Verification

| Check | Result |
|---|---|
| Pages rendering without a single JS error | 13 / 13 |
| Internal links, folder build | 627, 0 broken |
| Links clicked, one-file build | 59, 0 dead |
| Images with alt text | 163 / 163 |
| Pages with exactly one h1 | 13 / 13 |
| Heading-level jumps | 0 |
| Form fields with a label | all |
| JSON-LD blocks, all valid | 40 |
| Page titles unique, under 65 chars | 12 / 12 |
| Meta descriptions under 165 chars | all |
| Target keywords covered | 20 / 20 |
| Device profiles booting clean | desktop, tablet, mobile, reduced-motion |
| Form: validation / send / clear / bot / offline | all pass |
| Copy audit: stale names, old dates, placeholders | clean |
| Home page first load | ~181 KB |

---

## The one thing only you can do

**Activate the form.** It relays through FormSubmit, which will not send to an
address until that address confirms:

1. Upload the site and open it
2. Fill in the enquiry form and submit
3. FormSubmit emails **info@sunminerals.net** — click the activation link
4. Every submission from then on arrives in that inbox

Until step 3 nothing arrives, and the visitor still sees "thank you" — which
is why it matters. If the send fails the form shows a button that opens a
pre-filled email instead, so no enquiry is ever lost, but most people won't
click it.

---

## Uploading

1. Unzip and upload the **contents** of the folder, so `index.html` sits at
   the repository root.
2. Include the hidden files: **`.nojekyll`** and **`CNAME`**. Without
   `.nojekyll` GitHub can mangle the assets folder; without `CNAME` your
   custom domain won't stick.
3. Settings → Pages → Deploy from a branch → `main` → `/ (root)`.
4. At your registrar, point `www` to `<your-github-username>.github.io`.
5. Settings → Pages → Custom domain → `www.sungallery.info` → tick **Enforce
   HTTPS** once the certificate appears (up to an hour).
6. Submit `https://www.sungallery.info/sitemap.xml` in Google Search Console.

---

## Not blocking, but worth doing

**Photograph the four thin pages.** Roofing, elevation, stepping stones and
paving borrow interior shots. Those pages target commercial search terms and
currently show the wrong kind of image — an actual slate roof and an actual
paved terrace are the two biggest gaps in the whole site.

**Instagram and LinkedIn** are still hidden because there are no URLs. Add
them to `SITE.social` in `data.js` and they appear.

**The address** reads "Sun Gallery, Rajasthan, India" — I never had a real
one. A street address helps local search.

**Stone descriptions** were written from your photographs and general slate
properties. Anything about origin, geology or performance should be confirmed
by you before customers read it as fact.
