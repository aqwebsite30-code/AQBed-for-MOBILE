export type Category =
  | "all-beds"
  | "ottoman-beds"
  | "divan-beds"
  | "storage-beds"
  | "luxury-beds"
  | "mattresses"
  | "headboards"
  | "wardrobes"
  | "sliding-wardrobes"
  | "bedroom-furniture"
  | "sofas";

export const CATEGORIES: { slug: Category; name: string; image: string; blurb: string }[] = [
  {
    slug: "all-beds",
    name: "All Beds",
    image: "/all products img/Ambessador/1.webp",
    blurb: "Our entire collection of handcrafted beds",
  },
  {
    slug: "luxury-beds",
    name: "Luxury Beds",
    image: "/all products img/Divan Ottoman bed/1.webp",
    blurb: "Statement pieces",
  },
  {
    slug: "ottoman-beds",
    name: "Ottoman Beds",
    image: "/all products img/Bunk beds/1.webp",
    blurb: "Lift-up storage frames",
  },
  {
    slug: "wardrobes",
    name: "Wardrobes",
    image: "/Wardrobes/alina-wardrobe-main.webp",
    blurb: "Elegant storage solutions",
  },
  {
    slug: "sliding-wardrobes",
    name: "Sliding Wardrobes",
    image: "/Sliding wardrobe/sliding-wardrobe-main.webp",
    blurb: "Sleek sliding space-savers",
  },
  {
    slug: "divan-beds",
    name: "Divan Beds",
    image: "/all products img/Divan/1 Panel line head board.webp",
    blurb: "Classic divan beds with integrated storage",
  },
  {
    slug: "storage-beds",
    name: "Storage Beds",
    image: "/all products img/Ambessador/1.webp",
    blurb: "Beds with clever built-in storage solutions",
  },
  {
    slug: "mattresses",
    name: "Mattresses",
    image: "/all products img/Divan/1 Panel line head board.webp",
    blurb: "Premium mattresses for the perfect night's sleep",
  },
  {
    slug: "headboards",
    name: "Headboards",
    image: "/Home%20page%20images/1000152187-clean.webp",
    blurb: "Stylish headboards to complete your bedroom",
  },
  {
    slug: "sofas",
    name: "Sofas",
    image: "/Sofas/Chesterfield Sofa/chesterfield-sofa-main.webp",
    blurb: "Premium sofas for luxury and comfort",
  },
];

export type Option = { name: string; extraPrice: number };

export const DISCOUNT_POSTCODES = [
  "WF",
  "S",
  "DN",
  "DE",
  "NG",
  "LE",
  "CV",
  "B",
  "WV",
  "WS",
  "DY",
  "BD",
  "HD",
  "HX",
  "ST",
  "TF",
  "M",
  "OL",
  "PR",
  "L",
  "FY",
  "WN",
  "BL",
  "BB",
  "WA",
  "CH",
  "SK",
  "CW",
  "LS",
  "HG",
  "YO",
  "NE",
  "SR",
  "DH",
  "DL",
  "TS",
  "LN",
  "NN",
  "HU",
  "LU",
  "MK",
];

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  basePrice: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  stock: number;
  isNew?: boolean;
  onSale?: boolean;
  images: string[];
  description: string;
  colors: { name: string; hex?: string; image?: string }[];
  sizes: Option[];
  fabrics: Option[];
  mattressOptions: Option[];
  frameOptions: Option[];
  headboardOptions?: Option[];
  storageOptions?: Option[];
  keywords?: string[];
}

// ─── Colour palettes ───────────────────────────────────────────────────────────
export const CRUSHED_VELVET_COLORS = [
  { name: "Aubergine", image: "/COLOR/Crushed velvet/Aubergine.webp" },
  { name: "Black", image: "/COLOR/Crushed velvet/Black.webp" },
  { name: "Camel", image: "/COLOR/Crushed velvet/Camel.webp" },
  { name: "Cream", image: "/COLOR/Crushed velvet/Cream.webp" },
  { name: "Denim", image: "/COLOR/Crushed velvet/Denim.webp" },
  { name: "Gold", image: "/COLOR/Crushed velvet/Gold.webp" },
  { name: "Gray", image: "/COLOR/Crushed velvet/Gray.webp" },
  { name: "Mink", image: "/COLOR/Crushed velvet/Mink.webp" },
  { name: "Pink", image: "/COLOR/Crushed velvet/Pink.webp" },
  { name: "Purple", image: "/COLOR/Crushed velvet/Purple.webp" },
  { name: "Pweter", image: "/COLOR/Crushed velvet/Pweter.webp" },
  { name: "Red", image: "/COLOR/Crushed velvet/Red.webp" },
  { name: "Silver", image: "/COLOR/Crushed velvet/Silver.webp" },
  { name: "Teal", image: "/COLOR/Crushed velvet/Teal.webp" },
  { name: "Truffle", image: "/COLOR/Crushed velvet/Truffle.webp" },
  { name: "White", image: "/COLOR/Crushed velvet/White.webp" },
];

export const CHENILLE_COLORS = [
  { name: "Black", image: "/COLOR/Chenille/Black.webp" },
  { name: "Charcoal", image: "/COLOR/Chenille/Charcoal.webp" },
  { name: "Chocolate", image: "/COLOR/Chenille/Chocolate.webp" },
  { name: "Cream", image: "/COLOR/Chenille/Cream.webp" },
  { name: "Mink", image: "/COLOR/Chenille/Mink.webp" },
  { name: "Plum", image: "/COLOR/Chenille/Plum.webp" },
  { name: "Purple", image: "/COLOR/Chenille/Purple.webp" },
  { name: "Red", image: "/COLOR/Chenille/Red.webp" },
  { name: "Sky", image: "/COLOR/Chenille/Sky.webp" },
  { name: "Steel", image: "/COLOR/Chenille/Steal.webp" },
  { name: "Teal", image: "/COLOR/Chenille/Teal.webp" },
];

export const SOFT_MATTE_COLORS = [
  { name: "Black", image: "/COLOR/Soft Matte/Black.webp" },
  { name: "Blue", image: "/COLOR/Soft Matte/Blue.webp" },
  { name: "Charcoal", image: "/COLOR/Soft Matte/Charcoal.webp" },
  { name: "Cream", image: "/COLOR/Soft Matte/Cream.webp" },
  { name: "Mink", image: "/COLOR/Soft Matte/Mink.webp" },
  { name: "Plum", image: "/COLOR/Soft Matte/Plum.webp" },
  { name: "Sand", image: "/COLOR/Soft Matte/Sand.webp" },
  { name: "Seal Gray", image: "/COLOR/Soft Matte/Seal gray.webp" },
  { name: "Silver", image: "/COLOR/Soft Matte/Silver.webp" },
  { name: "Slate", image: "/COLOR/Soft Matte/Slate.webp" },
];

export const PLUSH_VELVET_COLORS = [
  { name: "Beige", image: "/COLOR/plush velvet/Beige.webp" },
  { name: "Black", image: "/COLOR/plush velvet/Black.webp" },
  { name: "Brown", image: "/COLOR/plush velvet/Brown.webp" },
  { name: "Bustard Gold", image: "/COLOR/plush velvet/Bustard Gold.webp" },
  { name: "Camel", image: "/COLOR/plush velvet/Camel.webp" },
  { name: "Cream", image: "/COLOR/plush velvet/Cream.webp" },
  { name: "Duck Egg", image: "/COLOR/plush velvet/Duck Egg.webp" },
  { name: "Grey", image: "/COLOR/plush velvet/Grey.webp" },
  { name: "Maroon", image: "/COLOR/plush velvet/Maroon.webp" },
  { name: "Mink", image: "/COLOR/plush velvet/Mink.webp" },
  { name: "Pink", image: "/COLOR/plush velvet/Pink.webp" },
  { name: "Saphire", image: "/COLOR/plush velvet/Saphire.webp" },
  { name: "Silver", image: "/COLOR/plush velvet/Silver.webp" },
  { name: "Steel", image: "/COLOR/plush velvet/Steel.webp" },
  { name: "Teal", image: "/COLOR/plush velvet/Teal.webp" },
  { name: "White", image: "/COLOR/plush velvet/White.webp" },
];

// ─── Shared option arrays ──────────────────────────────────────────────────────
const STANDARD_FABRICS: Option[] = [
  { name: "Crushed Velvet", extraPrice: 0 },
  { name: "Plush Velvet", extraPrice: 0 },
  { name: "Chenille", extraPrice: 0 },
  { name: "Soft Matte", extraPrice: 0 },
];

const STANDARD_MATTRESS: Option[] = [
  { name: "Standard Comfort Mattress (Free Included)", extraPrice: 0 },
  { name: "Basic Memory Foam", extraPrice: 40 },
  { name: "Full Orthopedic", extraPrice: 50 },
  { name: "1000 Pocket Sprung", extraPrice: 60 },
  { name: "2000 Pocket Sprung", extraPrice: 80 },
];

// Ottoman Gas Lift price is stored as 0 — the real £120/£160 is computed
// dynamically in product.$slug.tsx based on selected size.
const OTTOMAN_STORAGE: Option[] = [
  { name: "No Storage", extraPrice: 0 },
  { name: "Ottoman Storage Gas Lift", extraPrice: 0 }, // £120 / £160 applied dynamically
];

const DIVAN_STORAGE: Option[] = [
  { name: "No Storage", extraPrice: 0 },
  { name: "2 Drawers", extraPrice: 40 },
  { name: "4 Drawers", extraPrice: 70 },
];

const STANDARD_HEADBOARD: Option[] = [{ name: "Standard Headboard (Free)", extraPrice: 0 }];

