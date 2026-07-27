#!/usr/bin/env python3
"""
SUN GALLERY — single-file builder
=================================

Bundles the ENTIRE site — all 13 pages, the stylesheet, the scripts and every
photograph — into one self-contained .html file. It opens by double-click from
anywhere: desktop, USB stick, email attachment. No unzipping, no web server,
no internet connection needed (fonts fall back to system serif/sans offline).

    python3 tools/build-single-file.py

Output:  Sun-Gallery-Website.html

Navigation works: links become #/collection, #/wholesale and so on, and a
small router inside app.js swaps the page body. Filters, the stone detail
pages and the enquiry form all work exactly as they do on the real site.

Use this for previewing and for sending to clients.
Deploy the FOLDER for the real website — separate files cache better, load
far faster, and a single 5 MB page is not something you want Google crawling.

    WIDTH      which image variant to inline (400 is light, 800 is sharp)
    HERO_WIDTH full-bleed images get their own, larger size
"""
import base64, os, re, sys, json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WIDTH = 400          # grid and card images
HERO_WIDTH = 800     # anything shown full-bleed
OUT = "Sun-Gallery-Website.html"

# keys that appear as full-width heroes or background plates
HERO_KEYS = {"forest-fire", "prime-grey-polish", "natural-copper", "devli-green",
             "silver-shine-polish", "silver-shine-natural", "prime-grey-sour-blast",
             "natural-grey", "atelier-tiles", "texture-fireplace", "copper-polish",
             "star-galaxy", "prime-grey", "prime-grey-bath", "devli-green-leather",
             "devli-green-polish", "packing-crate-open", "packing-crate-strapped",
             "packing-yard"}

PAGES = ["index.html", "collection.html", "stone.html", "applications.html",
         "finishes.html", "contact.html", "interior.html", "exterior.html",
         "elevation.html", "roofing.html", "pool.html", "wholesale.html", "404.html"]


def data_uri(path):
    ext = os.path.splitext(path)[1].lower()
    mime = {".webp": "image/webp", ".png": "image/png",
            ".jpg": "image/jpeg", ".jpeg": "image/jpeg"}.get(ext, "application/octet-stream")
    with open(path, "rb") as f:
        return "data:%s;base64,%s" % (mime, base64.b64encode(f.read()).decode())


def pick(variants, want):
    """Closest available width at or below `want`, else the smallest there is."""
    if want in variants:
        return variants[want]
    below = [v for v in variants if v <= want]
    return variants[max(below)] if below else variants[min(variants)]


def collect_images():
    """Walk every folder under assets/img — stones, packing, and anything
    you add later — so a new category never silently misses the bundle."""
    imgroot = os.path.join(ROOT, "assets", "img")
    by_key = {}
    for folder in sorted(os.listdir(imgroot)):
        d = os.path.join(imgroot, folder)
        if not os.path.isdir(d) or folder == "brand":
            continue
        for f in sorted(os.listdir(d)):
            m = re.match(r"(.+)-(\d+)\.webp$", f)
            if m:
                by_key.setdefault(m.group(1), {})[int(m.group(2))] = (folder, f)

    chosen, uris = {}, {}
    for key, variants in by_key.items():
        want = HERO_WIDTH if key in HERO_KEYS else WIDTH
        folder, f = pick(variants, want)
        rel = "assets/img/%s/%s" % (folder, f)
        chosen[key] = rel
        uris[rel] = data_uri(os.path.join(imgroot, folder, f))

    logo = os.path.join(ROOT, "assets", "img", "brand", "logo.png")
    if os.path.exists(logo):
        uris["assets/img/brand/logo.png"] = data_uri(logo)
    return chosen, uris


def body_of(page):
    """The inner HTML of #scroll — the part the router swaps."""
    html = open(os.path.join(ROOT, page), encoding="utf-8").read()
    m = re.search(r'<div id="scroll">(.*?)\n</div>\s*<script', html, re.S)
    if not m:
        m = re.search(r'<div id="scroll">(.*)</div>', html, re.S)
    return m.group(1) if m else ""


