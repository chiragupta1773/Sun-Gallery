/* =========================================================
   SUN GALLERY — motion engine + renderers
   ---------------------------------------------------------
   No dependencies. One rAF loop drives every scroll effect,
   and all element positions are cached so nothing reads
   layout during animation (no thrash, no jank).
   ========================================================= */
(function () {
  "use strict";

  var doc = document, win = window, root = doc.documentElement, body = doc.body;
  var REDUCED = win.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var TOUCH = win.matchMedia("(hover: none), (pointer: coarse)").matches;
  var SMOOTH = !REDUCED && !TOUCH;

  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

  /* =======================================================
     1. SHARED CHROME — header, menu, footer injected once
     ======================================================= */
  var PAGES = [
    { href: "index.html",        label: "Home",         n: "01" },
    { href: "collection.html",   label: "Collection",   n: "02" },
    { href: "applications.html", label: "Applications", n: "03" },
    { href: "finishes.html",     label: "Finishes",     n: "04" },
    { href: "wholesale.html",    label: "Wholesale",    n: "05" },
    { href: "contact.html",      label: "Enquire",      n: "06" }
  ];

  /* Keyword landing pages — linked from the footer and the menu */
  var RANGES = [
    { href: "interior.html",  label: "Interior Stone" },
    { href: "exterior.html",  label: "Exterior Stone" },
    { href: "elevation.html", label: "Elevation Cladding" },
    { href: "roofing.html",   label: "Slate Roof Tiles" },
    { href: "pool.html",      label: "Pool Coping" },
    { href: "wholesale.html", label: "Buy in Bulk" }
  ];

  /* True when running as the bundled single-file build. */
  var SINGLE = typeof SINGLE_FILE !== "undefined" && SINGLE_FILE;

  /* Contact details and socials are only rendered when they exist, so the
     site never shows a dead link or a placeholder phone number. */
  function liveSocials() {
    return (SITE.social || []).filter(function (x) {
      return x.href && x.href !== "#" && !/^#$/.test(x.href);
    });
  }

  function here() {
    if (SINGLE) {
      var h = location.hash.replace(/^#\/?/, "").split("?")[0];
      return (h || "index") + ".html";
    }
    var p = location.pathname.split("/").pop();
    return p === "" ? "index.html" : p;
  }

  /* Every link the JavaScript generates goes through here.
     Multi-page build: "collection.html?app=pool" — a real file.
     One-file build:   "#/collection?app=pool"   — a hash route.
     Without this, a bundled site has no working navigation at all. */
  function L(path) {
    if (!SINGLE) return path;
    if (!path || /^(#|https?:|mailto:|tel:)/.test(path)) return path;
    var m = /^([a-z0-9\-]+)\.html(\?.*)?$/i.exec(path);
    if (!m) return path;
    return m[1] === "index" ? "#/" + (m[2] || "") : "#/" + m[1] + (m[2] || "");
  }

  /* In the bundle, "collection.html?app=pool" lives in the hash instead. */
  function query() {
    if (SINGLE) {
      var i = location.hash.indexOf("?");
      return new URLSearchParams(i > -1 ? location.hash.slice(i) : "");
    }
    return new URLSearchParams(location.search);
  }

  var LOGO =
    '<a class="logo" href="' + L("index.html") + '" aria-label="Sun Gallery home">' +
      '<span class="mark"><img src="assets/img/brand/logo.png" alt="" width="34" height="34"></span>' +
      '<span class="wm"><b>Sun</b> <i>Gallery</i></span>' +
    '</a>';

  function buildChrome() {
    var cur = here();

    var head = doc.createElement("header");
    head.className = "site-head";
    head.innerHTML =
      LOGO +
      '<div class="head-right">' +
        '<nav class="nav-links">' +
          PAGES.slice(1, 5).map(function (p) {
            return '<a href="' + L(p.href) + '"' + (p.href === cur ? ' aria-current="page"' : "") + '>' + p.label + "</a>";
          }).join("") +
        "</nav>" +
        '<a class="btn sun" href="' + L("contact.html") + '" style="padding:10px 20px">Enquire <span class="ar">↗</span></a>' +
        '<button class="burger" id="burger" aria-label="Open menu"><i></i><i></i></button>' +
      "</div>";

    var menu = doc.createElement("div");
    menu.id = "menu";
    menu.innerHTML =
      '<button class="m-close" id="mClose">Close</button>' +
      '<ul class="m-list" style="align-self:center">' +
        PAGES.map(function (p) {
          return '<li><a href="' + L(p.href) + '"><span class="n">' + p.n + '</span><span class="t">' + p.label + "</span></a></li>";
        }).join("") +
      "</ul>" +
      '<div class="m-ranges">' + RANGES.map(function (r) {
        return '<a href="' + L(r.href) + '">' + r.label + "</a>";
      }).join("") + "</div>" +
      '<div class="m-foot"><span>' + SITE.email + "</span>" +
        (SITE.phone ? "<span>" + SITE.phone + "</span>" : "") +
        liveSocials().map(function (s) { return '<a href="' + s.href + '">' + s.label + "</a>"; }).join("") +
      "</div>";

    body.insertBefore(menu, body.firstChild);
    body.insertBefore(head, body.firstChild);

    // keyboard users should be able to jump past the nav
    var skip = doc.createElement("a");
    skip.className = "skip-link";
    skip.href = "#scroll";
    skip.textContent = "Skip to content";
    body.insertBefore(skip, body.firstChild);

    $$(".m-list a", menu).forEach(function (a, i) {
      a.style.transitionDelay = (0.055 * i + 0.14) + "s";
    });

    $("#burger").addEventListener("click", function () { menu.classList.add("open"); body.classList.add("lock"); });
    $("#mClose").addEventListener("click", closeMenu);
    $$(".m-list a", menu).forEach(function (a) { a.addEventListener("click", closeMenu); });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
    function closeMenu() { menu.classList.remove("open"); body.classList.remove("lock"); }
  }

  function buildFooter() {
    var host = $("#footer-slot");
    if (!host) return;
    host.id = "";
    host.outerHTML =
      '<footer class="site-foot">' +
        '<div class="foot-mark">Sun Gallery</div>' +
        '<div class="foot-top">' +
          '<div><h2>Sun Gallery</h2><p class="body-txt" style="max-width:32ch;font-size:14px">' + SITE.tagline +
            ' Quarried, calibrated and finished in Rajasthan since ' + SITE.founded + '.</p></div>' +
          '<div><h2><a href="' + L("index.html") + '">Explore</a></h2><ul>' +
            PAGES.slice(1).map(function (p) { return '<li><a href="' + L(p.href) + '">' + p.label + "</a></li>"; }).join("") +
          "</ul></div>" +
          '<div><h2><a href="' + L("applications.html") + '">Ranges</a></h2><ul>' +
            RANGES.map(function (r) { return '<li><a href="' + L(r.href) + '">' + r.label + "</a></li>"; }).join("") +
          "</ul></div>" +
          '<div><h2><a href="' + L("collection.html") + '">Collection</a></h2><ul>' +
            STONES.slice(0, 5).map(function (s) {
              return '<li><a href="' + L("stone.html?s=" + s.slug) + '">' + s.name + "</a></li>";
            }).join("") +
            '<li><a href="' + L("collection.html") + '">All stones →</a></li>' +
          "</ul></div>" +
          '<div><h2><a href="' + L("contact.html") + '">Contact</a></h2><ul>' +
            '<li><a href="mailto:' + SITE.email + '">' + SITE.email + "</a></li>" +
            (SITE.phone ? '<li><a href="tel:' + SITE.phone.replace(/\s/g, "") + '">' + SITE.phone + "</a></li>" : "") +
            "<li style='margin-top:14px;color:var(--muted)'>" + SITE.address.join("<br>") + "</li>" +
          "</ul></div>" +
        "</div>" +
        '<div class="foot-bot">' +
          "<span>© " + new Date().getFullYear() + " " + SITE.name + ". All rights reserved.</span>" +
          "<span>" + liveSocials().map(function (s) { return '<a href="' + s.href + '" style="margin-left:18px">' + s.label + "</a>"; }).join("") + "</span>" +
          "<span>Rajasthan — 27.7°N</span>" +
        "</div>" +
      "</footer>";
  }

  /* =======================================================
     2. IMAGE HELPERS — blur-up placeholder + lazy loading
     ======================================================= */
  var HAS_MEDIA = typeof MEDIA !== "undefined";

  function media(key) { return HAS_MEDIA && MEDIA[key] ? MEDIA[key] : null; }

  /* An image entry is either "key" or {key:"...", caption:"..."} */
  function imgKey(entry) { return entry && entry.key ? entry.key : entry; }
  function imgCap(entry) { return entry && entry.caption ? entry.caption : ""; }
  function shot(stone, i) { return imgKey(stone.images[i] || stone.images[0]); }

  /* Aspect ratio of a media key — lets layouts size themselves to the photo. */
  function ratio(key, fallback) {
    var m = media(key);
    return m && m.ar ? m.ar : (fallback || 1.25);
  }

  /* Builds a responsive, lazy, blur-up image.
     `key` is a media.js key, or any literal path if you skipped the optimiser. */
  function figure(key, alt, colour, eager, sizes) {
    var m = media(key);
    var src = m ? m.src : key;
    var set = m ? ' srcset="' + m.srcset + '" sizes="' + (sizes || DEFAULT_SIZES) + '"' : "";
    var plate = m ? m.colour : (colour || "#16161A");
    var blur = m ? "background-image:url(" + m.lqip + ");" : "";
    return (
      '<div class="frame" style="' + blur + "background-color:" + plate + '">' +
        '<img src="' + src + '"' + set + ' alt="' + (alt || "").replace(/"/g, "&quot;") + '"' +
        ' loading="' + (eager ? "eager" : "lazy") + '" decoding="async"' +
        (eager ? ' fetchpriority="high"' : "") + ">" +
      "</div>"
    );
  }

  var DEFAULT_SIZES = "(max-width:620px) 92vw, (max-width:1020px) 46vw, 31vw";

  function wireImages(scope) {
    $$(".frame img", scope || doc).forEach(function (img) {
      if (img.dataset.wired) return;
      img.dataset.wired = "1";
      var done = function () {
        img.classList.add("loaded");
        if (img.parentNode) img.parentNode.classList.add("ready");
      };
      if (img.complete && img.naturalWidth) { done(); return; }
      img.addEventListener("load", done);
      img.addEventListener("error", function () {
        done();
        img.style.opacity = "0";            // fall back to the blur plate
        if (img.parentNode) img.parentNode.classList.remove("ready");
      });
    });
  }

  /* =======================================================
     3. PRELOADER
     ======================================================= */
  function preload() {
    var el = $("#loader");
    if (!el) { body.classList.add("ready"); return; }
    var num = $("#lnum"), bar = $("#lbar"), n = 0;
    body.classList.add("lock");
    var t = setInterval(function () {
      n = Math.min(100, n + Math.ceil(Math.random() * 11));
      num.textContent = n < 10 ? "0" + n : n;
      bar.style.width = n + "%";
      if (n >= 100) {
        clearInterval(t);
        setTimeout(function () {
          el.classList.add("done");
          body.classList.remove("lock");
          body.classList.add("ready");
          measure();
        }, 380);
      }
    }, 85);
  }

  /* =======================================================
     4. SCROLL ENGINE
     ======================================================= */
  var scroller = null, spacer = null;
  var target = 0, current = 0, vh = win.innerHeight, last = 0, velocity = 0;
  var fx = [];   // cached effect descriptors

  function collect() {
    fx = [];

    // -- parallax layers: [data-speed]
    $$("[data-speed]").forEach(function (el) {
      fx.push({ el: el, type: "par", speed: parseFloat(el.dataset.speed) || 0.1 });
    });

    // -- descent columns: stone flowing downward
    $$(".descent").forEach(function (sec) {
      $$(".col", sec).forEach(function (col, i) {
        fx.push({ el: col, host: sec, type: "flow", amp: 90 + i * 78, drift: (i % 2 ? -1 : 1) * 14 });
      });
    });

    // -- pinned horizontal tracks
    $$(".pin-outer").forEach(function (outer) {
      var inner = $(".pin-inner", outer), track = $(".pin-track", outer), bar = $(".pin-progress i", outer);
      if (!inner || !track) return;
      fx.push({ el: inner, host: outer, track: track, bar: bar, type: "pin" });
    });

    // -- reveal targets
    $$(".rv, .rv-mask, .rv-clip").forEach(function (el) {
      fx.push({ el: el, type: "reveal", done: false });
    });

    measure();
  }

  function measure() {
    vh = win.innerHeight;
    var base = SMOOTH ? current : 0;   // rects are visual; convert back to document space
    fx.forEach(function (f) {
      var node = f.host || f.el;
      var r = node.getBoundingClientRect();
      f.top = r.top + (SMOOTH ? current : win.scrollY);
      f.h = r.height;
      if (f.type === "pin") {
        var dist = Math.max(0, f.track.scrollWidth - win.innerWidth + 2 * parseFloat(getComputedStyle(root).getPropertyValue("--pad") || 40));
        f.dist = dist;
        if (win.innerWidth > 900) {
          f.host.style.height = (vh + dist) + "px";
          f.h = vh + dist;
        } else {
          f.host.style.height = "";
        }
      }
    });
    if (SMOOTH && spacer && scroller) {
      spacer.style.height = scroller.scrollHeight + "px";
    }
    void base;
  }

  function apply(f) {
    var p; // 0..1 progress of element through viewport

    if (f.type === "reveal") {
      if (f.done) return;
      if (current + vh * 0.88 > f.top) { f.el.classList.add("in"); f.done = true; }
      return;
    }

    p = (current + vh - f.top) / (vh + f.h);

    if (f.type === "par") {
      if (p < -0.35 || p > 1.35) return;
      f.el.style.transform = "translate3d(0," + ((p - 0.5) * f.speed * 220).toFixed(2) + "px,0)";
      return;
    }

    if (f.type === "flow") {
      if (p < -0.4 || p > 1.4) return;
      // stones descend: they lag the page, drifting downward as you scroll
      var y = p * f.amp + velocity * f.drift * 0.5;
      f.el.style.transform = "translate3d(0," + y.toFixed(2) + "px,0)";
      return;
    }

    if (f.type === "pin") {
      if (win.innerWidth <= 900) { f.el.style.transform = ""; f.track.style.transform = ""; return; }
      var offset = current - f.top;
      var pinned = clamp(offset, 0, f.dist);
      f.el.style.transform = "translate3d(0," + pinned.toFixed(2) + "px,0)";
      f.track.style.transform = "translate3d(" + (-pinned).toFixed(2) + "px,0,0)";
      if (f.bar) f.bar.style.width = (f.dist ? (pinned / f.dist) * 100 : 0) + "%";
      return;
    }
  }

  var progBar, head, lastY = 0;

  function frame() {
    target = win.scrollY || win.pageYOffset;

    if (SMOOTH) {
      current = lerp(current, target, 0.098);
      if (Math.abs(target - current) < 0.06) current = target;
      scroller.style.transform = "translate3d(0," + (-current).toFixed(2) + "px,0)";
    } else {
      current = target;
    }

    velocity = clamp(current - last, -60, 60);
    last = current;

    for (var i = 0; i < fx.length; i++) apply(fx[i]);

    // progress bar
    var max = (SMOOTH ? scroller.scrollHeight : doc.documentElement.scrollHeight) - vh;
    if (progBar) progBar.style.width = (max > 0 ? clamp(current / max, 0, 1) * 100 : 0) + "%";

    // header: hide on scroll down, solid once past the fold
    if (head) {
      head.classList.toggle("solid", current > vh * 0.6);
      if (current > vh * 0.9 && current > lastY + 4) head.classList.add("hidden");
      else if (current < lastY - 4) head.classList.remove("hidden");
      lastY = current;
    }

    requestAnimationFrame(frame);
  }

  /* =======================================================
     5. MARQUEE (independent, constant-speed)
     ======================================================= */
  function marquees() {
    $$(".marquee .track").forEach(function (track) {
      track.innerHTML += track.innerHTML;
      var x = 0, w = track.scrollWidth / 2, dir = track.dataset.dir === "rtl" ? 1 : -1;
      var sp = parseFloat(track.dataset.speed) || 0.42;
      (function tick() {
        x += dir * sp;
        if (dir < 0 && -x >= w) x = 0;
        if (dir > 0 && x >= 0) x = -w;
        track.style.transform = "translate3d(" + x.toFixed(2) + "px,0,0)";
        requestAnimationFrame(tick);
      })();
    });
  }

  /* =======================================================
     6. CURSOR
     ======================================================= */
  function cursor() {
    if (TOUCH || REDUCED) return;
    var c = doc.createElement("div");
    c.id = "cursor";
    body.appendChild(c);
    var tx = 0, ty = 0, cx = 0, cy = 0;
    doc.addEventListener("mousemove", function (e) { tx = e.clientX; ty = e.clientY; c.style.opacity = 1; });
    doc.addEventListener("mouseleave", function () { c.style.opacity = 0; });
    (function tick() {
      cx = lerp(cx, tx, 0.19); cy = lerp(cy, ty, 0.19);
      c.style.transform = "translate3d(" + cx + "px," + cy + "px,0) translate(-50%,-50%)";
      requestAnimationFrame(tick);
    })();
    doc.addEventListener("mouseover", function (e) {
      var t = e.target.closest("a,button,.chip,input,textarea,select");
      if (!t) return;
      c.classList.add("hover");
      c.classList.toggle("view", !!e.target.closest(".card,.pslide,.gitem"));
    });
    doc.addEventListener("mouseout", function (e) {
      if (!e.target.closest("a,button,.chip,input,textarea,select")) return;
      c.classList.remove("hover", "view");
    });
  }

  /* =======================================================
     7. PAGE TRANSITIONS
     ======================================================= */
  function transitions() {
    var curtain = doc.createElement("div");
    curtain.id = "curtain";
    body.appendChild(curtain);
    if (REDUCED) return;
    doc.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a) return;
      var href = a.getAttribute("href") || "";
      if (!href || href.charAt(0) === "#" || a.target === "_blank" ||
          /^(mailto|tel|https?):/.test(href) || e.metaKey || e.ctrlKey) return;
      if (SINGLE) return;   // the router handles navigation in the bundle
      e.preventDefault();
      curtain.classList.add("on");
      setTimeout(function () { location.href = href; }, 480);
    });
    win.addEventListener("pageshow", function () { curtain.classList.remove("on"); });
  }

  /* =======================================================
     8. RENDERERS
     ======================================================= */
  var R = {};

  R.stoneCard = function (s, i, eager) {
    return (
      '<a class="card rv" data-d="' + ((i % 3) + 1) + '" data-colour="' + s.colour +
        '" data-finishes="' + s.finishes.join(" ") + '" data-apps="' + s.applications.join(" ") +
        '" href="' + L("stone.html?s=" + s.slug) + '">' +
        '<div class="swatches">' + s.palette.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join("") + "</div>" +
        figure(shot(s, 0), s.name + " Indian slate — " + s.sub, s.palette[0], eager) +
        '<div class="tint"></div>' +
        '<div class="cap"><div><h2>' + s.name + "</h2><span class='sub'>" + s.sub + "</span></div>" +
        '<span class="go">↗</span></div>' +
      "</a>"
    );
  };

  R.grid = function (host, list, editorial) {
    if (!host) return;
    host.className = "stone-grid" + (editorial ? " editorial" : "");
    host.innerHTML = list.map(function (s, i) { return R.stoneCard(s, i, i < 3); }).join("");
    wireImages(host);
  };

  /* Layered home hero — background plate + three floating stone cards
     that drift at different rates. All driven from HERO_IMAGES. */
  R.hero = function (host) {
    if (!host) return;
    var bg = HERO_IMAGES[0], a = HERO_IMAGES[1] || HERO_IMAGES[0], b = HERO_IMAGES[2] || HERO_IMAGES[0];
    var c = shot(STONES[0], 0);
    host.innerHTML =
      '<div class="layer l-bg" data-speed="0.55">' +
        figure(bg, "Indian slate wall", null, true, "100vw") + "</div>" +
      '<div class="layer l-a" data-speed="1.5">' + figure(a, "", null, true, "300px") + "</div>" +
      '<div class="layer l-b" data-speed="2.3">' + figure(b, "", null, true, "230px") + "</div>" +
      '<div class="layer l-c" data-speed="1.1">' + figure(c, "", null, true, "190px") + "</div>";
    wireImages(host);
  };

  R.descent = function (host) {
    if (!host) return;
    var COLS = win.innerWidth < 900 ? 3 : 5, html = "";
    for (var c = 0; c < COLS; c++) {
      var tiles = "";
      for (var t = 0; t < 5; t++) {
        var k = DESCENT_IMAGES[(c * 3 + t) % DESCENT_IMAGES.length];
        var m = media(k);
        tiles += '<div class="tile" style="background:' + (m ? m.colour : "#16161A") + '">' +
          '<img src="' + (m ? m.src : k) + '"' +
          (m ? ' srcset="' + m.srcset + '" sizes="(max-width:900px) 33vw, 20vw"' : "") +
          ' alt="" loading="lazy" decoding="async" aria-hidden="true"></div>';
      }
      html += '<div class="col">' + tiles + "</div>";
    }
    host.innerHTML = html;
  };

  R.pinTrack = function (host, list) {
    if (!host) return;
    host.innerHTML = list.map(function (s) {
      return '<a class="pslide" href="' + L("stone.html?s=" + s.slug) + '">' +
        figure(shot(s, 1), s.name, s.palette[0], false, "(max-width:900px) 72vw, 26vw") +
        "<h3>" + s.name + "</h3><span class='sub'>" + COLOUR_FAMILIES[s.colour] + "</span></a>";
    }).join("");
    wireImages(host);
  };

  R.finishes = function (host) {
    if (!host) return;
    // use the finish's own photograph when it has one, else borrow a stone
    // shot from a stone actually offered in that finish
    host.innerHTML = FINISHES.map(function (f, i) {
      var s = STONES.filter(function (x) { return x.finishes.indexOf(f.id) > -1; })[0] || STONES[0];
      var img = f.image || shot(s, i % 3);
      return '<a class="card rv" data-d="' + ((i % 3) + 1) + '" href="' + L("collection.html?finish=" + f.id) + '">' +
        figure(img, f.name + " finish — Indian slate", s.palette[0]) +
        '<div class="tint"></div>' +
        '<div class="cap"><div><h2>' + f.name + "</h2><span class='sub'>" + f.note + "</span></div>" +
        '<span class="go">↗</span></div></a>';
    }).join("");
    wireImages(host);
  };

  R.applications = function (host) {
    if (!host) return;
    host.innerHTML = APPLICATIONS.map(function (a, i) {
      return '<a class="app-row rv" href="' + L("collection.html?app=" + a.id) + '">' +
        '<span class="n">0' + (i + 1) + "</span>" +
        "<div><h2>" + a.name + "</h2><p>" + a.note + "</p></div>" +
        '<span class="btn" style="pointer-events:none">View stones <span class="ar">↗</span></span>' +
        '<span class="peek">' + figure(a.image, a.name, "#16161A", false, "(max-width:900px) 92vw, 240px") + "</span>" +
      "</a>";
    }).join("");
    wireImages(host);
  };

  R.formats = function (host) {
    if (!host) return;
    host.innerHTML = FORMATS.map(function (f, i) {
      return '<div class="app-row rv" data-d="' + ((i % 3) + 1) + '">' +
        '<span class="n">0' + (i + 1) + "</span>" +
        "<div><h2>" + f.name + "</h2><p>" + f.note + "</p></div>" +
        '<div style="text-align:right">' + f.sizes.map(function (s) {
          return '<span class="chip" style="margin:0 0 6px 6px;display:inline-block">' + s + (f.unit ? " " + f.unit : "") + "</span>";
        }).join("") + "</div></div>";
    }).join("");
  };

  /* -- 8-up feature grid -------------------------------------------- */
  R.features = function (host) {
    if (!host) return;
    host.innerHTML = FEATURES.map(function (f, i) {
      return '<div class="feat rv" data-d="' + ((i % 4) + 1) + '">' +
        '<span class="n">' + (i < 9 ? "0" : "") + (i + 1) + "</span>" +
        "<h3>" + f.name + "</h3><p>" + f.note + "</p></div>";
    }).join("");
  };

  /* -- simple chip lists: thickness, edges, export -------------------- */
  R.chipList = function (host, items) {
    if (!host) return;
    host.innerHTML = items.map(function (t, i) {
      return '<span class="spec-chip rv" data-d="' + ((i % 6) + 1) + '">' + t + "</span>";
    }).join("");
  };

  /* -- packing gallery: proof that crates leave properly built -- */
  R.packing = function (host) {
    if (!host || typeof PACKING === "undefined") return;
    host.innerHTML = PACKING.map(function (p, i) {
      return '<figure class="pack rv" data-d="' + ((i % 3) + 1) + '">' +
        figure(p.key, p.title + " — Sun Gallery slate export packing", null, false,
               "(max-width:900px) 92vw, 31vw") +
        "<figcaption><h3>" + p.title + "</h3><p>" + p.note + "</p></figcaption>" +
      "</figure>";
    }).join("");
    wireImages(host);
  };

  /* =======================================================
     SEO — landing pages, breadcrumbs, structured data
     ======================================================= */

  var HAS_SEO = typeof LANDING !== "undefined";

  /* Absolute URL for canonicals, Open Graph and structured data.
     If ORIGIN is still the placeholder, fall back to wherever the page is
     actually served from — so the file works on GitHub Pages untouched. */
  function abs(path) {
    var o = (typeof ORIGIN !== "undefined" ? ORIGIN : "").replace(/\/$/, "");
    if (!o || /REPLACE-WITH/i.test(o)) {
      o = location.origin + location.pathname.replace(/[^\/]*$/, "").replace(/\/$/, "");
    }
    path = String(path);
    // already absolute (or an inlined data URI in the bundle) — leave it alone
    if (/^(https?:|data:)/i.test(path)) return path;
    path = path.replace(/^\//, "");
    // In the bundle only *pages* become hash routes — assets keep real paths.
    if (SINGLE && /\.html(\?|$)/.test(path)) {
      return o + "/" + (path.indexOf("index.html") === 0 ? "" : "#/" + path.replace(".html", ""));
    }
    return o + "/" + path;
  }

  function jsonld(obj) {
    var el = doc.createElement("script");
    el.type = "application/ld+json";
    el.textContent = JSON.stringify(obj);
    doc.head.appendChild(el);
  }

  /* Organization + WebSite — emitted on every page */
  function orgSchema() {
    if (typeof ORG === "undefined") return;
    jsonld({
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": abs("#organization"),
      name: SITE.name,
      legalName: ORG.legalName,
      description: ORG.description,
      url: abs(""),
      logo: abs("assets/img/brand/logo.png"),
      email: SITE.email,
      telephone: SITE.phone || undefined,
      foundingDate: String(SITE.founded),
      address: {
        "@type": "PostalAddress",
        addressLocality: ORG.city,
        addressRegion: ORG.region,
        addressCountry: ORG.country
      },
      areaServed: ORG.markets.map(function (m) { return { "@type": "Country", name: m }; }),
      knowsAbout: ORG.productRange,
      sameAs: SITE.social.map(function (s) { return s.href; }).filter(function (h) { return h && h !== "#"; })
    });
    jsonld({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE.name,
      url: abs(""),
      publisher: { "@id": abs("#organization") }
    });
  }

  function breadcrumbSchema(trail) {
    jsonld({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: trail.map(function (t, i) {
        return { "@type": "ListItem", position: i + 1, name: t.name, item: abs(t.href) };
      })
    });
  }

  function faqSchema(faq) {
    if (!faq || !faq.length) return;
    jsonld({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map(function (f) {
        return {
          "@type": "Question", name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a }
        };
      })
    });
  }

  /* Visible FAQ block — the markup Google reads and users actually use */
  R.faq = function (host, faq) {
    if (!host || !faq || !faq.length) return;
    host.innerHTML = faq.map(function (f, i) {
      return '<details class="faq rv" data-d="' + ((i % 4) + 1) + '"' + (i === 0 ? " open" : "") + ">" +
        "<summary><span>" + f.q + '</span><i aria-hidden="true"></i></summary>' +
        "<div class='faq-a'><p>" + f.a + "</p></div></details>";
    }).join("");
    faqSchema(faq);
  };

  /* -- keyword landing pages (interior / exterior / elevation / …) -- */
  R.landing = function () {
    var host = $("#landing");
    if (!host || !HAS_SEO) return;
    var cfg = LANDING[host.dataset.landing];
    if (!cfg) return;

    var stones = cfg.stones.map(function (sl) {
      return STONES.filter(function (x) { return x.slug === sl; })[0];
    }).filter(Boolean);

    var apps = (cfg.apps || []).map(function (id) {
      return APPLICATIONS.filter(function (a) { return a.id === id; })[0];
    }).filter(Boolean);

    var lead = stones[0] ? shot(stones[0], 0) : HERO_IMAGES[0];
    var n = 0, num = function () { return "0" + (++n); };

    host.innerHTML =
      /* hero */
      '<div class="hero" style="height:78svh;min-height:480px">' +
        '<div class="layers"><div class="layer l-bg" data-speed="0.5">' +
          figure(lead, cfg.eyebrow + " — Indian slate", null, true, "100vw") + "</div></div>" +
        '<div class="veil"></div>' +
        '<div class="hero-in">' +
          '<p class="crumb rv"><a href="' + L("index.html") + '">Sun Gallery</a> — ' + cfg.eyebrow + "</p>" +
          '<h1 class="display d-lg mt-s">' +
            '<span class="rv-mask"><span>' + cfg.h1[0] + "</span></span>" +
            '<span class="rv-mask"><span>' + cfg.h1[1] + "</span></span>" +
          "</h1>" +
          '<div class="hero-meta"><p class="rv">' + cfg.intro + "</p>" +
            '<a class="btn sun rv" data-d="1" href="' + L("contact.html") + '">Request a quote <span class="ar">↗</span></a>' +
          "</div>" +
        "</div></div>" +

      /* what we supply */
      '<section>' +
        '<div class="sec-head rv"><span class="num">' + num() + '</span><span class="eyebrow">What we supply</span><span class="rule"></span></div>' +
        '<div class="app-list">' + cfg.blocks.map(function (b, i) {
          return '<div class="app-row rv" data-d="' + ((i % 3) + 1) + '"><span class="n">0' + (i + 1) + "</span>" +
            "<div><h2 class='lh-h3'>" + b.h + "</h2><p>" + b.p + "</p></div>" +
            '<span class="chip" style="pointer-events:none">Cut to order</span></div>';
        }).join("") + "</div>" +
      "</section>" +

      /* recommended stones */
      '<section style="padding-top:0">' +
        '<div class="sec-head rv"><span class="num">' + num() + '</span><span class="eyebrow">Recommended stones</span><span class="rule"></span>' +
          '<a class="link-u" href="' + L("collection.html") + '" style="font-size:11px;letter-spacing:.2em;text-transform:uppercase">All stones</a></div>' +
        '<div class="stone-grid editorial">' + stones.map(function (s, i) { return R.stoneCard(s, i); }).join("") + "</div>" +
      "</section>" +

      /* related applications */
      (apps.length
        ? '<section style="padding-top:0">' +
            '<div class="sec-head rv"><span class="num">' + num() + '</span><span class="eyebrow">Related applications</span><span class="rule"></span></div>' +
            '<div class="app-list">' + apps.map(function (a, i) {
              return '<a class="app-row rv" href="' + L("collection.html?app=" + a.id) + '"><span class="n">0' + (i + 1) + "</span>" +
                "<div><h2>" + a.name + "</h2><p>" + a.note + "</p></div>" +
                '<span class="btn" style="pointer-events:none">View stones <span class="ar">↗</span></span>' +
                '<span class="peek">' + figure(a.image, a.name, null, false, "(max-width:900px) 92vw, 240px") + "</span></a>";
            }).join("") + "</div>" +
          "</section>"
        : "") +

      /* specification strip */
      '<section style="padding-top:0">' +
        '<div class="sec-head rv"><span class="num">' + num() + '</span><span class="eyebrow">Specification</span><span class="rule"></span></div>' +
        '<div class="spec-block"><div class="rv"><h3 class="display">Thickness</h3></div>' +
          '<div class="spec-chips">' + THICKNESS.map(function (t) { return '<span class="spec-chip">' + t + "</span>"; }).join("") + "</div></div>" +
        '<div class="spec-block"><div class="rv"><h3 class="display">Edges</h3></div>' +
          '<div class="spec-chips">' + EDGES.map(function (t) { return '<span class="spec-chip">' + t + "</span>"; }).join("") + "</div></div>" +
        '<div class="spec-block"><div class="rv"><h3 class="display">Export</h3></div>' +
          '<div class="spec-chips">' + EXPORT_DETAILS.map(function (t) { return '<span class="spec-chip">' + t + "</span>"; }).join("") + "</div></div>" +
      "</section>" +

      /* packing — shown on the wholesale page, where it decides the order */
      (host.dataset.landing === "wholesale"
        ? '<section style="padding-top:0">' +
            '<div class="sec-head rv"><span class="num">' + num() + '</span><span class="eyebrow">Packaging</span><span class="rule"></span></div>' +
            '<div class="sec-lead" style="margin-bottom:clamp(26px,4vh,48px)">' +
              '<h2 class="display d-md rv">Packed to arrive<br><em>as it left.</em></h2>' +
              '<p class="lede rv" data-d="1">Foam-sleeved, crated on fumigated timber, strapped and staged so a 20 ft or 40 ft container loads square with no wasted volume.</p>' +
            "</div>" +
            '<div class="pack-grid" id="packingGrid"></div>' +
          "</section>"
        : "") +

      /* FAQ */
      '<section style="padding-top:0">' +
        '<div class="sec-head rv"><span class="num">' + num() + '</span><span class="eyebrow">Common questions</span><span class="rule"></span></div>' +
        '<div class="faq-list" id="faqList"></div>' +
      "</section>" +

      /* CTA */
      '<section class="cta-band">' +
        '<div class="veil" style="background:linear-gradient(180deg,rgba(11,11,12,.45),rgba(11,11,12,.92))"></div>' +
        '<div class="inner">' +
          '<span class="eyebrow rv">Quarry direct, shipped worldwide</span>' +
          '<h2 class="display d-lg rv mt-s" data-d="1">Send us the<br><em>specification.</em></h2>' +
          '<a class="btn sun mt-m rv" data-d="2" href="' + L("contact.html") + '">Request a quote <span class="ar">↗</span></a>' +
        "</div>" +
      "</section>";

    wireImages(host);
    R.packing($("#packingGrid"));
    R.faq($("#faqList"), cfg.faq);
    breadcrumbSchema([
      { name: "Home", href: "index.html" },
      { name: cfg.eyebrow, href: cfg.slug }
    ]);
  };

  /* Product schema for a stone detail page */
  function productSchema(s) {
    var fin = FINISHES.filter(function (f) { return s.finishes.indexOf(f.id) > -1; });
    jsonld({
      "@context": "https://schema.org",
      "@type": "Product",
      name: s.name + " Indian Slate",
      description: s.story,
      sku: s.slug,
      brand: { "@type": "Brand", name: SITE.name },
      category: "Natural Slate Stone",
      material: "Slate",
      color: COLOUR_FAMILIES[s.colour],
      countryOfOrigin: "India",
      image: s.images.map(function (e) {
        var m = media(imgKey(e));
        return m ? abs(m.src) : "";
      }).filter(Boolean),
      additionalProperty: [
        { "@type": "PropertyValue", name: "Finishes",  value: fin.map(function (f) { return f.name; }).join(", ") },
        { "@type": "PropertyValue", name: "Thickness", value: THICKNESS.join(", ") },
        { "@type": "PropertyValue", name: "Edges",     value: EDGES.join(", ") },
        { "@type": "PropertyValue", name: "Origin",    value: s.origin }
      ],
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        seller: { "@id": abs("#organization") },
        url: abs("stone.html?s=" + s.slug)
      }
    });
    breadcrumbSchema([
      { name: "Home", href: "index.html" },
      { name: "Collection", href: "collection.html" },
      { name: s.name, href: "stone.html?s=" + s.slug }
    ]);
  }

  /* Canonical + per-stone title, applied once the page knows what it is */
  function canonical(href) {
    var l = $('link[rel="canonical"]') || doc.createElement("link");
    l.rel = "canonical"; l.href = abs(href);
    if (!l.parentNode) doc.head.appendChild(l);
  }

  /* -- filters (collection page) -- */
  R.filters = function () {
    var bar = $("#filters"), grid = $("#grid"), count = $("#count");
    if (!bar || !grid) return;

    var params = query();
    var state = {
      colour: params.get("colour") || "all",
      finish: params.get("finish") || "all",
      app: params.get("app") || "all"
    };

    function group(label, key, items) {
      return '<div class="fgroup"><span>' + label + "</span>" +
        '<button class="chip" data-k="' + key + '" data-v="all">All</button>' +
        items.map(function (it) {
          return '<button class="chip" data-k="' + key + '" data-v="' + it.id + '">' + it.name + "</button>";
        }).join("") + "</div>";
    }

    bar.innerHTML =
      group("Colour", "colour", Object.keys(COLOUR_FAMILIES).map(function (k) { return { id: k, name: COLOUR_FAMILIES[k] }; })) +
      group("Finish", "finish", FINISHES.map(function (f) { return { id: f.id, name: f.name }; })) +
      group("Use", "app", APPLICATIONS.map(function (a) { return { id: a.id, name: a.name }; })) +
      '<span class="count" id="count"></span>';

    count = $("#count");

    function paint() {
      $$(".chip", bar).forEach(function (c) {
        c.classList.toggle("on", state[c.dataset.k] === c.dataset.v);
      });
      var shown = 0;
      $$(".card", grid).forEach(function (card) {
        var ok =
          (state.colour === "all" || card.dataset.colour === state.colour) &&
          (state.finish === "all" || card.dataset.finishes.split(" ").indexOf(state.finish) > -1) &&
          (state.app === "all" || card.dataset.apps.split(" ").indexOf(state.app) > -1);
        card.classList.toggle("hide", !ok);
        if (ok) shown++;
      });
      count.textContent = shown + (shown === 1 ? " stone" : " stones");

      var empty = $("#noResults");
      if (!shown) {
        if (!empty) {
          empty = doc.createElement("div");
          empty.id = "noResults";
          empty.className = "empty";
          grid.parentNode.insertBefore(empty, grid.nextSibling);
        }
        empty.innerHTML =
          '<h3 class="display d-sm">Nothing in <em>that combination</em> — yet.</h3>' +
          '<p class="body-txt mt-s">Not every stone is photographed in every finish. Clear a filter, or ask us directly: most combinations exist even when the photograph does not.</p>' +
          '<div class="mt-m"><button class="chip" id="clearFilters">Clear filters</button>' +
          '<a class="btn sun" style="margin-left:12px" href="' + L("contact.html") +
          '">Ask us <span class="ar">↗</span></a></div>';
        $("#clearFilters").addEventListener("click", function () {
          state.colour = state.finish = state.app = "all";
          try {
            history.replaceState(null, "", SINGLE ? "#/collection" : location.pathname);
          } catch (err) { /* file:// */ }
          paint();
        });
      } else if (empty) {
        empty.remove();
      }

      collect();
      $$(".card:not(.hide)", grid).forEach(function (c) { c.classList.add("in"); });
    }

    bar.addEventListener("click", function (e) {
      var c = e.target.closest(".chip");
      if (!c) return;
      state[c.dataset.k] = c.dataset.v;
      var q = new URLSearchParams();
      Object.keys(state).forEach(function (k) { if (state[k] !== "all") q.set(k, state[k]); });
      // Keep the URL shareable, but never let it break the filter:
      // replaceState throws on file:// and the bundle keeps state in the hash.
      try {
        if (SINGLE) {
          history.replaceState(null, "", "#/collection" + (q.toString() ? "?" + q : ""));
        } else {
          history.replaceState(null, "", q.toString() ? "?" + q : location.pathname);
        }
      } catch (err) { /* file:// — carry on, filtering still works */ }
      paint();
    });

    paint();
  };

  /* -- stone detail page -- */
  R.detail = function () {
    var host = $("#detail");
    if (!host) return;
    var slug = query().get("s");
    var s = STONES.filter(function (x) { return x.slug === slug; })[0] || STONES[0];

    // keyword-led, unique per stone
    doc.title = s.name + " Slate Tiles | Indian Slate Stone — Sun Gallery";
    var md = $('meta[name="description"]');
    if (md) md.content = s.name + " Indian slate: " + s.sub.toLowerCase() +
      ". Available in " + s.finishes.join(", ") + " finish, 8–30 mm, cut to size. " +
      "Wholesale supply and worldwide export from the quarry.";
    canonical("stone.html?s=" + s.slug);
    if (typeof ORG !== "undefined") productSchema(s);

    var fin = FINISHES.filter(function (f) { return s.finishes.indexOf(f.id) > -1; });
    var fmt = FORMATS.filter(function (f) { return s.formats.indexOf(f.id) > -1; });
    var app = APPLICATIONS.filter(function (a) { return s.applications.indexOf(a.id) > -1; });
    var others = STONES.filter(function (x) { return x.slug !== s.slug; }).slice(0, 3);

    host.innerHTML =
      /* hero */
      '<div class="hero" style="height:88svh;min-height:520px">' +
        '<div class="layers"><div class="layer l-bg" data-speed="0.5">' +
          figure(shot(s, 1), s.name, s.palette[0], true, "100vw") + '</div></div>' +
        '<div class="veil"></div>' +
        '<div class="hero-in">' +
          '<p class="crumb rv"><a href="' + L("collection.html") + '">Collection</a> — ' + COLOUR_FAMILIES[s.colour] + "</p>" +
          '<h1 class="display d-lg rv-mask mt-s"><span>' + s.name + "</span></h1>" +
          '<div class="hero-meta"><p class="rv">' + s.story + "</p>" +
            '<div class="hero-stats rv" data-d="1">' +
              "<div><span>" + fin.length + "</span><em>Finishes</em></div>" +
              "<div><span>" + fmt.length + "</span><em>Formats</em></div>" +
              "<div><span>" + app.length + "</span><em>Applications</em></div>" +
            "</div></div>" +
        "</div></div>" +

      /* gallery + spec */
      '<section><div class="split">' +
        "<div>" + figure(shot(s, 0), s.name + " — " + s.sub, s.palette[0], true, "(max-width:900px) 92vw, 46vw") + "</div>" +
        '<div class="rv"><span class="badge">' + s.origin + "</span>" +
          '<h2 class="display d-md mt-m">Quarried at<br><em>' + s.origin.split(",")[0] + "</em></h2>" +
          '<div class="spec-list">' +
            '<div><span class="k">Colour family</span><span class="v">' + COLOUR_FAMILIES[s.colour] + "</span></div>" +
            '<div><span class="k">Palette</span><span class="v">' +
              s.palette.map(function (c) { return '<i style="display:inline-block;width:13px;height:13px;border-radius:50%;background:' + c + ';margin-left:6px;vertical-align:-2px"></i>'; }).join("") +
            "</span></div>" +
            '<div><span class="k">Finishes</span><span class="v">' + fin.map(function (f) { return f.name; }).join(", ") + "</span></div>" +
            '<div><span class="k">Formats</span><span class="v">' + fmt.map(function (f) { return f.name; }).join(", ") + "</span></div>" +
            '<div><span class="k">Applications</span><span class="v">' + app.map(function (a) { return a.name; }).join(", ") + "</span></div>" +
          "</div>" +
          '<a class="btn sun mt-m" href="' + L("contact.html?stone=" + s.slug) + '">Request a sample <span class="ar">↗</span></a>' +
        "</div>" +
      "</div></section>" +

      /* every photographed finish, captioned, sized to the real photo */
      '<section style="padding-top:0">' +
        '<div class="sec-head rv"><span class="num">02</span><span class="eyebrow">Finishes photographed</span><span class="rule"></span></div>' +
        '<div class="shot-list">' + s.images.map(function (entry, i) {
          var k = imgKey(entry);
          return '<figure class="shot rv" data-d="' + ((i % 3) + 1) + '" style="--ar:' + ratio(k) + '">' +
            figure(k, s.name + " — " + imgCap(entry), s.palette[0], false, "(max-width:900px) 92vw, 62vw") +
            (imgCap(entry) ? '<figcaption>' + imgCap(entry) + "</figcaption>" : "") +
          "</figure>";
        }).join("") + "</div>" +
      "</section>" +

      /* sizes */
      '<section style="padding-top:0">' +
        '<div class="sec-head rv"><span class="num">03</span><span class="eyebrow">Sizes &amp; Formats</span><span class="rule"></span></div>' +
        '<div class="app-list">' + fmt.map(function (f, i) {
          return '<div class="app-row rv" data-d="' + ((i % 3) + 1) + '"><span class="n">0' + (i + 1) + "</span>" +
            "<div><h2>" + f.name + "</h2><p>" + f.note + "</p></div>" +
            '<div style="text-align:right">' + f.sizes.map(function (z) {
              return '<span class="chip" style="margin:0 0 6px 6px;display:inline-block">' + z + (f.unit ? " " + f.unit : "") + "</span>";
            }).join("") + "</div></div>";
        }).join("") + "</div>" +
      "</section>" +

      /* related */
      '<section>' +
        '<div class="sec-head rv"><span class="num">04</span><span class="eyebrow">Also consider</span><span class="rule"></span></div>' +
        '<div class="stone-grid">' + others.map(function (o, i) { return R.stoneCard(o, i); }).join("") + "</div>" +
      "</section>";

    wireImages(host);
  };

  /* -- contact form ------------------------------------------------
     Posts to FormSubmit, which forwards every submission to the address
     in SITE.formTo. No server needed, so it works on GitHub Pages.
     ONE-TIME SETUP: the first submission triggers a confirmation email to
     that address — click the link in it once and the form is live forever. */
  R.form = function () {
    var f = $("#enquiry");
    if (!f) return;

    var pre = query().get("stone");
    var sel = $("#stoneSelect", f);
    if (sel) {
      sel.innerHTML = '<option value="">Any / not sure yet</option>' +
        STONES.map(function (s) {
          return '<option value="' + s.slug + '"' + (s.slug === pre ? " selected" : "") + ">" + s.name + "</option>";
        }).join("");
      if (pre) sel.closest(".field").classList.add("filled");
    }

    var note = $("#formNote");
    var btn = f.querySelector('button[type="submit"]');
    var btnText = btn ? btn.innerHTML : "";

    function setError(field, msg) {
      var wrap = field.closest(".field");
      wrap.classList.toggle("err", !!msg);
      field.setAttribute("aria-invalid", msg ? "true" : "false");
      var e = wrap.querySelector(".field-err");
      if (msg) {
        if (!e) { e = doc.createElement("span"); e.className = "field-err"; wrap.appendChild(e); }
        e.textContent = msg;
      } else if (e) { e.remove(); }
      return !msg;
    }

    function validate() {
      var ok = true;
      var name = $("#fname", f), email = $("#femail", f);
      ok = setError(name, name.value.trim() ? "" : "Please tell us your name") && ok;
      var v = email.value.trim();
      ok = setError(email,
            !v ? "We need an email to reply to"
               : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "That email doesn't look right") && ok;
      if (!ok) {
        var first = f.querySelector(".field.err input");
        if (first) { first.focus(); }
      }
      return ok;
    }

    // clear an error as soon as the person fixes it
    $$(".field input,.field textarea,.field select", f).forEach(function (i) {
      i.addEventListener("input", function () {
        if (i.closest(".field").classList.contains("err")) setError(i, "");
      });
      i.addEventListener("blur", function () {
        i.closest(".field").classList.toggle("filled", !!i.value);
      });
    });

    f.addEventListener("submit", function (e) {
      e.preventDefault();
      note.innerHTML = "";
      if (!validate()) return;

      // honeypot filled = bot. Show the normal confirmation and drop it.
      var honey = $("#_honey", f);
      if (honey && honey.value) {
        f.reset();
        note.className = "full form-note ok";
        note.innerHTML = '<span class="badge">Sent</span>' +
          "<p>Thank you for your enquiry. Our team will get back to you shortly.</p>";
        return;
      }

      var payload = {};
      new FormData(f).forEach(function (v, k) {
        if (v && k.charAt(0) !== "_") payload[k] = v;
      });
      payload._subject = "Website enquiry — " + (payload.Name || "Sun Gallery");
      payload._template = "table";

      if (btn) { btn.disabled = true; btn.innerHTML = "Sending…"; }

      fetch("https://formsubmit.co/ajax/" + SITE.formTo, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      })
      .then(function (r) { return r.json(); })
      .then(function (r) {
        if (!r || String(r.success) !== "true") throw new Error(r && r.message || "send failed");
        f.reset();
        $$(".field", f).forEach(function (w) { w.classList.remove("filled", "err"); });
        var ee = f.querySelectorAll(".field-err"); Array.prototype.forEach.call(ee, function (x) { x.remove(); });
        note.className = "full form-note ok";
        note.innerHTML = '<span class="badge">Sent</span>' +
          "<p>Thank you for your enquiry. Our team will get back to you shortly.</p>";
        if (note.scrollIntoView) note.scrollIntoView({ behavior: "smooth", block: "center" });
      })
      .catch(function () {
        // network down, or the endpoint not yet activated — never lose the enquiry
        var lines = [];
        Object.keys(payload).forEach(function (k) {
          if (k.charAt(0) !== "_") lines.push(k + ": " + payload[k]);
        });
        note.className = "full form-note warn";
        note.innerHTML =
          "<p>We couldn't send that automatically just now. Your details are safe — " +
          "use the button below and it will open in your mail app, already filled in.</p>" +
          '<a class="btn sun mt-s" href="mailto:' + SITE.formTo +
          "?subject=" + encodeURIComponent("Website enquiry — Sun Gallery") +
          "&body=" + encodeURIComponent(lines.join("\n")) + '">Send by email <span class="ar">↗</span></a>';
        if (note.scrollIntoView) note.scrollIntoView({ behavior: "smooth", block: "center" });
      })
      .then(function () {
        if (btn) { btn.disabled = false; btn.innerHTML = btnText; }
      });
    });
  };

  /* =======================================================
     9. BOOT
     ======================================================= */
  /* Every renderer is a no-op when its host element is absent, so this is
     safe to call for any page — and cheap enough to re-run on navigation. */
  function renderAll() {
    R.hero($("#heroLayers"));
    R.grid($("#featuredGrid"), STONES.filter(function (s) { return s.featured; }), true);
    R.grid($("#grid"), STONES, true);
    R.descent($("#descentCols"));
    R.pinTrack($("#pinTrack"), STONES);
    R.finishes($("#finishGrid"));
    R.applications($("#appList"));
    R.formats($("#formatList"));
    R.features($("#featureGrid"));
    R.chipList($("#thicknessList"), THICKNESS);
    R.chipList($("#edgeList"), EDGES);
    R.chipList($("#exportList"), EXPORT_DETAILS);
    R.packing($("#packingGrid"));
    R.landing();
    R.detail();
    R.filters();
    R.form();
  }

  /* ---- single-file router: swaps page bodies on hash change ---- */
  function router() {
    if (!SINGLE || typeof PAGE_BODIES === "undefined") return;
    var host = $("#scroll");

    function show() {
      var name = here();
      host.innerHTML = PAGE_BODIES[name] || PAGE_BODIES["index.html"];
      var meta = typeof PAGE_META !== "undefined" ? PAGE_META[name] : null;
      if (meta) doc.title = meta.title;
      renderAll();
      buildFooter();
      wireImages();
      marquees();
      $$(".nav-links a").forEach(function (a) {
        var h = a.getAttribute("href") || "";
        var t = (h.replace(/^#\/?/, "").split("?")[0].replace(/\.html$/, "") || "index") + ".html";
        if (t === name) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      });
      win.scrollTo(0, 0);
      current = target = last = 0;
      collect();
    }

    win.addEventListener("hashchange", show);
    show();
  }

  function boot() {
    if (SMOOTH) root.classList.add("smooth");

    buildChrome();

    // renderers — each is a no-op if its host element isn't on the page
    renderAll();

    if (typeof ORG !== "undefined") orgSchema();

    buildFooter();

    // wrap page content for the smooth-scroll layer
    scroller = $("#scroll");
    if (SMOOTH && scroller) {
      spacer = doc.createElement("div");
      spacer.id = "spacer";
      body.appendChild(spacer);
    }

    // any element with data-years shows years trading, so it can never go stale
    $$("[data-years]").forEach(function (el) {
      el.textContent = new Date().getFullYear() - SITE.founded;
    });

    progBar = $("#prog");
    head = $(".site-head");

    wireImages();
    marquees();
    cursor();
    transitions();
    collect();
    preload();

    router();

    requestAnimationFrame(frame);

    var t;
    win.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(function () { collect(); }, 140); }, { passive: true });
    win.addEventListener("load", function () { setTimeout(measure, 60); });
    if ("ResizeObserver" in win && scroller) new ResizeObserver(function () { measure(); }).observe(scroller);

    // anchor links inside the smooth layer
    doc.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var t2 = doc.getElementById(a.getAttribute("href").slice(1));
      if (!t2) return;
      e.preventDefault();
      var r = t2.getBoundingClientRect();
      win.scrollTo({ top: (SMOOTH ? current : win.scrollY) + r.top - 90, behavior: "smooth" });
    });
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