// ─── Helper ────────────────────────────────────────────────────────────────────
function product(
  id: string,
  name: string,
  category: Category,
  basePrice: number,
  originalPrice: number,
  image: string,
  opts: Partial<Product> = {},
): Product {
  return {
    id,
    slug: id,
    name,
    category,
    basePrice,
    originalPrice,
    rating: opts.rating ?? 4.7,
    reviews: opts.reviews ?? 128,
    stock: opts.stock ?? 24,
    onSale: true,
    isNew: opts.isNew ?? false,
    images: opts.images ?? [image, image, image],
    description:
      opts.description ??
      "Includes Standard Comfort Mattress (FREE) and a premium handcrafted headboard. Built in the UK with the finest materials for a royal sleep experience.",
    colors: opts.colors ?? CRUSHED_VELVET_COLORS,
    sizes: opts.sizes ?? [],
    fabrics: opts.fabrics ?? STANDARD_FABRICS,
    mattressOptions: opts.mattressOptions ?? STANDARD_MATTRESS,
    frameOptions: opts.frameOptions ?? [],
    headboardOptions: opts.headboardOptions ?? STANDARD_HEADBOARD,
    storageOptions: opts.storageOptions ?? OTTOMAN_STORAGE,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ALL 15 PRODUCTS — pricing read directly from info.txt files
// basePrice = the discounted price for the AUTO-SELECTED default size
// extraPrice = DELTA from basePrice for that size/option combo
// ─────────────────────────────────────────────────────────────────────────────

const baseProducts: Product[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // 1. LUXURY AMBESSADOR BED
  // base = £360 (standard single, with mattress)  |  original = £400
  // WITH mattress:  sts=360, sd=410, std=410, k=420, sk=460
  // NO  mattress:   sts=420, sd=480, std=480, k=510, sk=600
  // ══════════════════════════════════════════════════════════════════════════
  product(
    "ambessador",
    "Luxury Ambessador Bed",
    "luxury-beds",
    360,
    400,
    "/all products img/Ambessador/1.webp",
    {
      sizes: [
        { name: "3ft Standard Single – With Mattress", extraPrice: 0 },
        { name: "4ft Small Double – With Mattress", extraPrice: 50 },
        { name: "4'6ft Standard Double – With Mattress", extraPrice: 50 },
        { name: "5ft King Size – With Mattress", extraPrice: 60 },
        { name: "6ft Super King – With Mattress", extraPrice: 100 },
        { name: "3ft Standard Single – No Mattress", extraPrice: 60 },
        { name: "4ft Small Double – No Mattress", extraPrice: 120 },
        { name: "4'6ft Standard Double – No Mattress", extraPrice: 120 },
        { name: "5ft King Size – No Mattress", extraPrice: 150 },
        { name: "6ft Super King – No Mattress", extraPrice: 240 },
      ],
      images: [
        "/all products img/Ambessador/1.webp",
        "/all products img/Ambessador/2.webp",
        "/all products img/Ambessador/3.webp",
        "/all products img/Ambessador/4.webp",
      ],
    },
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // 2. LUXURY ARIZONA BED
  // base = £250 (2ft small single, with mattress)  |  original = £300
  // WITH mattress:  ss=250, sts=260, sd=290, std=300, k=330, sk=390
  // NO  mattress:   ss=210, sts=220, sd=250, std=260, k=280, sk=300
  // ══════════════════════════════════════════════════════════════════════════
  product(
    "arizona",
    "Luxury Arizona Bed",
    "luxury-beds",
    250,
    300,
    "/all products img/Arizona/1.webp",
    {
      sizes: [
        { name: "2ft Small Single – With Mattress", extraPrice: 0 },
        { name: "3ft Standard Single – With Mattress", extraPrice: 10 },
        { name: "4ft Small Double – With Mattress", extraPrice: 40 },
        { name: "4'6ft Standard Double – With Mattress", extraPrice: 50 },
        { name: "5ft King Size – With Mattress", extraPrice: 80 },
        { name: "6ft Super King – With Mattress", extraPrice: 140 },
        { name: "2ft Small Single – No Mattress", extraPrice: -40 },
        { name: "3ft Standard Single – No Mattress", extraPrice: -30 },
        { name: "4ft Small Double – No Mattress", extraPrice: 0 },
        { name: "4'6ft Standard Double – No Mattress", extraPrice: 10 },
        { name: "5ft King Size – No Mattress", extraPrice: 30 },
        { name: "6ft Super King – No Mattress", extraPrice: 50 },
      ],
      images: [
        "/all products img/Arizona/1.webp",
        "/all products img/Arizona/2.webp",
        "/all products img/Arizona/3.webp",
        "/all products img/Arizona/4.webp",
      ],
    },
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // 3. BUNK BED
  // base = £449 (Double metal, with mattress)  |  original = £500
  // WITH: Double=449, Trio=499
  // NO:   Double=349, Trio=399
  // ══════════════════════════════════════════════════════════════════════════
  product("bunk-beds", "Bunk Bed", "ottoman-beds", 449, 500, "/all products img/Bunk beds/1.webp", {
    sizes: [
      { name: "Double Metal Bunk Bed – With Mattress", extraPrice: 0 },
      { name: "Trio Metal Bunk Beds – With Mattress", extraPrice: 50 },
      { name: "Double Metal Bunk Bed – No Mattress", extraPrice: -100 },
      { name: "Trio Metal Bunk Beds – No Mattress", extraPrice: -50 },
    ],
    colors: [
      { name: "Gray", image: "/all products img/Bunk beds/COLOUR/Gray.webp" },
      { name: "White", image: "/all products img/Bunk beds/COLOUR/White.webp" },
    ],
    fabrics: [],
    headboardOptions: [],
    storageOptions: [],
    images: [
      "/all products img/Bunk beds/1.webp",
      "/all products img/Bunk beds/2.webp",
      "/all products img/Bunk beds/3.webp",
      "/all products img/Bunk beds/4.webp",
    ],
    description:
      "Sturdy metal bunk bed, available in Double or Trio configuration. Choice of Gray or White finish.",
  }),

  // ══════════════════════════════════════════════════════════════════════════
  // 4. LUXURY DIVAN BED
  // base = £185 (2ft small single, with mattress)  |  original = £200
  // WITH: ss=185, sts=190, sd=215, std=220, k=235, sk=290 (discounted from 300)
  // NO:   ss=150, sts=155, sd=160, std=170, k=180, sk=220
  // Storage: No storage (default), 2 Drawers +£40, 4 Drawers +£70
  // Headboards: Panel Line (free), Simple Plain (free), Cube (free), Chesterfield (+£20)
  // ══════════════════════════════════════════════════════════════════════════
  product(
    "divan",
    "Luxury Divan Bed",
    "divan-beds",
    185,
    200,
    "/all products img/Divan/1 Panel line head board.webp",
    {
      sizes: [
        { name: "2ft Small Single – With Mattress", extraPrice: 0 },
        { name: "3ft Standard Single – With Mattress", extraPrice: 5 },
        { name: "4ft Small Double – With Mattress", extraPrice: 30 },
        { name: "4'6ft Standard Double – With Mattress", extraPrice: 35 },
        { name: "5ft King Size – With Mattress", extraPrice: 50 },
        { name: "6ft Super King – With Mattress", extraPrice: 105 },
        { name: "2ft Small Single – No Mattress", extraPrice: -35 },
        { name: "3ft Standard Single – No Mattress", extraPrice: -30 },
        { name: "4ft Small Double – No Mattress", extraPrice: -25 },
        { name: "4'6ft Standard Double – No Mattress", extraPrice: -15 },
        { name: "5ft King Size – No Mattress", extraPrice: -5 },
        { name: "6ft Super King – No Mattress", extraPrice: 35 },
      ],
      headboardOptions: [
        { name: "Panel Line Headboard (Free)", extraPrice: 0 },
        { name: "Simple Plain Headboard (Free)", extraPrice: 0 },
        { name: "Cube Headboard (Free)", extraPrice: 0 },
        { name: "Chesterfield Headboard", extraPrice: 20 },
      ],
      storageOptions: DIVAN_STORAGE,
      images: [
        "/all products img/Divan/1 Panel line head board.webp",
        "/all products img/Divan/2 simple plain head board.webp",
        "/all products img/Divan/3 Cube head board.webp",
        "/all products img/Divan/4 Chesterfiled head board.webp",
      ],
      description:
        "Our Luxury Divan base with custom headboard options. Choose from Panel, Simple, Cube or the premium Chesterfield design. Optional drawer storage available.",
    },
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // 5. LUXURY DIVAN OTTOMAN GAS LIFT STORAGE BED
  // base = £350 (3ft standard single, with mattress)  |  original = £400
  // WITH: sts=350, sd=400, std=410, k=440, sk=499 (includes Irish mattress 10")
  // NO:   sts=310, sd=340, std=350, k=370, sk=420
  // Headboard: Standard 45" (free), 54" headboard +£80
  // Frame: Standard, With Professional Assembly +£60
  // ══════════════════════════════════════════════════════════════════════════
  product(
    "divan-ottoman-bed",
    "Ottoman Bed",
    "ottoman-beds",
    350,
    400,
    "/all products img/Divan Ottoman bed/1.webp",
    {
      sizes: [
        { name: "3ft Standard Single – With Mattress", extraPrice: 0 },
        { name: "4ft Small Double – With Mattress", extraPrice: 50 },
        { name: "4'6ft Standard Double – With Mattress", extraPrice: 60 },
        { name: "5ft King Size – With Mattress", extraPrice: 90 },
        { name: "6ft Super King – With Mattress", extraPrice: 149 },
        { name: "3ft Standard Single – No Mattress", extraPrice: -40 },
        { name: "4ft Small Double – No Mattress", extraPrice: -10 },
        { name: "4'6ft Standard Double – No Mattress", extraPrice: 0 },
        { name: "5ft King Size – No Mattress", extraPrice: 20 },
        { name: "6ft Super King – No Mattress", extraPrice: 70 },
      ],
      headboardOptions: [
        { name: 'Standard Headboard 45" (Free)', extraPrice: 0 },
        { name: 'Tall Headboard 54"', extraPrice: 80 },
      ],
      frameOptions: [
        { name: "No Assembly", extraPrice: 0 },
        { name: "With Professional Assembly", extraPrice: 60 },
      ],
      storageOptions: [{ name: "Ottoman Gas Lift (Included)", extraPrice: 0 }],
      images: [
        "/all products img/Divan Ottoman bed/1.webp",
        "/all products img/Divan Ottoman bed/2.webp",
        "/all products img/Divan Ottoman bed/3.webp",
        "/all products img/Divan Ottoman bed/4.webp",
      ],
      description:
        'Luxury Divan Ottoman Gas Lift Storage Bed — includes Irish 10" mattress (with mattress option). Standard 45" headboard included. Professional assembly available for £60.',
    },
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // 6. LUXURY FLORIDA BED
  // base = £210 (2ft small single, with mattress)  |  original = £250
  // WITH: ss=210, sts=220, sd=240, std=250, k=270, sk=350
  // NO:   ss=175, sts=180, sd=200, std=210, k=220, sk=280
  // ══════════════════════════════════════════════════════════════════════════
  product(
    "florida-bed",
    "Luxury Florida Bed",
    "luxury-beds",
    210,
    250,
    "/all products img/Florida bed/1.webp",
    {
      sizes: [
        { name: "2ft Small Single – With Mattress", extraPrice: 0 },
        { name: "3ft Standard Single – With Mattress", extraPrice: 10 },
        { name: "4ft Small Double – With Mattress", extraPrice: 30 },
        { name: "4'6ft Standard Double – With Mattress", extraPrice: 40 },
        { name: "5ft King Size – With Mattress", extraPrice: 60 },
        { name: "6ft Super King – With Mattress", extraPrice: 140 },
        { name: "2ft Small Single – No Mattress", extraPrice: -35 },
        { name: "3ft Standard Single – No Mattress", extraPrice: -30 },
        { name: "4ft Small Double – No Mattress", extraPrice: -10 },
        { name: "4'6ft Standard Double – No Mattress", extraPrice: 0 },
        { name: "5ft King Size – No Mattress", extraPrice: 10 },
        { name: "6ft Super King – No Mattress", extraPrice: 70 },
      ],
      images: [
        "/all products img/Florida bed/1.webp",
        "/all products img/Florida bed/2.webp",
        "/all products img/Florida bed/3.webp",
        "/all products img/Florida bed/4.webp",
      ],
    },
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // 7. LUXURY GOLDEN WAVE BED
  // base = £250 (2ft small single, with mattress)  |  original = £300
  // WITH: ss=250, sts=260, sd=290, std=300, k=330, sk=390
  // NO:   ss=210, sts=220, sd=250, std=260, k=280, sk=300
  // ══════════════════════════════════════════════════════════════════════════
  product(
    "golden-wave-bed",
    "Luxury Golden Wave Bed",
    "luxury-beds",
    250,
    300,
    "/all products img/Golden wave bed/1.webp",
    {
      sizes: [
        { name: "2ft Small Single – With Mattress", extraPrice: 0 },
        { name: "3ft Standard Single – With Mattress", extraPrice: 10 },
        { name: "4ft Small Double – With Mattress", extraPrice: 40 },
        { name: "4'6ft Standard Double – With Mattress", extraPrice: 50 },
        { name: "5ft King Size – With Mattress", extraPrice: 80 },
        { name: "6ft Super King – With Mattress", extraPrice: 140 },
        { name: "2ft Small Single – No Mattress", extraPrice: -40 },
        { name: "3ft Standard Single – No Mattress", extraPrice: -30 },
        { name: "4ft Small Double – No Mattress", extraPrice: 0 },
        { name: "4'6ft Standard Double – No Mattress", extraPrice: 10 },
        { name: "5ft King Size – No Mattress", extraPrice: 30 },
        { name: "6ft Super King – No Mattress", extraPrice: 50 },
      ],
      images: [
        "/all products img/Golden wave bed/1.webp",
        "/all products img/Golden wave bed/2.webp",
        "/all products img/Golden wave bed/3.webp",
        "/all products img/Golden wave bed/4.webp",
      ],
    },
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // 8. LUXURY HILTON BED
  // base = £210 (2ft small single, with mattress)  |  original = £250
  // WITH: ss=210, sts=220, sd=240, std=250, k=270, sk=350
  // NO:   ss=175, sts=180, sd=200, std=210, k=220, sk=280
  // ══════════════════════════════════════════════════════════════════════════
  product(
    "hilton",
    "Luxury Hilton Bed",
    "luxury-beds",
    210,
    250,
    "/all products img/Hilton/1.webp",
    {
      sizes: [
        { name: "2ft Small Single – With Mattress", extraPrice: 0 },
        { name: "3ft Standard Single – With Mattress", extraPrice: 10 },
        { name: "4ft Small Double – With Mattress", extraPrice: 30 },
        { name: "4'6ft Standard Double – With Mattress", extraPrice: 40 },
        { name: "5ft King Size – With Mattress", extraPrice: 60 },
        { name: "6ft Super King – With Mattress", extraPrice: 140 },
        { name: "2ft Small Single – No Mattress", extraPrice: -35 },
        { name: "3ft Standard Single – No Mattress", extraPrice: -30 },
        { name: "4ft Small Double – No Mattress", extraPrice: -10 },
        { name: "4'6ft Standard Double – No Mattress", extraPrice: 0 },
        { name: "5ft King Size – No Mattress", extraPrice: 10 },
        { name: "6ft Super King – No Mattress", extraPrice: 70 },
      ],
      images: [
        "/all products img/Hilton/1.webp",
        "/all products img/Hilton/2.webp",
        "/all products img/Hilton/3.webp",
        "/all products img/Hilton/4.webp",
      ],
    },
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // 9. LUXURY CUBE BED
  // base = £210 (2ft small single, with mattress)  |  original = £250
  // (same pricing tier as Florida/Hilton/Panel Line/Bumper/Wing Back)
  // ══════════════════════════════════════════════════════════════════════════
  product(
    "luxury-cube-bed",
    "Luxury Cube Bed",
    "luxury-beds",
    210,
    250,
    "/all products img/Luxury Cube bed/1.webp",
    {
      sizes: [
        { name: "2ft Small Single – With Mattress", extraPrice: 0 },
        { name: "3ft Standard Single – With Mattress", extraPrice: 10 },
        { name: "4ft Small Double – With Mattress", extraPrice: 30 },
        { name: "4'6ft Standard Double – With Mattress", extraPrice: 40 },
        { name: "5ft King Size – With Mattress", extraPrice: 60 },
        { name: "6ft Super King – With Mattress", extraPrice: 140 },
        { name: "2ft Small Single – No Mattress", extraPrice: -35 },
        { name: "3ft Standard Single – No Mattress", extraPrice: -30 },
        { name: "4ft Small Double – No Mattress", extraPrice: -10 },
        { name: "4'6ft Standard Double – No Mattress", extraPrice: 0 },
        { name: "5ft King Size – No Mattress", extraPrice: 10 },
        { name: "6ft Super King – No Mattress", extraPrice: 70 },
      ],
      images: [
        "/all products img/Luxury Cube bed/1.webp",
        "/all products img/Luxury Cube bed/2.webp",
        "/all products img/Luxury Cube bed/3.webp",
        "/all products img/Luxury Cube bed/4.webp",
      ],
    },
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // 10. LUXURY OXFORD WINGBACK BED
  // base = £250 (2ft small single, with mattress)  |  original = £300
  // WITH: ss=250, sts=260, sd=290, std=300, k=330, sk=390
  // NO:   ss=210, sts=220, sd=250, std=260, k=280, sk=300
  // ══════════════════════════════════════════════════════════════════════════
  product(
    "oxford-wingback",
    "Luxury Oxford Wingback Bed",
    "luxury-beds",
    250,
    300,
    "/all products img/Oxford Wingback/1.webp",
    {
      sizes: [
        { name: "2ft Small Single – With Mattress", extraPrice: 0 },
        { name: "3ft Standard Single – With Mattress", extraPrice: 10 },
        { name: "4ft Small Double – With Mattress", extraPrice: 40 },
        { name: "4'6ft Standard Double – With Mattress", extraPrice: 50 },
        { name: "5ft King Size – With Mattress", extraPrice: 80 },
        { name: "6ft Super King – With Mattress", extraPrice: 140 },
        { name: "2ft Small Single – No Mattress", extraPrice: -40 },
        { name: "3ft Standard Single – No Mattress", extraPrice: -30 },
        { name: "4ft Small Double – No Mattress", extraPrice: 0 },
        { name: "4'6ft Standard Double – No Mattress", extraPrice: 10 },
        { name: "5ft King Size – No Mattress", extraPrice: 30 },
        { name: "6ft Super King – No Mattress", extraPrice: 50 },
      ],
      images: [
        "/all products img/Oxford Wingback/1.webp",
        "/all products img/Oxford Wingback/2.webp",
        "/all products img/Oxford Wingback/3.webp",
        "/all products img/Oxford Wingback/4.webp",
      ],
    },
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // 11. LUXURY PANEL LINE BED
  // base = £210 (2ft small single, with mattress)  |  original = £250
  // WITH: ss=210, sts=220, sd=240, std=250, k=270, sk=350
  // NO:   ss=175, sts=180, sd=200, std=210, k=220, sk=280
  // ══════════════════════════════════════════════════════════════════════════
  product(
    "panel-line",
    "Luxury Panel Line Bed",
    "luxury-beds",
    210,
    250,
    "/all products img/Panel Line/1.webp",
    {
      sizes: [
        { name: "2ft Small Single – With Mattress", extraPrice: 0 },
        { name: "3ft Standard Single – With Mattress", extraPrice: 10 },
        { name: "4ft Small Double – With Mattress", extraPrice: 30 },
        { name: "4'6ft Standard Double – With Mattress", extraPrice: 40 },
        { name: "5ft King Size – With Mattress", extraPrice: 60 },
        { name: "6ft Super King – With Mattress", extraPrice: 140 },
        { name: "2ft Small Single – No Mattress", extraPrice: -35 },
        { name: "3ft Standard Single – No Mattress", extraPrice: -30 },
        { name: "4ft Small Double – No Mattress", extraPrice: -10 },
        { name: "4'6ft Standard Double – No Mattress", extraPrice: 0 },
        { name: "5ft King Size – No Mattress", extraPrice: 10 },
        { name: "6ft Super King – No Mattress", extraPrice: 70 },
      ],
      images: [
        "/all products img/Panel Line/1.webp",
        "/all products img/Panel Line/2.webp",
        "/all products img/Panel Line/3.webp",
        "/all products img/Panel Line/aiwatermarkremover_be829fcc2ddf69fa20c08c939c63482c.webp",
      ],
    },
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // 12. LUXURY PANEL LINE BUMPER BED
  // base = £210 (2ft small single, with mattress)  |  original = £250
  // ══════════════════════════════════════════════════════════════════════════
  product(
    "panel-line-bumper",
    "Luxury Panel Line Bumper Bed",
    "luxury-beds",
    210,
    250,
    "/all products img/Panel line bumper/1.webp",
    {
      sizes: [
        { name: "2ft Small Single – With Mattress", extraPrice: 0 },
        { name: "3ft Standard Single – With Mattress", extraPrice: 10 },
        { name: "4ft Small Double – With Mattress", extraPrice: 30 },
        { name: "4'6ft Standard Double – With Mattress", extraPrice: 40 },
        { name: "5ft King Size – With Mattress", extraPrice: 60 },
        { name: "6ft Super King – With Mattress", extraPrice: 140 },
        { name: "2ft Small Single – No Mattress", extraPrice: -35 },
        { name: "3ft Standard Single – No Mattress", extraPrice: -30 },
        { name: "4ft Small Double – No Mattress", extraPrice: -10 },
        { name: "4'6ft Standard Double – No Mattress", extraPrice: 0 },
        { name: "5ft King Size – No Mattress", extraPrice: 10 },
        { name: "6ft Super King – No Mattress", extraPrice: 70 },
      ],
      images: [
        "/all products img/Panel line bumper/1.webp",
        "/all products img/Panel line bumper/2.webp",
        "/all products img/Panel line bumper/3.webp",
        "/all products img/Panel line bumper/1000154119-clean.webp",
      ],
    },
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // 13. LUXURY PANEL LINE GOLD STRIP BED
  // base = £250 (2ft small single, with mattress)  |  original = £300
  // WITH: ss=250, sts=260, sd=290, std=300, k=330, sk=390
  // NO:   ss=210, sts=220, sd=250, std=260, k=280, sk=300
  // ══════════════════════════════════════════════════════════════════════════
  product(
    "panel-line-gold-strip",
    "Luxury Panel Line Gold Strip Bed",
    "luxury-beds",
    250,
    300,
    "/all products img/Panel line gold strip/1.webp",
    {
      sizes: [
        { name: "2ft Small Single – With Mattress", extraPrice: 0 },
        { name: "3ft Standard Single – With Mattress", extraPrice: 10 },
        { name: "4ft Small Double – With Mattress", extraPrice: 40 },
        { name: "4'6ft Standard Double – With Mattress", extraPrice: 50 },
        { name: "5ft King Size – With Mattress", extraPrice: 80 },
        { name: "6ft Super King – With Mattress", extraPrice: 140 },
        { name: "2ft Small Single – No Mattress", extraPrice: -40 },
        { name: "3ft Standard Single – No Mattress", extraPrice: -30 },
        { name: "4ft Small Double – No Mattress", extraPrice: 0 },
        { name: "4'6ft Standard Double – No Mattress", extraPrice: 10 },
        { name: "5ft King Size – No Mattress", extraPrice: 30 },
        { name: "6ft Super King – No Mattress", extraPrice: 50 },
      ],
      images: [
        "/all products img/Panel line gold strip/1.webp",
        "/all products img/Panel line gold strip/2.webp",
        "/all products img/Panel line gold strip/3.webp",
        "/all products img/Panel line gold strip/4.webp",
      ],
    },
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // 14. LUXURY PANEL WING BACK BED
  // base = £210 (2ft small single, with mattress)  |  original = £250
  // ══════════════════════════════════════════════════════════════════════════
  product(
    "panel-wing-back",
    "Luxury Panel Wing Back Bed",
    "luxury-beds",
    210,
    250,
    "/all products img/Panel wing back/1.webp",
    {
      sizes: [
        { name: "2ft Small Single – With Mattress", extraPrice: 0 },
        { name: "3ft Standard Single – With Mattress", extraPrice: 10 },
        { name: "4ft Small Double – With Mattress", extraPrice: 30 },
        { name: "4'6ft Standard Double – With Mattress", extraPrice: 40 },
        { name: "5ft King Size – With Mattress", extraPrice: 60 },
        { name: "6ft Super King – With Mattress", extraPrice: 140 },
        { name: "2ft Small Single – No Mattress", extraPrice: -35 },
        { name: "3ft Standard Single – No Mattress", extraPrice: -30 },
        { name: "4ft Small Double – No Mattress", extraPrice: -10 },
        { name: "4'6ft Standard Double – No Mattress", extraPrice: 0 },
        { name: "5ft King Size – No Mattress", extraPrice: 10 },
        { name: "6ft Super King – No Mattress", extraPrice: 70 },
      ],
      images: [
        "/all products img/Panel wing back/1.webp",
        "/all products img/Panel wing back/2.webp",
        "/all products img/Panel wing back/3.webp",
        "/all products img/Panel wing back/4.webp",
      ],
    },
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // 15. LUXURY SLEIGH BED
  // base = £250 (2ft small single, with mattress)  |  original = £300
  // WITH: ss=250, sts=260, sd=290, std=300, k=330, sk=390
  // NO:   ss=210, sts=220, sd=250, std=260, k=280, sk=300
  // ══════════════════════════════════════════════════════════════════════════
  product(
    "sleigh",
    "Luxury Sleigh Bed",
    "luxury-beds",
    250,
    300,
    "/all products img/Sleigh/1.webp",
    {
      sizes: [
        { name: "2ft Small Single – With Mattress", extraPrice: 0 },
        { name: "3ft Standard Single – With Mattress", extraPrice: 10 },
        { name: "4ft Small Double – With Mattress", extraPrice: 40 },
        { name: "4'6ft Standard Double – With Mattress", extraPrice: 50 },
        { name: "5ft King Size – With Mattress", extraPrice: 80 },
        { name: "6ft Super King – With Mattress", extraPrice: 140 },
        { name: "2ft Small Single – No Mattress", extraPrice: -40 },
        { name: "3ft Standard Single – No Mattress", extraPrice: -30 },
        { name: "4ft Small Double – No Mattress", extraPrice: 0 },
        { name: "4'6ft Standard Double – No Mattress", extraPrice: 10 },
        { name: "5ft King Size – No Mattress", extraPrice: 30 },
        { name: "6ft Super King – No Mattress", extraPrice: 50 },
      ],
      images: [
        "/all products img/Sleigh/1.webp",
        "/all products img/Sleigh/2.webp",
        "/all products img/Sleigh/3.webp",
        "/all products img/Sleigh/4.webp",
      ],
    },
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // 16. ALINA WARDROBE
  // base = £150 (2 door plain, auto-selected) | original = £220
  // ══════════════════════════════════════════════════════════════════════════
  product(
    "alina-wardrobe",
    "Alina Wardrobe",
    "wardrobes",
    150,
    220,
    "/Wardrobes/alina-wardrobe-main.webp",
    {
      sizes: [
        { name: "2 Door Plain Wardrobe", extraPrice: 0 },
        { name: "2 Door Male 2 Drawers Wardrobe", extraPrice: 10 },
        { name: "2 Door Lady 1 Mirror Wardrobe", extraPrice: 20 },
        { name: "2 Door 2 Drawers 1 Mirror Wardrobe", extraPrice: 30 },
        { name: "2 Door 2 Mirrors and 2 Drawers", extraPrice: 50 },
        { name: "2 Door 1 Mirror, 1 Chest, 1 Bedside Full Set", extraPrice: 120 },
        { name: "2 Door Without Mirror Full Set", extraPrice: 90 },
        { name: "2 Door 2 Drawer Without Mirror Full Set", extraPrice: 110 },
        { name: "3 Door Plain Wardrobe", extraPrice: 70 },
        { name: "3 Door 2 Drawers Wardrobe", extraPrice: 90 },
        { name: "3 Door 1 Mirror Wardrobe", extraPrice: 100 },
        { name: "3 Door 3 Drawers and 1 Mirror", extraPrice: 120 },
        { name: "3 Door Plain Wardrobe Full Set (Chest + Bedside)", extraPrice: 200 },
        { name: "3 Door 2 Drawer 1 Mirror Full Set (Chest + Bedside)", extraPrice: 249 },
        { name: "4 Door 4 Drawers and 2 Mirrors", extraPrice: 170 },
        { name: "4 Door With 1 Chest + 1 Bedside Full Set", extraPrice: 240 },
        { name: "4 Door 4 Drawer With 1 Chest + 1 Bedside Full Set", extraPrice: 220 },
        { name: "5 Door 2 Mirrors 4 Drawers", extraPrice: 249 },
        { name: "6 Door 2 Drawers and 2 Mirrors", extraPrice: 260 },
        { name: "8 Door 4 Mirrors 6 Drawers", extraPrice: 400 },
      ],
      frameOptions: [
        { name: "No Additional Options", extraPrice: 0 },
        { name: "Additional Mirror", extraPrice: 15 },
        { name: "Additional Drawer", extraPrice: 15 },
        { name: "Bedside Table (with wardrobe)", extraPrice: 40 },
        { name: "Chest of Drawers (with wardrobe)", extraPrice: 100 },
      ],
      images: [
        "/Wardrobes/alina-wardrobe-main.webp",
        "/Wardrobes/alina-wardrobe-gallery-1.webp",
        "/Wardrobes/alina-wardrobe-gallery-2.webp",
        "/Wardrobes/alina-wardrobe-gallery-3.webp",
      ],
      description:
        "The Alina Wardrobe offers versatile storage with multiple door and drawer configurations. From compact 2-door units to massive 8-door sets, customize it with mirrors and chests to fit your room perfectly. British craftsmanship starting at just £130.",
      storageOptions: [],
      headboardOptions: [],
      mattressOptions: [],
      fabrics: [],
      colors: [
        { name: "White", hex: "#FFFFFF" },
        { name: "Grey", hex: "#808080" },
        { name: "Black", hex: "#1A1A1A" },
        { name: "Oak", hex: "#A08151" },
      ],
    },
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // 17. SLIDING WARDROBE
  // base = £260 (100cm, auto-selected) | original = £320
  // ══════════════════════════════════════════════════════════════════════════
  product(
    "sliding-wardrobe",
    "Sliding Wardrobe",
    "sliding-wardrobes",
    260,
    320,
    "/Sliding wardrobe/sliding-wardrobe-main.webp",
    {
      sizes: [
        { name: "100cm Sliding Wardrobe", extraPrice: 0 },
        { name: "120cm Sliding Wardrobe", extraPrice: 20 },
        { name: "150cm Sliding Wardrobe", extraPrice: 39 },
        { name: "180cm Sliding Wardrobe", extraPrice: 60 },
        { name: "203cm Sliding Wardrobe", extraPrice: 90 },
        { name: "250cm Sliding Wardrobe", extraPrice: 190 },
      ],
      frameOptions: [
        { name: "No Assembly", extraPrice: 0 },
        { name: "Professional Assembly", extraPrice: 70 }, // This will be calculated dynamically in UI
      ],
      images: [
        "/Sliding wardrobe/sliding-wardrobe-main.webp",
        "/Sliding wardrobe/sliding-wardrobe-gallery-1.webp",
        "/Sliding wardrobe/sliding-wardrobe-gallery-2.webp",
        "/Sliding wardrobe/sliding-wardrobe-gallery-3.webp",
      ],
      description:
        "Modern Sliding Wardrobe with glass or mirror accents. A perfect space-saver for contemporary bedrooms. Available in widths from 100cm to 250cm with optional professional assembly.",
      storageOptions: [],
      headboardOptions: [],
      mattressOptions: [],
      fabrics: [],
      colors: [
        { name: "White", hex: "#FFFFFF" },
        { name: "Grey", hex: "#808080" },
        { name: "Black", hex: "#1A1A1A" },
        { name: "Oak", hex: "#A08151" },
      ],
    },
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // ALASKA SOFA
  // ══════════════════════════════════════════════════════════════════════════
  product(
    "alaska-sofa",
    "Alaska Sofa",
    "sofas",
    280,
    310,
    "/Sofas/Alaska Sofaa/alaska-sofa-main.webp",
    {
      sizes: [
        { name: "1 seater", extraPrice: 0 },
        { name: "2 seater", extraPrice: 30 },
        { name: "3 seater", extraPrice: 70 },
        { name: "4 seater", extraPrice: 250 },
        { name: "5 seater", extraPrice: 250 },
        { name: "2+3 seater", extraPrice: 260 },
      ],
      frameOptions: [
        { name: "No Additional Options", extraPrice: 0 },
        { name: "Footstool", extraPrice: 120 },
        { name: "High back", extraPrice: 40 },
        { name: "Professional Assembly", extraPrice: 80 },
        { name: "Chrome legs", extraPrice: 50 },
      ],
      images: [
        "/Sofas/Alaska Sofaa/alaska-sofa-main.webp",
        "/Sofas/Alaska Sofaa/alaska-sofa-gallery-1.webp",
        "/Sofas/Alaska Sofaa/alaska-sofa-gallery-2.webp",
        "/Sofas/Alaska Sofaa/alaska-sofa-gallery-3.webp",
      ],
      description: "Premium handcrafted Alaska Sofa, customized for luxury and comfort.",
      storageOptions: [],
      headboardOptions: [],
      mattressOptions: [],
      fabrics: [],
      colors: [
        { name: "White", image: "/COLOR/plush velvet/White.webp" },
        { name: "Grey", image: "/COLOR/plush velvet/Grey.webp" },
        { name: "Black", image: "/COLOR/plush velvet/Black.webp" },
        { name: "Oak", hex: "#A08151" },
      ],
    },
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // ASHTON SOFA
  // ══════════════════════════════════════════════════════════════════════════
  product(
    "ashton-sofa",
    "Ashton Sofa",
    "sofas",
    300,
    350,
    "/Sofas/Ashton Sofa/ashton-sofa-main.webp",
    {
      sizes: [
        { name: "1 seater", extraPrice: 0 },
        { name: "2 seater", extraPrice: 30 },
        { name: "3 seater", extraPrice: 80 },
        { name: "4 seater", extraPrice: 260 },
        { name: "5 seater", extraPrice: 270 },
        { name: "2+3 seater", extraPrice: 280 },
      ],
      frameOptions: [
        { name: "No Additional Options", extraPrice: 0 },
        { name: "Footstool", extraPrice: 120 },
        { name: "High back", extraPrice: 60 },
        { name: "Professional Assembly", extraPrice: 80 },
        { name: "Chrome legs", extraPrice: 50 },
      ],
      images: [
        "/Sofas/Ashton Sofa/ashton-sofa-main.webp",
        "/Sofas/Ashton Sofa/ashton-sofa-gallery-1.webp",
        "/Sofas/Ashton Sofa/ashton-sofa-gallery-2.webp",
        "/Sofas/Ashton Sofa/ashton-sofa-gallery-3.webp",
      ],
      description: "Premium handcrafted Ashton Sofa, customized for luxury and comfort.",
      storageOptions: [],
      headboardOptions: [],
      mattressOptions: [],
      fabrics: [],
      colors: [
        { name: "White", image: "/COLOR/plush velvet/White.webp" },
        { name: "Grey", image: "/COLOR/plush velvet/Grey.webp" },
        { name: "Black", image: "/COLOR/plush velvet/Black.webp" },
        { name: "Oak", hex: "#A08151" },
      ],
    },
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // BERLIN SOFA BED
  // ══════════════════════════════════════════════════════════════════════════
  product(
    "berlin-sofa-bed",
    "Berlin Sofa bed",
    "sofas",
    380,
    400,
    "/Sofas/Berlin Sofa Bed/berlin-sofa-bed-main.webp",
    {
      sizes: [{ name: "1 seater", extraPrice: 0 }],
      frameOptions: [
        { name: "No Additional Options", extraPrice: 0 },
        { name: "Professional Assembly", extraPrice: 80 },
        { name: "Chrome legs", extraPrice: 50 },
      ],
      images: [
        "/Sofas/Berlin Sofa Bed/berlin-sofa-bed-main.webp",
        "/Sofas/Berlin Sofa Bed/berlin-sofa-bed-gallery-1.webp",
        "/Sofas/Berlin Sofa Bed/berlin-sofa-bed-gallery-2.webp",
        "/Sofas/Berlin Sofa Bed/berlin-sofa-bed-gallery-3.webp",
      ],
      description: "Premium handcrafted Berlin Sofa bed, customized for luxury and comfort.",
      storageOptions: [],
      headboardOptions: [],
      mattressOptions: [],
      fabrics: [],
      colors: [
        { name: "White", image: "/COLOR/plush velvet/White.webp" },
        { name: "Grey", image: "/COLOR/plush velvet/Grey.webp" },
        { name: "Black", image: "/COLOR/plush velvet/Black.webp" },
        { name: "Oak", hex: "#A08151" },
      ],
    },
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // CHESTERFIELD SOFA
  // ══════════════════════════════════════════════════════════════════════════
  product(
    "chesterfield-sofa",
    "Chesterfield Sofa",
    "sofas",
    370,
    400,
    "/Sofas/Chesterfield Sofa/chesterfield-sofa-main.webp",
    {
      sizes: [
        { name: "1 seater", extraPrice: 0 },
        { name: "2 seater", extraPrice: 100 },
        { name: "3 seater", extraPrice: 160 },
        { name: "5 seater", extraPrice: 560 },
        { name: "2+3 seater", extraPrice: 570 },
      ],
      frameOptions: [
        { name: "No Additional Options", extraPrice: 0 },
        { name: "Footstool", extraPrice: 150 },
        { name: "High back", extraPrice: 60 },
        { name: "Professional Assembly", extraPrice: 80 },
        { name: "Chrome legs", extraPrice: 50 },
      ],
      images: [
        "/Sofas/Chesterfield Sofa/chesterfield-sofa-main.webp",
        "/Sofas/Chesterfield Sofa/chesterfield-sofa-gallery-1.webp",
        "/Sofas/Chesterfield Sofa/chesterfield-sofa-gallery-2.webp",
        "/Sofas/Chesterfield Sofa/chesterfield-sofa-gallery-3.webp",
      ],
      description: "Premium handcrafted Chesterfield Sofa, customized for luxury and comfort.",
      storageOptions: [],
      headboardOptions: [],
      mattressOptions: [],
      fabrics: [],
      colors: [
        { name: "White", image: "/COLOR/plush velvet/White.webp" },
        { name: "Grey", image: "/COLOR/plush velvet/Grey.webp" },
        { name: "Black", image: "/COLOR/plush velvet/Black.webp" },
        { name: "Oak", hex: "#A08151" },
      ],
    },
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // DIAMONTEE SOFA
  // ══════════════════════════════════════════════════════════════════════════
  product(
    "diamontee-sofa",
    "Diamontee Sofa",
    "sofas",
    280,
    300,
    "/Sofas/Diamontee sofa/diamontee-sofa-main.webp",
    {
      sizes: [
        { name: "1 seater", extraPrice: 0 },
        { name: "2 seater", extraPrice: 30 },
        { name: "3 seater", extraPrice: 80 },
        { name: "4 seater", extraPrice: 250 },
        { name: "5 seater", extraPrice: 260 },
        { name: "2+3 seater", extraPrice: 280 },
      ],
      frameOptions: [
        { name: "No Additional Options", extraPrice: 0 },
        { name: "Footstool", extraPrice: 120 },
        { name: "High back", extraPrice: 60 },
        { name: "Professional Assembly", extraPrice: 80 },
        { name: "Chrome legs", extraPrice: 50 },
      ],
      images: [
        "/Sofas/Diamontee sofa/diamontee-sofa-main.webp",
        "/Sofas/Diamontee sofa/diamontee-sofa-gallery-1.webp",
        "/Sofas/Diamontee sofa/diamontee-sofa-gallery-2.webp",
      ],
      description: "Premium handcrafted Diamontee Sofa, customized for luxury and comfort.",
      storageOptions: [],
      headboardOptions: [],
      mattressOptions: [],
      fabrics: [],
      colors: [
        { name: "White", image: "/COLOR/plush velvet/White.webp" },
        { name: "Grey", image: "/COLOR/plush velvet/Grey.webp" },
        { name: "Black", image: "/COLOR/plush velvet/Black.webp" },
        { name: "Oak", hex: "#A08151" },
      ],
    },
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // DINO SOFA
  // ══════════════════════════════════════════════════════════════════════════
  product("dino-sofa", "Dino Sofa", "sofas", 280, 320, "/Sofas/Dino sofa/dino-sofa-main.webp", {
    sizes: [
      { name: "1 seater", extraPrice: 0 },
      { name: "2 seater", extraPrice: 30 },
      { name: "3 seater", extraPrice: 70 },
      { name: "5 seater", extraPrice: 210 },
      { name: "2+3 seater", extraPrice: 220 },
    ],
    frameOptions: [
      { name: "No Additional Options", extraPrice: 0 },
      { name: "Footstool", extraPrice: 120 },
      { name: "High back", extraPrice: 60 },
      { name: "Professional Assembly", extraPrice: 80 },
      { name: "Chrome legs", extraPrice: 50 },
    ],
    images: [
      "/Sofas/Dino sofa/dino-sofa-main.webp",
      "/Sofas/Dino sofa/dino-sofa-gallery-1.webp",
      "/Sofas/Dino sofa/dino-sofa-gallery-2.webp",
      "/Sofas/Dino sofa/dino-sofa-gallery-3.webp",
    ],
    description: "Premium handcrafted Dino Sofa, customized for luxury and comfort.",
    storageOptions: [],
    headboardOptions: [],
    mattressOptions: [],
    fabrics: [],
    colors: [
      { name: "White", image: "/COLOR/plush velvet/White.webp" },
      { name: "Grey", image: "/COLOR/plush velvet/Grey.webp" },
      { name: "Black", image: "/COLOR/plush velvet/Black.webp" },
      { name: "Oak", hex: "#A08151" },
    ],
  }),

  // ══════════════════════════════════════════════════════════════════════════
  // DYLAN SOFA
  // ══════════════════════════════════════════════════════════════════════════
  product("dylan-sofa", "Dylan Sofa", "sofas", 185, 220, "/Sofas/Dylan Sofa/dylan-sofa-main.webp", {
    sizes: [
      { name: "1 seater", extraPrice: 0 },
      { name: "2 seater", extraPrice: 20 },
      { name: "3 seater", extraPrice: 40 },
      { name: "4 seater", extraPrice: 130 },
      { name: "5 seater", extraPrice: 165 },
      { name: "2+3 seater", extraPrice: 140 },
    ],
    frameOptions: [
      { name: "No Additional Options", extraPrice: 0 },
      { name: "High back", extraPrice: 60 },
      { name: "Professional Assembly", extraPrice: 80 },
      { name: "Chrome legs", extraPrice: 50 },
    ],
    images: [
      "/Sofas/Dylan Sofa/dylan-sofa-main.webp",
      "/Sofas/Dylan Sofa/dylan-sofa-gallery-1.webp",
      "/Sofas/Dylan Sofa/dylan-sofa-gallery-2.webp",
      "/Sofas/Dylan Sofa/dylan-sofa-gallery-3.webp",
    ],
    description: "Premium handcrafted Dylan Sofa, customized for luxury and comfort.",
    storageOptions: [],
    headboardOptions: [],
    mattressOptions: [],
    fabrics: [],
    colors: [
      { name: "White", image: "/COLOR/plush velvet/White.webp" },
      { name: "Grey", image: "/COLOR/plush velvet/Grey.webp" },
      { name: "Black", image: "/COLOR/plush velvet/Black.webp" },
      { name: "Oak", hex: "#A08151" },
    ],
  }),

  // ══════════════════════════════════════════════════════════════════════════
  // HARRISON SOFA
  // ══════════════════════════════════════════════════════════════════════════
  product(
    "harrison-sofa",
    "Harrison Sofa",
    "sofas",
    310,
    350,
    "/Sofas/Harrison Sofa/harrison-sofa-main.webp",
    {
      sizes: [
        { name: "1 seater", extraPrice: 0 },
        { name: "2 seater", extraPrice: 40 },
        { name: "3 seater", extraPrice: 110 },
        { name: "4 seater", extraPrice: 230 },
        { name: "5 seater", extraPrice: 250 },
      ],
      frameOptions: [
        { name: "No Additional Options", extraPrice: 0 },
        { name: "Footstool", extraPrice: 120 },
        { name: "High back", extraPrice: 60 },
        { name: "Professional Assembly", extraPrice: 80 },
        { name: "Chrome legs", extraPrice: 50 },
      ],
      images: [
        "/Sofas/Harrison Sofa/harrison-sofa-main.webp",
        "/Sofas/Harrison Sofa/harrison-sofa-gallery-1.webp",
        "/Sofas/Harrison Sofa/harrison-sofa-gallery-2.webp",
        "/Sofas/Harrison Sofa/harrison-sofa-gallery-3.webp",
      ],
      description: "Premium handcrafted Harrison Sofa, customized for luxury and comfort.",
      storageOptions: [],
      headboardOptions: [],
      mattressOptions: [],
      fabrics: [],
      colors: [
        { name: "White", image: "/COLOR/plush velvet/White.webp" },
        { name: "Grey", image: "/COLOR/plush velvet/Grey.webp" },
        { name: "Black", image: "/COLOR/plush velvet/Black.webp" },
        { name: "Oak", hex: "#A08151" },
      ],
    },
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // LILY SOFA
  // ══════════════════════════════════════════════════════════════════════════
  product("lily-sofa", "Lily Sofa", "sofas", 310, 350, "/Sofas/Lily Sofa/lily-sofa-main.webp", {
    sizes: [
      { name: "1 seater", extraPrice: 0 },
      { name: "2 seater", extraPrice: 70 },
      { name: "3 seater", extraPrice: 100 },
      { name: "4 seater", extraPrice: 260 },
      { name: "5 seater", extraPrice: 310 },
      { name: "2+3 seater", extraPrice: 330 },
    ],
    frameOptions: [
      { name: "No Additional Options", extraPrice: 0 },
      { name: "Footstool", extraPrice: 120 },
      { name: "High back", extraPrice: 60 },
      { name: "Professional Assembly", extraPrice: 80 },
      { name: "Chrome legs", extraPrice: 50 },
    ],
    images: [
      "/Sofas/Lily Sofa/lily-sofa-main.webp",
      "/Sofas/Lily Sofa/lily-sofa-gallery-1.webp",
      "/Sofas/Lily Sofa/lily-sofa-gallery-2.webp",
      "/Sofas/Lily Sofa/lily-sofa-gallery-3.webp",
    ],
    description: "Premium handcrafted Lily Sofa, customized for luxury and comfort.",
    storageOptions: [],
    headboardOptions: [],
    mattressOptions: [],
    fabrics: [],
    colors: [
      { name: "White", image: "/COLOR/plush velvet/White.webp" },
      { name: "Grey", image: "/COLOR/plush velvet/Grey.webp" },
      { name: "Black", image: "/COLOR/plush velvet/Black.webp" },
      { name: "Oak", hex: "#A08151" },
    ],
  }),

  // ══════════════════════════════════════════════════════════════════════════
  // LUCCA & ANTON SOFA BED
  // ══════════════════════════════════════════════════════════════════════════
  product(
    "lucca-anton-sofa-bed",
    "Lucca & Anton Sofa Bed",
    "sofas",
    650,
    700,
    "/Sofas/Lucca & Anton Sofa Bed/lucca-anton-sofa-bed-main.webp",
    {
      sizes: [{ name: "1 seater", extraPrice: 0 }],
      frameOptions: [
        { name: "No Additional Options", extraPrice: 0 },
        { name: "Footstool", extraPrice: 120 },
        { name: "High back", extraPrice: 60 },
        { name: "Professional Assembly", extraPrice: 80 },
        { name: "Chrome legs", extraPrice: 50 },
      ],
      images: [
        "/Sofas/Lucca & Anton Sofa Bed/lucca-anton-sofa-bed-main.webp",
        "/Sofas/Lucca & Anton Sofa Bed/lucca-anton-sofa-bed-gallery-1.webp",
        "/Sofas/Lucca & Anton Sofa Bed/lucca-anton-sofa-bed-gallery-2.webp",
        "/Sofas/Lucca & Anton Sofa Bed/lucca-anton-sofa-bed-gallery-3.webp",
      ],
      description: "Premium handcrafted Lucca & Anton Sofa Bed, customized for luxury and comfort.",
      storageOptions: [],
      headboardOptions: [],
      mattressOptions: [],
      fabrics: [],
      colors: [
        { name: "White", image: "/COLOR/plush velvet/White.webp" },
        { name: "Grey", image: "/COLOR/plush velvet/Grey.webp" },
        { name: "Black", image: "/COLOR/plush velvet/Black.webp" },
        { name: "Oak", hex: "#A08151" },
      ],
    },
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // MAYA SOFA
  // ══════════════════════════════════════════════════════════════════════════
  product("maya-sofa", "Maya sofa", "sofas", 280, 320, "/Sofas/Maya Sofa/maya-sofa-main.webp", {
    sizes: [
      { name: "1 seater", extraPrice: 0 },
      { name: "2 seater", extraPrice: 30 },
      { name: "3 seater", extraPrice: 80 },
      { name: "4 seater", extraPrice: 250 },
      { name: "5 seater", extraPrice: 260 },
      { name: "2+3 seater", extraPrice: 270 },
    ],
    frameOptions: [
      { name: "No Additional Options", extraPrice: 0 },
      { name: "Footstool", extraPrice: 120 },
      { name: "High back", extraPrice: 60 },
      { name: "Professional Assembly", extraPrice: 80 },
      { name: "Chrome legs", extraPrice: 50 },
    ],
    images: [
      "/Sofas/Maya Sofa/maya-sofa-main.webp",
      "/Sofas/Maya Sofa/maya-sofa-gallery-1.webp",
      "/Sofas/Maya Sofa/maya-sofa-gallery-2.webp",
      "/Sofas/Maya Sofa/maya-sofa-gallery-3.webp",
    ],
    description: "Premium handcrafted Maya sofa, customized for luxury and comfort.",
    storageOptions: [],
    headboardOptions: [],
    mattressOptions: [],
    fabrics: [],
    colors: [
      { name: "White", image: "/COLOR/plush velvet/White.webp" },
      { name: "Grey", image: "/COLOR/plush velvet/Grey.webp" },
      { name: "Black", image: "/COLOR/plush velvet/Black.webp" },
      { name: "Oak", hex: "#A08151" },
    ],
  }),

  // ══════════════════════════════════════════════════════════════════════════
  // OLYMPIA SOFA
  // ══════════════════════════════════════════════════════════════════════════
  product(
    "olympia-sofa",
    "Olympia sofa",
    "sofas",
    280,
    320,
    "/Sofas/Olympia Sofa/olympia-sofa-main.webp",
    {
      sizes: [
        { name: "1 seater", extraPrice: 0 },
        { name: "2 seater", extraPrice: 30 },
        { name: "3 seater", extraPrice: 80 },
        { name: "4 seater", extraPrice: 250 },
        { name: "5 seater", extraPrice: 260 },
        { name: "2+3 seater", extraPrice: 270 },
      ],
      frameOptions: [
        { name: "No Additional Options", extraPrice: 0 },
        { name: "Footstool", extraPrice: 120 },
        { name: "High back", extraPrice: 60 },
        { name: "Professional Assembly", extraPrice: 80 },
        { name: "Chrome legs", extraPrice: 50 },
      ],
      images: [
        "/Sofas/Olympia Sofa/olympia-sofa-main.webp",
        "/Sofas/Olympia Sofa/olympia-sofa-gallery-1.webp",
        "/Sofas/Olympia Sofa/olympia-sofa-gallery-2.webp",
        "/Sofas/Olympia Sofa/olympia-sofa-gallery-3.webp",
      ],
      description: "Premium handcrafted Olympia sofa, customized for luxury and comfort.",
      storageOptions: [],
      headboardOptions: [],
      mattressOptions: [],
      fabrics: [],
      colors: [
        { name: "White", image: "/COLOR/plush velvet/White.webp" },
        { name: "Grey", image: "/COLOR/plush velvet/Grey.webp" },
        { name: "Black", image: "/COLOR/plush velvet/Black.webp" },
        { name: "Oak", hex: "#A08151" },
      ],
    },
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // SHANON SOFA
  // ══════════════════════════════════════════════════════════════════════════
  product(
    "shanon-sofa",
    "Shanon Sofa",
    "sofas",
    280,
    320,
    "/Sofas/Shanon Sofa/shanon-sofa-main.webp",
    {
      sizes: [
        { name: "1 seater", extraPrice: 0 },
        { name: "2 seater", extraPrice: 30 },
        { name: "3 seater", extraPrice: 70 },
        { name: "4 seater", extraPrice: 190 },
        { name: "5 seater", extraPrice: 210 },
        { name: "2+3 seater", extraPrice: 220 },
      ],
      frameOptions: [
        { name: "No Additional Options", extraPrice: 0 },
        { name: "Footstool", extraPrice: 120 },
        { name: "High back", extraPrice: 60 },
        { name: "Professional Assembly", extraPrice: 80 },
        { name: "Chrome legs", extraPrice: 50 },
      ],
      images: [
        "/Sofas/Shanon Sofa/shanon-sofa-main.webp",
        "/Sofas/Shanon Sofa/shanon-sofa-gallery-1.webp",
        "/Sofas/Shanon Sofa/shanon-sofa-gallery-2.webp",
        "/Sofas/Shanon Sofa/shanon-sofa-gallery-3.webp",
      ],
      description: "Premium handcrafted Shanon Sofa, customized for luxury and comfort.",
      storageOptions: [],
      headboardOptions: [],
      mattressOptions: [],
      fabrics: [],
      colors: [
        { name: "White", image: "/COLOR/plush velvet/White.webp" },
        { name: "Grey", image: "/COLOR/plush velvet/Grey.webp" },
        { name: "Black", image: "/COLOR/plush velvet/Black.webp" },
        { name: "Oak", hex: "#A08151" },
      ],
    },
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // U SHAPE SOFA
  // ══════════════════════════════════════════════════════════════════════════
  product(
    "u-shape-sofa",
    "U shape Sofa",
    "sofas",
    590,
    620,
    "/Sofas/U Shape Sofa/u-shape-sofa-main.webp",
    {
      sizes: [{ name: "1 seater", extraPrice: 0 }],
      frameOptions: [
        { name: "No Additional Options", extraPrice: 0 },
        { name: "Footstool", extraPrice: 120 },
        { name: "High back", extraPrice: 70 },
        { name: "Professional Assembly", extraPrice: 80 },
        { name: "Chrome legs", extraPrice: 50 },
      ],
      images: [
        "/Sofas/U Shape Sofa/u-shape-sofa-main.webp",
        "/Sofas/U Shape Sofa/u-shape-sofa-gallery-1.webp",
        "/Sofas/U Shape Sofa/u-shape-sofa-gallery-2.webp",
        "/Sofas/U Shape Sofa/u-shape-sofa-gallery-3.webp",
      ],
      description: "Premium handcrafted U shape Sofa, customized for luxury and comfort.",
      storageOptions: [],
      headboardOptions: [],
      mattressOptions: [],
      fabrics: [],
      colors: [
        { name: "White", image: "/COLOR/plush velvet/White.webp" },
        { name: "Grey", image: "/COLOR/plush velvet/Grey.webp" },
        { name: "Black", image: "/COLOR/plush velvet/Black.webp" },
        { name: "Oak", hex: "#A08151" },
      ],
    },
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // DIAMONTEE SOFA
  // ══════════════════════════════════════════════════════════════════════════
  product(
    "verona-sofa",
    "Verona Sofa",
    "sofas",
    280,
    320,
    "/Sofas/Verona Sofa/diamontee-sofa-main.webp",
    {
      sizes: [
        { name: "1 seater", extraPrice: 0 },
        { name: "2 seater", extraPrice: 20 },
        { name: "3 seater", extraPrice: 80 },
        { name: "4 seater", extraPrice: 200 },
        { name: "5 seater", extraPrice: 210 },
        { name: "2+3 seater", extraPrice: 220 },
      ],
      frameOptions: [
        { name: "No Additional Options", extraPrice: 0 },
        { name: "Footstool", extraPrice: 120 },
        { name: "High back", extraPrice: 60 },
        { name: "Professional Assembly", extraPrice: 80 },
        { name: "Chrome legs", extraPrice: 50 },
      ],
      images: [
        "/Sofas/Verona Sofa/diamontee-sofa-main.webp",
        "/Sofas/Verona Sofa/diamontee-sofa-gallery-1.webp",
        "/Sofas/Verona Sofa/diamontee-sofa-gallery-2.webp",
        "/Sofas/Verona Sofa/diamontee-sofa-gallery-3.webp",
      ],
      description: "Premium handcrafted Diamontee Sofa, customized for luxury and comfort.",
      storageOptions: [],
      headboardOptions: [],
      mattressOptions: [],
      fabrics: [],
      colors: [
        { name: "White", image: "/COLOR/plush velvet/White.webp" },
        { name: "Grey", image: "/COLOR/plush velvet/Grey.webp" },
        { name: "Black", image: "/COLOR/plush velvet/Black.webp" },
        { name: "Oak", hex: "#A08151" },
      ],
    },
  ),
];

export const PRODUCTS: Product[] = baseProducts
  .map((p) => {
    let desc: string;
    const keywords: string[] = [];
    const n = p.name.toLowerCase();
    const c = p.category.toLowerCase();

    if (c.includes("bed") && c !== "bedroom-furniture") keywords.push("bed", "beds");
    if (c.includes("sofa")) keywords.push("sofa", "sofas");
    if (c.includes("mattress")) keywords.push("mattress", "mattresses");
    if (n.includes("luxury")) keywords.push("luxury");
    if (c.includes("divan") || n.includes("divan")) keywords.push("divan");
    if (c.includes("ottoman") || n.includes("ottoman")) keywords.push("ottoman");
    if (n.includes("chesterfield")) keywords.push("chesterfield");
    if (c.includes("wardrobe")) keywords.push("wardrobe", "wardrobes");

    if (p.category === "sofas") {
      desc = `The ${p.name} is a premium handcrafted sofa available in multiple sizes including 1 seater, 2 seater, 3 seater, 4 seater, 5 seater and 2+3 corner sofa sets. Choose from luxury fabrics: Plush Velvet, Manchester Fabric, Plush Manchester, Jumbo Cord, Chenille Fabric and Crushed Velvet. Available in colours: Grey, Black, Cream, Silver, Mink, Beige, Navy, Steel, Gold, Chocolate, Camel, Blue, Pink, Mustard, Teal, Green, Lilac, Rose Gold, Copper, Yellow, Pearl, Midnight, Pebble, Sky Blue, Light Grey, Truffle, Kensington Grey, Dark Grey, Teal Grey, Shimmer, Velvet. Also available as Corner Sofa, U Shape Sofa, L Shape Sofa. Professional assembly available. Free UK delivery from AQ Beds.`;
    } else {
      desc = `The ${p.name} is a premium handcrafted bed built in the UK for ultimate luxury and comfort. Available in elegant fabrics like Plush Velvet and Crushed Velvet, this bespoke ${p.category.replace("-", " ")} features solid timber construction, optional Ottoman gas lift storage or Divan drawers, and ships straight to your door. Upgrade your bedroom with the perfect blend of style, durability, and practical storage using our highly rated ${p.name}.`;
    }
    return { ...p, description: desc, keywords };
  })
  .sort((a, b) => a.basePrice - b.basePrice);

// ─── Helpers ───────────────────────────────────────────────────────────────────
export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getByCategory(slug: Category) {
  if (slug === "all-beds") {
    return PRODUCTS.filter(
      (p) => !["wardrobes", "sliding-wardrobes", "sofas", "bedroom-furniture"].includes(p.category),
    );
  }
  return PRODUCTS.filter((p) => p.category === slug);
}

// Map search terms to size option keywords for intelligent lookup
const SEARCH_SIZE_MAP: Array<{ aliases: string[]; keywords: string[] }> = [
  { aliases: ["small single", "2ft"], keywords: ["2ft", "small single"] },
  { aliases: ["standard single", "single", "3ft"], keywords: ["3ft", "standard single"] },
  { aliases: ["small double", "4ft"], keywords: ["4ft small double", "small double", "4ft"] },
  { aliases: ["standard double", "double", "4.6", "4'6"], keywords: ["4'6", "standard double"] },
  { aliases: ["king size", "kingsize", "king", "5ft"], keywords: ["5ft", "king size"] },
  { aliases: ["super king", "superking", "6ft"], keywords: ["6ft", "super king"] },
  { aliases: ["1 seater", "one seater", "armchair"], keywords: ["1 seater"] },
  { aliases: ["2 seater", "two seater"], keywords: ["2 seater"] },
  { aliases: ["3 seater", "three seater"], keywords: ["3 seater"] },
  { aliases: ["4 seater", "four seater"], keywords: ["4 seater"] },
  { aliases: ["5 seater", "five seater"], keywords: ["5 seater"] },
  { aliases: ["corner sofa", "corner", "l shape", "l-shape"], keywords: ["2+3"] },
];

// Dynamic Category Discovery (Priority 8)
export const DYNAMIC_CATEGORIES = Array.from(new Set(PRODUCTS.map((p) => p.category)));

export function searchProducts(query: string) {
  const lower = query.toLowerCase().trim();
  if (!lower) return [];

  const terms = lower.split(/\s+/).filter((t) => t.length >= 1);

  const scored = PRODUCTS.map((p) => {
    let score = 0;
    let matchesCount = 0;

    const name = p.name.toLowerCase();
    const cat = p.category.replace(/-/g, " ").toLowerCase();
    const desc = p.description.toLowerCase();

    const sizeNames = p.sizes?.map((s) => s.name.toLowerCase()).join(" ") ?? "";
    const fabricNames = p.fabrics?.map((f) => f.name.toLowerCase()).join(" ") ?? "";
    const storageNames = p.storageOptions?.map((s) => s.name.toLowerCase()).join(" ") ?? "";
    const colorNames = p.colors?.map((c) => c.name.toLowerCase()).join(" ") ?? "";
    const features = `${p.category} ${p.slug}`.toLowerCase();
    const tagsStr = (p.keywords || []).join(" ").toLowerCase();

    const allAttributes = `${sizeNames} ${fabricNames} ${storageNames} ${colorNames} ${cat} ${features} ${desc} ${tagsStr}`;

    // 1. Exact Name/Category Full Prefix (Highest priority)
    if (name === lower || cat === lower) score += 1000;
    if (name.startsWith(lower)) score += 500;
    if (cat.startsWith(lower)) score += 400;

    // 2. Individual Term matches
    terms.forEach((t) => {
      let termMatched = false;

      // Name matches are high value
      if (name.includes(t)) {
        score += name.startsWith(t) ? 200 : 100;
        termMatched = true;
      }

      // Category matches
      if (cat.includes(t)) {
        score += 80;
        termMatched = true;
      }

      // Attribute matches (Features, Sizes, Colors, Tags - Medium Priority)
      const mediumPriority = `${sizeNames} ${fabricNames} ${storageNames} ${colorNames} ${features} ${tagsStr}`;
      if (mediumPriority.includes(t)) {
        score += 50;
        termMatched = true;
      }

      // Description (Lower Priority)
      if (desc.includes(t)) {
        score += 10;
        termMatched = true;
      }

      // 3. Size Aliases
      for (const { aliases, keywords } of SEARCH_SIZE_MAP) {
        if (aliases.some((a) => a.startsWith(t))) {
          if (sizeNames.includes(t) || keywords.some((k) => sizeNames.includes(k.toLowerCase()))) {
            score += 150;
            termMatched = true;
          }
        }
      }

      if (termMatched) matchesCount++;
    });

    // Bonus for matching multiple terms (multi-term relevance)
    if (terms.length > 1 && matchesCount > 1) {
      score += (matchesCount / terms.length) * 100;
    }

    return { product: p, score, matchesCount };
  });

  return (
    scored
      .filter((s) => s.score > 0)
      // Primary sort by matchesCount (how many terms hit), then by score
      .sort((a, b) => b.matchesCount - a.matchesCount || b.score - a.score)
      .map((s) => s.product)
  );
}

export function getSearchSuggestions(query: string) {
  const lower = query.toLowerCase().trim();
  if (lower.length < 1) return [];

  const suggestions: Array<{
    label: string;
    type: "category" | "product" | "keyword";
    slug?: string;
    image?: string;
    price?: number;
    categoryName?: string;
  }> = [];

  // Match Categories
  CATEGORIES.forEach((c) => {
    if (c.name.toLowerCase().includes(lower)) {
      suggestions.push({ label: c.name, type: "category", slug: c.slug });
    }
  });

  // Match Top Products (Always prioritize actual products as per requirements)
  const matchingProducts = searchProducts(query).slice(0, 5);
  matchingProducts.forEach((p) => {
    suggestions.push({
      label: p.name,
      type: "product",
      slug: p.id,
      image: p.images[0],
      price: p.basePrice,
      categoryName: CATEGORIES.find((c) => c.slug === p.category)?.name,
    });
  });

  // Match specific keywords if few products found
  if (suggestions.length < 8) {
    const keywords = [
      "Storage Beds",
      "Small Double",
      "Single Beds",
      "Sliding Wardrobes",
      "Super King",
      "Ottoman",
      "Divan",
      "Luxury",
      "Sofas",
      "Corner Sofa",
      "U Shape Sofa",
      "2 Seater Sofa",
      "3 Seater Sofa",
      "4 Seater Sofa",
      "Plush Velvet",
      "Manchester Fabric",
      "Plush Manchester",
      "Jumbo Cord",
      "Chenille Fabric",
      "Crushed Velvet",
    ];
    keywords.forEach((k) => {
      if (k.toLowerCase().includes(lower) && !suggestions.some((s) => s.label === k)) {
        suggestions.push({ label: k, type: "keyword" });
      }
    });
  }

  return suggestions.slice(0, 10);
}
