/* =========================================================
   SUN GALLERY — SEO CONFIG
   ---------------------------------------------------------
   Titles, descriptions, keyword clusters and the six landing
   pages all live here. app.js reads this to build page bodies,
   breadcrumbs and JSON-LD structured data.

   ── DOMAIN ────────────────────────────────────────────────
   ORIGIN is used for canonical tags, Open Graph URLs and
   structured data. If you ever move domain, change it here
   and in sitemap.xml, robots.txt and CNAME.
   ========================================================= */

const ORIGIN = "https://www.sungallery.info";

/* Business facts used in Organization structured data.
   Thailand appears as an export market, not as a location. */
const ORG = {
  legalName: "Sun Gallery",
  description:
    "Indian slate stone supplier and exporter. Natural, polish and leather finishes " +
    "in tiles, slabs, ledger panels, paving and roofing — quarried and finished in Rajasthan, " +
    "shipped worldwide.",
  country: "IN",
  region: "Rajasthan",
  city: "Jaipur",
  markets: [
    "Thailand", "Singapore", "Malaysia", "United Arab Emirates",
    "United Kingdom", "Australia", "United States", "Europe"
  ],
  productRange: [
    "Slate tiles", "Slate slabs", "Slate wall cladding", "Slate flooring tiles",
    "Slate paving slabs", "Slate roof tiles", "Slate pool coping", "Slate stepping stones"
  ]
};

/* -------------------------------------------------------
   PAGE META — one entry per URL.
   `keywords` is the cluster the page is written to own.
   ------------------------------------------------------- */
const PAGE_META = {
  "index.html": {
    title: "Slate Stone Supplier & Exporter | Indian Slate — Sun Gallery",
    description:
      "Indian slate stone supplier and exporter. Wall cladding, flooring tiles, paving slabs, " +
      "roof tiles and pool coping. Quarry direct, bulk export worldwide.",
    keywords: ["slate stone supplier", "slate stone exporter Thailand", "Indian slate stone", "natural slate stone"]
  },
  "collection.html": {
    title: "Black Slate Tiles & Silver Shine Slate Collection — Sun Gallery",
    description:
      "Seven Indian slates: black slate tiles, silver shine slate (also sold as silver grey slate), " +
      "copper, green and multicolour. Filter by colour, finish and application.",
    keywords: ["black slate tiles", "silver shine slate", "silver grey slate", "slate stone colours"]
  },
  "stone.html": {
    title: "Slate Stone — Sun Gallery",
    description: "Indian slate stone detail: colour, finishes, thickness, formats and applications.",
    keywords: ["black slate tiles", "silver shine slate", "silver grey slate"]
  },
  "interior.html": {
    title: "Interior Stone | Slate Flooring & Wall Cladding — Sun Gallery",
    description:
      "Interior stone in Indian slate. Slate flooring tiles and slate wall cladding for halls, " +
      "bathrooms and feature walls. Natural, polish and leather.",
    keywords: ["interior stone", "slate flooring tiles", "slate wall cladding", "interior slate tiles"]
  },
  "exterior.html": {
    title: "Exterior Stone | Slate Paving Slabs — Sun Gallery",
    description:
      "Exterior stone in Indian slate. Slate paving slabs, slate stepping stones and decorative " +
      "slate stone for terraces, gardens and driveways. Frost and UV stable.",
    keywords: ["exterior stone", "slate paving slabs", "slate stepping stones", "decorative slate stone"]
  },
  "elevation.html": {
    title: "Elevation Stone Tiles | Slate Wall Cladding — Sun Gallery",
    description:
      "Elevation stone tiles and natural stone elevation wall cladding in Indian slate. " +
      "Ledger panels and split face for building facades, entrances and columns.",
    keywords: ["elevation stone tiles", "natural stone elevation wall cladding", "slate wall cladding", "facade stone"]
  },
  "roofing.html": {
    title: "Slate Roof Tiles | Affordable Roofing Slate — Sun Gallery",
    description:
      "Affordable slate roof tiles direct from the Indian quarry. Dense, low-absorption natural " +
      "roofing slate, pre-holed and graded, in bulk export quantities.",
    keywords: ["slate roof tiles", "affordable slate roof tiles", "natural roofing slate", "roof slate supplier"]
  },
  "pool.html": {
    title: "Slate Pool Coping & Waterline Tiles — Sun Gallery",
    description:
      "Slate pool coping, bullnose edging and waterline tiling in Indian slate. Anti-slip finishes " +
      "that hold their colour when wet, for pools, spas and wet areas.",
    keywords: ["slate pool coping", "pool surround stone", "anti-slip slate", "slate waterline tiles"]
  },
  "wholesale.html": {
    title: "Buy Slate Stone in Bulk | Wholesale Price & MOQ — Sun Gallery",
    description:
      "Buy slate stone in bulk, quarry direct. Slate stone wholesale price, price per square " +
      "meter and minimum order quantity on request. 20 ft and 40 ft containers.",
    keywords: [
      "buy slate stone in bulk", "slate stone wholesale price",
      "slate stone price per square meter", "slate stone minimum order quantity"
    ]
  },
  "finishes.html": {
    title: "Slate Finishes, Thickness & Edge Profiles — Sun Gallery",
    description:
      "Natural, polish and leather slate finishes. Thickness 8–30 mm, seven edge profiles, " +
      "custom sizes and fumigated export packing for 20 ft and 40 ft containers.",
    keywords: ["slate stone finishes", "slate thickness", "slate edge profiles", "slate export packing"]
  },
  "applications.html": {
    title: "Slate Applications | Cladding, Flooring, Paving — Sun Gallery",
    description:
      "Where Indian slate goes: wall cladding, interior flooring, exterior paving, elevation, " +
      "roofing, pool coping and worktops. One material, every surface.",
    keywords: ["slate wall cladding", "slate flooring tiles", "slate paving slabs", "exterior stone", "interior stone"]
  },
  "contact.html": {
    title: "Request Slate Samples & Wholesale Quote — Sun Gallery",
    description:
      "Request free slate stone samples, wholesale pricing and a specification quote. " +
      "Indian slate exporter shipping to Thailand, the Gulf, Europe, Australia and the US.",
    keywords: ["slate stone quote", "slate samples", "slate stone exporter Thailand"]
  }
};

