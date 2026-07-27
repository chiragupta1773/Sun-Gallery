/* =========================================================
   SUN GALLERY — CATALOGUE
   ---------------------------------------------------------
   THIS IS THE ONLY FILE YOU EDIT.
   Every grid, filter, rail, hero and detail page is generated
   from what's below. Adding a stone never requires touching
   a single line of HTML.

   ── ADDING PHOTOS ─────────────────────────────────────────
   1. Drop the full-size original into  tools/originals/
      Name the file after the key you want:
          prime grey sour blast.jpg  →  prime-grey-sour-blast
      (spaces, capitals and underscores all become hyphens)
   2. Run:  python3 tools/optimize-images.py
   3. Add the key to a stone's `images` array below. Done.

   ── FIELDS ────────────────────────────────────────────────
   slug ......... url id, must be unique (stone.html?s=<slug>)
   colour ....... a key from COLOUR_FAMILIES — drives the filters
   palette ...... 2–4 hex codes sampled from the stone
   finishes ..... ids from FINISHES
   images ....... first is the card + hero shot
   featured ..... true = appears in the home page featured grid
   ========================================================= */

const SITE = {
  name: "Sun Gallery",
  tagline: "Indian slate, quarried and finished for architecture.",
  email: "info@sunminerals.net",
  formTo: "info@sunminerals.net",   // every enquiry is forwarded here
  phone: "+91 91168 72953",
  address: ["Sun Gallery", "Rajasthan", "India"],   // ← add street / city when you have it
  founded: 2008,
  /* Any entry left as "#" is hidden rather than rendered as a dead link.
     Paste the real URL in and it appears automatically. */
  social: [
    { label: "WhatsApp",  href: "https://wa.me/919116872953" },
    { label: "Instagram", href: "#" },
    { label: "LinkedIn",  href: "#" }
  ]
};

/* Colour families — order here is the order in the filter bar */
const COLOUR_FAMILIES = {
  grey:       "Grey & Silver",
  black:      "Black & Charcoal",
  copper:     "Copper & Rust",
  green:      "Green",
  multicolor: "Multicolour"
};

/* ---- FINISHES ---- */
/* `image` is optional. Give a finish its own photograph and the finish card
   uses it; leave it out and the card borrows a stone shot in that finish. */
const FINISHES = [
  { id: "natural", name: "Natural", note: "Riven, as the stone splits. Maximum texture and grip.",
    image: "prime-grey" },
  { id: "polish",  name: "Polish",  note: "Full gloss. Deepens the colour and opens the vein.",
    image: "silver-shine-polish" },
  { id: "leather", name: "Leather", note: "Soft satin with the texture left in. Warm underhand, low glare.",
    image: "devli-green-leather" }
];

/* ---- THICKNESS ---- */
const THICKNESS = ["8 mm", "10 mm", "12 mm", "15 mm", "20 mm", "25 mm", "30 mm", "Custom thickness available"];

/* ---- EDGE PROFILES ---- */
const EDGES = ["Sawn", "Chamfered", "Beveled", "Eased", "Pencil Round", "Machine Bull Nose", "Custom profiles"];

/* ---- EXPORT & PACKING ---- */
const EXPORT_DETAILS = [
  "Wooden crates", "Fumigated packaging", "Custom pallets",
  "20 ft containers", "40 ft containers", "Worldwide shipping", "MOQ on request"
];

/* ---- PACKING PHOTOGRAPHS ----
   Shots of real crates leaving the works. Add more the same way:
   drop the photo in tools/originals/, run the optimiser, add the key here. */
const PACKING = [
  { key: "packing-crate-open",
    title: "Foam-wrapped, edge to edge",
    note: "Every tile individually foam-sleeved and stacked on edge, so nothing moves and no two faces touch in transit." },
  { key: "packing-crate-strapped",
    title: "Braced and strapped",
    note: "Cross-braced timber crate, shrink-wrapped and strapped over a fumigated pallet. Built for sea freight and forklift handling." },
  { key: "packing-yard",
    title: "Ready for the container",
    note: "Crates staged and labelled in the yard, sized so a 20 ft or 40 ft container loads square with no wasted volume." }
];