def rewrite_links(text):
    """page.html?x=y  →  #/page?x=y   (index.html → #/)"""
    def sub(m):
        attr, page, q = m.group(1), m.group(2), m.group(3) or ""
        if page == "index":
            return '%s="#/%s"' % (attr, q)
        return '%s="#/%s%s"' % (attr, page, q)
    return re.sub(r'(href)="([a-z0-9\-]+)\.html(\?[^"]*)?"', sub, text)


def build():
    chosen, uris = collect_images()

    # ---- page bodies ----
    def sanitize(t):
        """Inline known assets, then drop any reference we did not inline
        (srcset entries at widths we skipped, favicons, og:image)."""
        for rel, uri in uris.items():
            t = t.replace(rel, uri)
        t = re.sub(r'\s*srcset="[^"]*assets/img[^"]*"', "", t)
        t = re.sub(r'(src|href|content)="assets/img/[^"]*"', r'\1=""', t)
        return t

    bodies = {}
    for p in PAGES:
        if os.path.exists(os.path.join(ROOT, p)):
            bodies[p] = sanitize(rewrite_links(body_of(p)))

    # ---- scripts, with media.js repointed at the inlined images ----
    media = open(os.path.join(ROOT, "assets/js/media.js"), encoding="utf-8").read()

    def swap(m):
        stem = os.path.basename(re.sub(r"-\d+\.webp$", "", m.group(0).strip('"')))
        rel = chosen.get(stem)
        return '"' + uris[rel] + '"' if rel in uris else m.group(0)

    media = re.sub(r'"assets/img/[a-z]+/[^"]+\.webp"', swap, media)
    media = re.sub(r'"srcset":\s*"[^"]*"', '"srcset": ""', media)

    parts = []
    for name in ("data.js", "seo.js", "app.js"):
        p = os.path.join(ROOT, "assets/js", name)
        if os.path.exists(p):
            parts.append(media if name == "media.js" else open(p, encoding="utf-8").read())
    parts.insert(2, media)          # media.js must precede app.js

    bundle = ("const SINGLE_FILE = true;\nconst PAGE_BODIES = %s;\n"
              % json.dumps(bodies)) + "\n;\n".join(parts)

    css = open(os.path.join(ROOT, "assets/css/style.css"), encoding="utf-8").read()
    shell = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()

    # strip the shell down to chrome only — the router fills #scroll
    shell = re.sub(r'<link rel="stylesheet" href="assets/css/style\.css">',
                   "<style>\n%s\n</style>" % css, shell)
    shell = re.sub(r'\s*<script src="assets/js/[^"]+"></script>', "", shell)
    shell = re.sub(r'<div id="scroll">.*?\n</div>\s*(?=</body>|<script)',
                   '<div id="scroll"></div>\n', shell, flags=re.S)
    shell = re.sub(r'<div id="loader">.*?</div>\s*</div>\s*</div>', "", shell, flags=re.S)
    shell = shell.replace("</body>", "<script>\n%s\n</script>\n</body>" % bundle)

    for rel, uri in uris.items():
        shell = shell.replace(rel, uri)
    shell = re.sub(r'srcset="[^"]*assets/img[^"]*"\s*', "", shell)
    shell = re.sub(r'(src|href|content)="assets/img/[^"]*"', r'\1=""', shell)
    shell = re.sub(r'<link rel="canonical"[^>]*>', "", shell)

    out = os.path.join(ROOT, OUT)
    open(out, "w", encoding="utf-8").write(shell)
    mb = os.path.getsize(out) / 1024 / 1024
    left = len(re.findall(r'assets/(img|js|css)/', shell))
    print("  %s" % OUT)
    print("  %.1f MB · %d pages · %d images inlined · %d external refs left"
          % (mb, len(bodies), len(uris), left))
    return out


if __name__ == "__main__":
    build()
