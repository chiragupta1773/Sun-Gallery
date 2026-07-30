# Sun Gallery — website

A static site. No build step, no framework, no dependencies.

**To just look at it:** double-click `Sun-Gallery-Website.html` — the entire
site, all 13 pages with working navigation, bundled into one file with every
image inlined. Opens from anywhere, no unzipping, no server, works offline.
Rebuild it after any change with `python3 tools/build-single-file.py`.

**To deploy it:** use the folder. `index.html` needs the `assets/` directory
beside it, so opening it from inside a zip — or moving it out on its own —
gives you a blank page.

---

## Adding photos — the whole workflow

Everything on the site is generated from **one file you edit** (`assets/js/data.js`)
and **one file a script generates** (`assets/js/media.js`). You never touch HTML.

### 1. Name the file after the stone and finish

```
tools/originals/
    SLATE STONE_COPPER LEATHER.png     →  key: slate-stone-copper-leather
    copper-leather.jpg                 →  key: copper-leather        ← simpler
```

Spaces, capitals and underscores all collapse to hyphens. Short, predictable
names are easier to reference, so `copper-leather.jpg` beats the long version.

### 2. Run the optimiser

```bash
pip install pillow pillow-heif numpy      # once
python3 tools/optimize-images.py
```

For every original it writes three WebP widths into `assets/img/stones/`, plus a
dominant colour and a ~600-byte blurred preview, then rewrites `assets/js/media.js`.
HEIC straight off an iPhone is fine. Re-running is safe — keys you don't
regenerate are kept.

### 3. Reference the key in `data.js`

```js
{
  slug: "copper",
  name: "Copper",
  colour: "copper",                        // must exist in COLOUR_FAMILIES
  palette: ["#3E2E20", "#8C542C", "#DFB183"],
  finishes: ["natural", "leather"],        // ids from FINISHES
  applications: ["bathroom", "cladding"],  // ids from APPLICATIONS
  images: [
    { key: "natural-copper", caption: "Natural — shower lining, full height" },
    { key: "copper-leather", caption: "Leather — vanity wall and counter" }
  ]
}
```

That single block puts the stone into the home grid, the collection page, all
three filter axes, the horizontal rail, the footer and its own detail page.

**Skipping the optimiser is allowed.** Write a plain path instead of a key —
`images: ["photos/copper.jpg"]` — and it renders, just without responsive sizes
or the blur-up.

---

## Files

```
index.html          Home — hero, descent, featured, applications, features, export
collection.html     Filterable grid (colour × finish × application)
stone.html          Detail template, driven by ?s=<slug>
applications.html   Hub linking to the six range pages
finishes.html       Finishes, thickness, edge profiles, export packing, formats
contact.html        Enquiry form

interior.html       Slate flooring tiles / slate wall cladding
exterior.html       Slate paving slabs / stepping stones / decorative slate
elevation.html      Elevation stone tiles / natural stone elevation cladding
roofing.html        Slate roof tiles / affordable roofing slate
pool.html           Slate pool coping / waterline tiles
wholesale.html      Buy in bulk / wholesale price / price per m² / MOQ

assets/js/data.js   ← Stones, finishes, formats, applications.
assets/js/seo.js    ← Page titles, descriptions, landing copy, FAQs.
assets/js/media.js  ← generated. Do not hand-edit.
assets/js/app.js    Motion engine + renderers + structured data.
assets/css/style.css Design system.
tools/optimize-images.py
```

---

## The motion

One `requestAnimationFrame` loop drives everything, and all element positions are
measured once and cached — nothing reads layout mid-animation, so it stays at
60fps with any number of images.

- **Smooth scroll** — native scrolling is preserved (real scrollbar, keyboard,
  trackpad momentum); a fixed layer is lerped into position over it.
- **Descent** — columns of stone drift downward at different rates as you scroll,
  with a velocity kick so a fast flick pushes them further. The signature effect.
- **Parallax** — anything with `data-speed`. Higher number, more travel.
- **Pinned rail** — the home page horizontal track converts vertical scroll to
  horizontal. Becomes a normal swipe carousel under 900px.
- **Reveals** — `.rv` (fade up), `.rv-mask` (type slides from behind a mask),
  `.rv-clip` (image wipes open). Stagger with `data-d="1"` through `6`.

Smooth scroll, the custom cursor and page transitions all switch off automatically
on touch devices and for anyone with `prefers-reduced-motion` set.

---

## Performance

- Every photo ships at 400 / 800 / 1600px and the browser picks by `srcset`.
- Everything below the fold is `loading="lazy"`; hero images are `fetchpriority="high"`.
- Each image fades up from its own blurred preview — no white flash, no layout shift.
- Total CSS + JS is about 60 KB uncompressed, and there are no third-party scripts.

The one thing to watch: `atelier-tiles` is a tall crop and its 1600px version is
~700 KB. If you want it lighter, lower `QUALITY` in `tools/optimize-images.py`
or drop `1600` from the `WIDTHS` ladder.

---

## SEO

The six range pages each own one keyword cluster, so nothing competes with
itself. All copy, titles, descriptions and FAQs live in `assets/js/seo.js`.

| Page | Owns |
|---|---|
| `index.html` | slate stone supplier, slate stone exporter |
| `collection.html` | black slate tiles, silver grey slate |
| `interior.html` | interior stone, slate flooring tiles, slate wall cladding |
| `exterior.html` | exterior stone, slate paving slabs, stepping stones, decorative slate |
| `elevation.html` | elevation stone tiles, natural stone elevation wall cladding |
| `roofing.html` | slate roof tiles, affordable slate roof tiles |
| `pool.html` | slate pool coping |
| `wholesale.html` | buy in bulk, wholesale price, price per m², MOQ |

**Structured data** is emitted automatically: `Organization` + `WebSite` on
every page, `BreadcrumbList` on range and stone pages, `Product` on each stone,
`FAQPage` on all six range pages. Test them at
<https://search.google.com/test/rich-results>.

**Domain:** already set to `www.sungallery.info` in `assets/js/seo.js`,
`sitemap.xml`, `robots.txt` and `CNAME`. If you move domain, change all four.

After launch, submit `sitemap.xml` in Google Search Console.

---

## Things worth doing before launch

1. **Point the form somewhere.** `contact.html` currently composes a `mailto:`.
   Swap in Formspree, Netlify Forms or your CRM endpoint — the field names are
   already human-readable, so they'll arrive labelled.
2. **Replace the placeholder contact details** in `SITE` at the top of `data.js`
   (email, phone, address are currently invented).
3. **Check the stone copy.** I wrote the descriptions from the photographs and
   normal slate properties. Anything about origin, geology or performance should
   be confirmed by you before it's published.
4. **Silver Grey needs a dry shot.** It currently has only the polished pool
   photograph, so its card leads with a blue-green image that under-sells the
   grey. One natural-finish shot fixes it.
5. **Photograph the range pages.** Roofing, elevation, stepping stones and
   paving currently borrow the nearest interior shot. Those four pages will
   convert far better with one real photograph each — an actual slate roof and
   an actual paved terrace are the two biggest gaps.
6. **Thailand is written as an export market, not a location.** If you do open
   a Thai entity, tell me and I'll add a proper `LocalBusiness` schema — that
   is what earns a local map listing, and faking it gets pages demoted.

   