/* ---- WHY SUN GALLERY ---- */
const FEATURES = [
  { name: "Premium Export Grade",    note: "Graded and inspected before every shipment leaves India." },
  { name: "Indian Origin",           note: "Quarried, cut and finished at source." },
  { name: "Hand-Selected Stone",     note: "Each block chosen for grain, tone and integrity." },
  { name: "Natural Split Surface",   note: "Texture that comes from the stone, not a machine." },
  { name: "Weather & UV Resistant",  note: "Holds its colour and finish under direct sun." },
  { name: "Water & Slip Resistant",  note: "Engineered for poolside and wet-area safety." },
  { name: "Custom Sizes & Thickness",note: "Cut to your architectural drawings on request." },
  { name: "Worldwide Export",        note: "Bulk supply, packed and shipped to any port." }
];

const FORMATS = [
  { id: "tiles",   name: "Tiles",           sizes: ["300×300", "600×300", "600×600", "900×600"], unit: "mm", note: "Cut to size, 8–30 mm." },
  { id: "slabs",   name: "Slabs",           sizes: ["Up to 2400×1200"], unit: "mm", note: "Gauged, resin backed on request." },
  { id: "ledger",  name: "Ledger Panels",   sizes: ["600×150", "550×150"], unit: "mm", note: "S-shaped and Z-shaped interlocking cladding." },
  { id: "crazy",   name: "Random / Crazy",  sizes: ["Broken, 20–40 mm"], unit: "", note: "Sorted by size band, sold by weight." },
  { id: "coping",  name: "Coping & Steps",  sizes: ["Bespoke"], unit: "", note: "Bullnose, pencil round, drip groove." },
  { id: "mosaic",  name: "Mosaic & Strips", sizes: ["300×300 sheets"], unit: "mm", note: "Mesh mounted, interlocking and strip patterns." },
  { id: "counter", name: "Worktops",        sizes: ["Templated"], unit: "", note: "Islands, vanities and splashbacks, edge profiled." }
];

const APPLICATIONS = [
  { id: "cladding",  name: "Wall Cladding", image: "forest-fire",
    note: "Ledger panels and split face for feature walls, reception backdrops and columns." },
  { id: "bathroom",  name: "Bathrooms & Wet Areas", image: "copper-polish",
    note: "Anti-slip finishes, matched vanity tops and full-height shower linings." },
  { id: "flooring",  name: "Interior Flooring", image: "prime-grey-polish",
    note: "Polished and natural slate for halls, living space and lobbies. Low porosity, high dimensional stability." },
  { id: "kitchen",   name: "Kitchens & Worktops", image: "star-galaxy",
    note: "Templated islands, splashbacks and counters in dense, heat-tolerant stone." },
  { id: "pool",      name: "Pools & Water", image: "prime-grey-bath",
    note: "Waterline tiling, bullnose coping and surrounds that hold their colour when wet." },
  { id: "landscape", name: "Terraces & Landscape", image: "devli-green-leather",
    note: "Leathered and riven paving, crazy paving, garden steps and edging." }
];

/* =========================================================
   THE STONES
   ========================================================= */