/* -------------------------------------------------------
   LANDING PAGES — the six keyword clusters.
   `apps` and `stones` pull real records from data.js, so
   these pages stay in sync with the catalogue automatically.
   ------------------------------------------------------- */
const LANDING = {
  interior: {
    slug: "interior.html",
    eyebrow: "Interior stone",
    h1: ["Interior stone that", "<em>ages into the room</em>"],
    intro:
      "Slate flooring tiles and slate wall cladding for interiors. Low porosity, high dimensional " +
      "stability and a surface that keeps its grip when wet — the reason slate outlasts the schemes built around it.",
    apps: ["flooring", "cladding", "bathroom", "kitchen"],
    stones: ["prime-grey", "star-galaxy", "forest-fire", "copper"],
    blocks: [
      { h: "Slate flooring tiles",
        p: "Calibrated 10–20 mm tiles in natural and polish for halls, living space and lobbies. " +
           "Dense and frost stable, with a natural slip resistance that does not depend on a coating." },
      { h: "Slate wall cladding",
        p: "Ledger panels, split face and large-format book-matched slabs for feature walls, " +
           "fireplaces and reception backdrops. Fixed mechanically or adhered, depending on height." },
      { h: "Bathrooms and wet areas",
        p: "Full-height shower linings, matched vanity tops and anti-slip floors in the same stone, " +
           "so the room reads as one surface rather than four finishes." }
    ],
    faq: [
      { q: "Is slate suitable for interior flooring?",
        a: "Yes. Slate has very low water absorption and high dimensional stability, which is why it is " +
           "specified for halls, kitchens and bathrooms. A honed or polished finish suits interiors; " +
           "natural cleft is better where grip matters more than smoothness." },
      { q: "What thickness should interior slate flooring be?",
        a: "10–20 mm is normal for interior floors depending on the substrate and the format. " +
           "We gauge to order from 8 mm up to 30 mm." }
    ]
  },

  exterior: {
    slug: "exterior.html",
    eyebrow: "Exterior stone",
    h1: ["Exterior stone that", "<em>survives the weather</em>"],
    intro:
      "Slate paving slabs, slate stepping stones and decorative slate stone for terraces, gardens " +
      "and driveways. Frost stable, UV stable, and naturally slip resistant without a treatment.",
    apps: ["landscape", "pool", "cladding"],
    stones: ["devli-green", "forest-fire", "natural-grey", "copper"],
    blocks: [
      { h: "Slate paving slabs",
        p: "Riven and leathered paving in calibrated sizes and random crazy paving sorted by size band. " +
           "20–30 mm for pedestrian terraces, heavier where vehicles run." },
      { h: "Slate stepping stones",
        p: "Individually selected pieces with natural edges for garden paths and lawn crossings. " +
           "Sold by piece or by weight, sorted to a size band you set." },
      { h: "Decorative slate stone",
        p: "Crazy paving, wall copings, edging and garden features. The multicolour stones do the most " +
           "outdoors — the oxide banding reads differently in every light." }
    ],
    faq: [
      { q: "Does slate paving get slippery outdoors?",
        a: "A natural cleft or leathered face gives good grip wet or dry. Polished slate is not " +
           "recommended for external paving. Algae growth on any stone will reduce grip, so " +
           "occasional cleaning matters more than the stone choice." },
      { q: "Will exterior slate fade in the sun?",
        a: "Slate is UV stable and holds its colour. What changes is surface dirt and weathering, " +
           "which is why we recommend a leathered or riven face outdoors rather than a polish." }
    ]
  },

  elevation: {
    slug: "elevation.html",
    eyebrow: "Elevation & facade",
    h1: ["Elevation stone that", "<em>carries the building</em>"],
    intro:
      "Elevation stone tiles and natural stone elevation wall cladding in Indian slate. Ledger panels, " +
      "split face and large-format slabs for facades, entrances, boundary walls and columns.",
    apps: ["cladding", "flooring"],
    stones: ["natural-grey", "forest-fire", "devli-green", "prime-grey"],
    blocks: [
      { h: "Elevation stone tiles",
        p: "Calibrated tiles in running bond or stack bond for flat elevation panels. " +
           "Consistent thickness means tight joints and a flat plane across a long run." },
      { h: "Natural stone elevation wall cladding",
        p: "Interlocking S-shaped and Z-shaped ledger panels give a three-dimensional relief that " +
           "reads at street distance. Corner pieces made to match so the return has no visible joint." },
      { h: "Fixing and specification",
        p: "Adhered for low-level work, mechanically anchored above. Send the elevation drawing and " +
           "we will come back with panel sizes, setting-out and wastage allowance." }
    ],
    faq: [
      { q: "What is the best stone for building elevation?",
        a: "Slate is a common choice because it is dense, frost stable and splits into thin, light " +
           "panels — which matters when you are hanging weight off a facade. Natural Grey and " +
           "Forest Fire are our most specified elevation stones." },
      { q: "Can slate elevation cladding be used on a high-rise?",
        a: "Yes, with a mechanically anchored system rather than adhesive. Thickness, anchor type and " +
           "panel size all need to come from the structural engineer — send us the spec and we cut to it." }
    ]
  },

  roofing: {
    slug: "roofing.html",
    eyebrow: "Roofing",
    h1: ["Roofing slate,", "<em>quarry direct</em>"],
    intro:
      "Affordable slate roof tiles supplied direct from the Indian quarry. Dense, low-absorption " +
      "natural roofing slate — pre-holed, graded and packed for container export.",
    apps: ["cladding"],
    stones: ["devli-green", "natural-grey", "prime-grey"],
    blocks: [
      { h: "Slate roof tiles",
        p: "Thin-split natural roofing slate in standard rectangular formats, pre-holed on request. " +
           "The density and low water absorption are what give slate its working life on a roof." },
      { h: "Affordable slate roof tiles",
        p: "Buying direct from the quarry removes the importer margin. At container volumes the " +
           "landed cost competes with concrete tile while lasting several times longer." },
      { h: "Grading and packing",
        p: "Sorted for thickness and soundness before packing, crated on fumigated pallets and " +
           "loaded to 20 ft or 40 ft containers." }
    ],
    faq: [
      { q: "How long do natural slate roof tiles last?",
        a: "Natural roofing slate routinely outlasts the fixings holding it down. Life depends on the " +
           "density and water absorption of the specific slate and on the climate, so ask for the " +
           "test data for the batch you are quoted." },
      { q: "What is the minimum order for slate roof tiles?",
        a: "Roofing slate is normally supplied by the container. Minimum order quantity depends on " +
           "destination and format — tell us the roof area and port and we will confirm." }
    ]
  },

  pool: {
    slug: "pool.html",
    eyebrow: "Pools & water",
    h1: ["Slate pool coping,", "<em>colour that holds</em>"],
    intro:
      "Slate pool coping, bullnose edging and waterline tiling in Indian slate. Anti-slip finishes " +
      "that keep their colour wet, and coping profiles machined to your pool section.",
    apps: ["pool", "landscape"],
    stones: ["silver-shine", "copper", "devli-green"],
    blocks: [
      { h: "Slate pool coping",
        p: "Bullnose, pencil round and drip-groove profiles machined in-house, cut to your radius " +
           "for curved pools. Matched surround paving in the same batch." },
      { h: "Waterline and internal tiling",
        p: "Slate laid wet reads deeper and cooler than it does dry — Silver Shine turns blue-green " +
           "under water, which is the whole reason to specify it." },
      { h: "Anti-slip surrounds",
        p: "Natural cleft and leathered faces give grip barefoot and wet. We do not recommend " +
           "polished slate anywhere someone walks out of a pool." }
    ],
    faq: [
      { q: "Is slate good for pool coping?",
        a: "Slate is dense and low-absorption, so it copes with constant wetting and with pool " +
           "chemicals better than more porous stones. Use a natural or leathered face for grip, " +
           "and seal it if your water is heavily chlorinated." },
      { q: "Does slate change colour when wet?",
        a: "Yes, and that is usually the point. Colours deepen considerably wet — Copper goes almost " +
           "molten and Silver Shine deepens to near-black. Always look at a wet sample before specifying." }
    ]
  },

  wholesale: {
    slug: "wholesale.html",
    eyebrow: "Wholesale & export",
    h1: ["Buy slate stone", "<em>in bulk</em>"],
    intro:
      "Quarry-direct wholesale supply for importers, distributors and contractors. As a slate stone " +
      "exporter Thailand, Singapore, the Gulf and Europe buy from directly, we confirm slate stone " +
      "wholesale price, slate stone price per square meter and minimum order quantity against your " +
      "specification and destination port.",
    apps: [],
    stones: ["prime-grey", "natural-grey", "copper", "forest-fire"],
    blocks: [
      { h: "Slate stone wholesale price",
        p: "Priced per square metre ex-works or FOB, depending on the stone, finish, thickness and " +
           "format. Because we quarry and finish in-house there is no importer margin in the number." },
      { h: "Slate stone minimum order quantity",
        p: "MOQ is set on request and depends on the stone and the destination. Most orders ship as " +
           "20 ft or 40 ft container loads; mixed containers across several stones are possible." },
      { h: "Export terms",
        p: "Wooden crates on fumigated pallets, custom pallet sizes on request, full export " +
           "documentation. We ship to Thailand, the Gulf, Europe, Australia and the US." }
    ],
    faq: [
      { q: "What is the slate stone price per square meter?",
        a: "The slate stone price per square meter depends on the stone, finish, thickness and format, " +
           "and on whether you are quoting ex-works or FOB. We do not publish a single rate because it " +
           "would be wrong for most enquiries — send the specification and quantity and you will get a " +
           "real number, usually within one working day." },
      { q: "What is the minimum order quantity for slate stone?",
        a: "MOQ is on request. In practice most wholesale orders are a 20 ft or 40 ft container. " +
           "Smaller trial orders can sometimes be consolidated — ask." },
      { q: "Can I buy slate stone in bulk directly from India?",
        a: "Yes. We are the quarry and the finishing works, so you buy direct with no intermediary. " +
           "We handle crating, fumigation, documentation and loading to your nominated port." },
      { q: "Are you a slate stone exporter to Thailand?",
        a: "Yes. Thailand is one of our regular export markets as a slate stone exporter, alongside " +
           "Singapore, Malaysia, the UAE, the UK, Australia, the US and mainland Europe. We ship " +
           "to any nominated port." },
      { q: "Are samples free?",
        a: "Yes. We send physical samples and a shade-band reference before anything is committed, " +
           "worldwide." }
    ]
  }
};