const STONES = [
  {
    slug: "prime-grey",
    name: "Prime Grey",
    sub: "Veined, large format",
    colour: "grey",
    origin: "Rajasthan",
    palette: ["#514C44", "#7E828A", "#C4C9CF"],
    story: "Our most versatile grey. Cut large and book-matched so the vein runs unbroken across a wall, or taken to a full polish where the movement turns almost liquid.",
    finishes: ["natural", "polish"],
    formats: ["slabs", "tiles", "counter", "coping"],
    applications: ["bathroom", "flooring", "cladding", "kitchen"],
    featured: true,
    images: [
      { key: "prime-grey",            caption: "Natural — vanity wall, book-matched" },
      { key: "prime-grey-bath",       caption: "Natural — full-height wet room" },
      { key: "prime-grey-polish",     caption: "Polish — feature wall" },
      { key: "prime-grey-sour-blast", caption: "Sour blast — riven cladding panel" }
    ]
  },
  {
    slug: "natural-grey",
    name: "Natural Grey",
    sub: "Charcoal, stacked ledger",
    colour: "grey",
    origin: "Rajasthan",
    palette: ["#45443F", "#6E7176", "#A9AEB4"],
    story: "A dark grey ground carrying a silver drift through the cleft. Stacked as ledger it reads almost black, and the relief does the whole job — no other material in the room has to work.",
    finishes: ["natural"],
    formats: ["ledger", "tiles", "crazy", "coping"],
    applications: ["cladding", "bathroom", "landscape"],
    featured: true,
    images: [
      { key: "natural-grey", caption: "Natural — stacked ledger, full height" }
    ]
  },
  {
    slug: "silver-shine",
    name: "Silver Shine",
    sub: "Mica-flecked grey — also sold as silver grey slate",
    colour: "grey",
    origin: "Rajasthan",
    palette: ["#524E46", "#8A8E93", "#C6CAD0"],
    story: "Muscovite mica sits in the cleft plane and throws light back at you as you move. Left natural it is all texture and shadow; taken to a polish it turns to a dark mirror that doubles whatever stands on it.",
    finishes: ["natural", "polish"],
    formats: ["tiles", "slabs", "ledger", "counter", "coping"],
    applications: ["cladding", "bathroom", "flooring", "kitchen"],
    featured: true,
    images: [
      { key: "silver-shine-natural", caption: "Natural — riven vanity wall" },
      { key: "silver-shine-polish",  caption: "Polish — full-gloss interior floor" }
    ]
  },
  {
    slug: "star-galaxy",
    name: "Star Galaxy",
    sub: "Black with silver speckle",
    colour: "black",
    origin: "Rajasthan",
    palette: ["#2A2A2C", "#6C6459", "#B9BCC0"],
    story: "Dense black scattered with metallic speckle that catches every light source in the room. Hard, low-porosity and heat tolerant, which is why it ends up on kitchen islands more than walls.",
    finishes: ["polish", "leather"],
    formats: ["slabs", "counter", "tiles"],
    applications: ["kitchen", "flooring", "cladding"],
    featured: true,
    images: [
      { key: "star-galaxy", caption: "Polish — island, splashback and counter" }
    ]
  },
  {
    slug: "copper",
    name: "Copper",
    sub: "Bronze and oxide",
    colour: "copper",
    origin: "Rajasthan",
    palette: ["#3E2E20", "#8C542C", "#DFB183"],
    story: "A metallic sheen over a bronze ground. Wet it and it goes almost molten, which is why it ends up in bathrooms more often than anywhere else. Polished, the oxide banding lifts and the whole surface deepens.",
    finishes: ["natural", "polish"],
    formats: ["tiles", "ledger", "mosaic", "coping"],
    applications: ["bathroom", "cladding", "landscape"],
    featured: true,
    images: [
      { key: "natural-copper", caption: "Natural — shower lining, full height" },
      { key: "copper-polish",  caption: "Polish — vanity wall and counter" }
    ]
  },
  {
    slug: "devli-green",
    name: "Devli Green",
    sub: "Deep green and gold",
    colour: "green",
    origin: "Devli, Rajasthan",
    palette: ["#362D22", "#6B6144", "#B09A63"],
    story: "Deep olive green shading into gold, and dark enough at one end of the batch to sort as near-black — so a single wall can graduate from carbon into green without a joint line giving it away.",
    finishes: ["natural", "polish", "leather"],
    formats: ["tiles", "ledger", "crazy", "coping", "counter"],
    applications: ["cladding", "bathroom", "landscape", "flooring"],
    featured: true,
    images: [
      { key: "devli-green",         caption: "Natural — graduated feature wall" },
      { key: "devli-green-polish",  caption: "Polish — vanity wall and counter" },
      { key: "devli-green-leather", caption: "Leather — external terrace paving" }
    ]
  },
  {
    slug: "forest-fire",
    name: "Forest Fire",
    sub: "Rust, gold and sage",
    colour: "multicolor",
    origin: "Rajasthan",
    palette: ["#5E4A33", "#9A7B4A", "#8A9182"],
    story: "Iron oxide banding running from sage through ochre to burnt rust, often inside a single tile. Laid in quantity it stops reading as pattern and starts behaving like weather.",
    finishes: ["natural", "polish", "leather"],
    formats: ["tiles", "crazy", "ledger", "coping", "counter"],
    applications: ["cladding", "flooring", "landscape"],
    featured: true,
    images: [
      { key: "forest-fire", caption: "Natural — riven cladding, running bond" }
    ]
  }
];

/* Wide shots for the home hero. First is the main plate. */
const HERO_IMAGES = ["forest-fire", "prime-grey-polish", "natural-copper"];

/* Tall crops used by the scroll-descent effect. Portrait works best. */
const DESCENT_IMAGES = [
  "atelier-tiles", "atelier-sample", "texture-fireplace",
  "prime-grey", "prime-grey-sour-blast", "star-galaxy"
];
