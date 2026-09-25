import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { trackPixelWithId, getClientTrackingData } from "@/lib/meta-pixel";
import { sendAddToCartEvent, sendViewContentEvent } from "@/lib/meta-capi";

import { getProduct, PRODUCTS, DISCOUNT_POSTCODES } from "@/features/products/data/products";
import { getDbProductBySlug } from "@/lib/products";
import { formatGBP } from "@/lib/utils/format";
import { useCart, useUI, useWishlist } from "@/features/cart/store/cart";
import { ProductCard } from "@/features/products/components/ProductCard";
import {
  Truck,
  ShieldCheck,
  Star,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const dbProduct = await getDbProductBySlug({ data: params.slug });
    if (dbProduct) {
      const product = {
        ...dbProduct,
        id: dbProduct.slug,
        reviews: 0,
        isNew: false,
        onSale: !!dbProduct.originalPrice,
        keywords: [] as string[],
        colors: dbProduct.colors || [],
        sizes: dbProduct.sizes || [],
        fabrics: dbProduct.fabrics || [],
        mattressOptions: dbProduct.mattressOptions || [],
        frameOptions: dbProduct.frameOptions || [],
        headboardOptions: dbProduct.headboardOptions || [],
        storageOptions: dbProduct.storageOptions || [],
      };
      return { product, isDb: true };
    }
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product, isDb: false };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — AQ Beds` },
          { name: "description", content: loaderData.product.description.slice(0, 155) },
          { property: "og:title", content: `${loaderData.product.name} — AQ Beds` },
          { property: "og:description", content: loaderData.product.description.slice(0, 155) },
          {
            property: "og:image",
            content: `https://www.aqbeds.com${loaderData.product.images[0]}`,
          },
          {
            property: "og:url",
            content: `https://www.aqbeds.com/product/${loaderData.product.slug}`,
          },
          { property: "og:type", content: "product" },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "twitter:title", content: `${loaderData.product.name} — AQ Beds` },
          {
            name: "twitter:image",
            content: `https://www.aqbeds.com${loaderData.product.images[0]}`,
          },
        ]
      : [],
    scripts: loaderData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              name: loaderData.product.name,
              description: loaderData.product.description,
              image: `https://aqbeds.vercel.app${loaderData.product.images[0]}`,
              brand: { "@type": "Brand", name: "AQ Beds" },
              offers: {
                "@type": "Offer",
                price: loaderData.product.basePrice,
                priceCurrency: "GBP",
                availability: "https://schema.org/InStock",
                url: `https://aqbeds.vercel.app/product/${loaderData.product.slug}`,
              },
            }),
          },
        ]
      : [],
  }),
  component: ProductPage,
  notFoundComponent: () => <div className="p-10 text-center text-white">Product not found.</div>,
  errorComponent: ({ error }) => <div className="p-10 text-center text-white">{error.message}</div>,
});

/* COLOR PALETTES */
const CRUSHED_VELVET_COLORS = [
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

const CHENILLE_COLORS = [
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

const SOFT_MATTE_COLORS = [
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

const PLUSH_VELVET_COLORS = [
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

const BED_FABRIC_PALETTES: Record<string, { name: string; image?: string; hex?: string }[]> = {
  "Crushed Velvet": CRUSHED_VELVET_COLORS,
  "Plush Velvet": PLUSH_VELVET_COLORS,
  Chenille: CHENILLE_COLORS,
  "Soft Matte": SOFT_MATTE_COLORS,
};

const DYLAN_FABRICS = [
  { name: "Plush Velvet", extraPrice: 0 },
  { name: "Jumbo Cord", extraPrice: 0 },
  { name: "Chenille Fabric", extraPrice: 0 },
  { name: "Crushed Velvet", extraPrice: 0 },
];
const OTHER_SOFA_FABRICS = [
  { name: "Manchester Fabric", extraPrice: 0 },
  { name: "Plush Manchester", extraPrice: 0 },
];

const SOFA_PALETTES: Record<string, { name: string; hex?: string; image?: string }[]> = {
  "Manchester Fabric": [
    { name: "Dark Grey", image: "/Sofas/Sofa colours/Manchester Fabric/Dark Grey_.webp" },
    { name: "Silver", image: "/Sofas/Sofa colours/Manchester Fabric/Silver_.webp" },
    { name: "Teal Grey", image: "/Sofas/Sofa colours/Manchester Fabric/Teal Grey_.webp" },
    { name: "Mink", image: "/Sofas/Sofa colours/Manchester Fabric/Mink_.webp" },
    { name: "Truffle Dark", image: "/Sofas/Sofa colours/Manchester Fabric/Truffle Dark_.webp" },
    { name: "Truffle Grey", image: "/Sofas/Sofa colours/Manchester Fabric/Truffle Grey_.webp" },
    { name: "Black", image: "/Sofas/Sofa colours/Manchester Fabric/Black_.webp" },
    {
      name: "Kensington Grey",
      image: "/Sofas/Sofa colours/Manchester Fabric/Kensington Grey.webp",
    },
    { name: "Cream", image: "/Sofas/Sofa colours/Manchester Fabric/Cream_.webp" },
    { name: "Teal Blue", image: "/Sofas/Sofa colours/Manchester Fabric/Teal Blue_.webp" },
    { name: "Purple", image: "/Sofas/Sofa colours/Manchester Fabric/Purple_.webp" },
  ],
  "Plush Manchester": [
    { name: "Black", image: "/Sofas/Sofa colours/Plush Manchester/Black_.webp" },
    { name: "Steel", image: "/Sofas/Sofa colours/Plush Manchester/Steel_.webp" },
    { name: "Mustard", image: "/Sofas/Sofa colours/Plush Manchester/Mustard_.webp" },
    { name: "Pink", image: "/Sofas/Sofa colours/Plush Manchester/Pink_.webp" },
    { name: "Cream", image: "/Sofas/Sofa colours/Plush Manchester/Cream_.webp" },
    { name: "Navy", image: "/Sofas/Sofa colours/Plush Manchester/Navy_.webp" },
    { name: "Silver", image: "/Sofas/Sofa colours/Plush Manchester/Silver_.webp" },
    { name: "Mink", image: "/Sofas/Sofa colours/Plush Manchester/Mink_.webp" },
    { name: "Blue", image: "/Sofas/Sofa colours/Plush Manchester/Blue_.webp" },
    { name: "Grey", image: "/Sofas/Sofa colours/Plush Manchester/Grey_.webp" },
  ],
  "Plush Velvet": [
    { name: "Cream", image: "/Sofas/Sofa colours/Plush Velvet/Cream_.webp" },
    { name: "Blue", image: "/Sofas/Sofa colours/Plush Velvet/Blue_.webp" },
    { name: "Black", image: "/Sofas/Sofa colours/Plush Velvet/Black_.webp" },
    { name: "Green", image: "/Sofas/Sofa colours/Plush Velvet/Green_.webp" },
    { name: "Pebble", image: "/Sofas/Sofa colours/Plush Velvet/Pebble_.webp" },
    { name: "Light Grey", image: "/Sofas/Sofa colours/Plush Velvet/Light Grey_.webp" },
    { name: "Steel", image: "/Sofas/Sofa colours/Plush Velvet/Steel_.webp" },
    { name: "Sky Blue", image: "/Sofas/Sofa colours/Plush Velvet/Sky blue_.webp" },
    { name: "Grey", image: "/Sofas/Sofa colours/Plush Velvet/Grey_.webp" },
    { name: "Dark Lilac", image: "/Sofas/Sofa colours/Plush Velvet/Dark Lilac.webp" },
    { name: "Lilac", image: "/Sofas/Sofa colours/Plush Velvet/Lilac.webp" },
    { name: "Copper", image: "/Sofas/Sofa colours/Plush Velvet/Copper_.webp" },
    { name: "Rose Gold", image: "/Sofas/Sofa colours/Plush Velvet/Rose Gold_.webp" },
    { name: "Yellow", image: "/Sofas/Sofa colours/Plush Velvet/Yellow_.webp" },
    { name: "Steel Blue", image: "/Sofas/Sofa colours/Plush Velvet/Steel Blue_.webp" },
    { name: "Light Silver", image: "/Sofas/Sofa colours/Plush Velvet/Light Silver_.webp" },
    { name: "Flag Green", image: "/Sofas/Sofa colours/Plush Velvet/Flag Green_.webp" },
    { name: "Lavender", image: "/Sofas/Sofa colours/Plush Velvet/Lavender_.webp" },
    { name: "Navy", image: "/Sofas/Sofa colours/Plush Velvet/Navy_.webp" },
    { name: "Turquoise", image: "/Sofas/Sofa colours/Plush Velvet/Torque (Turquoise).webp" },
  ],
  "Jumbo Cord": [
    { name: "Beige", image: "/Sofas/Sofa colours/Jumbo Cord/Beige.webp" },
    { name: "Black", image: "/Sofas/Sofa colours/Jumbo Cord/Black_.webp" },
    { name: "Camel", image: "/Sofas/Sofa colours/Jumbo Cord/Camel_.webp" },
    { name: "Chocolate", image: "/Sofas/Sofa colours/Jumbo Cord/Chocolate_.webp" },
    { name: "Cream", image: "/Sofas/Sofa colours/Jumbo Cord/Cream.webp" },
    { name: "Grey", image: "/Sofas/Sofa colours/Jumbo Cord/Grey_.webp" },
    { name: "Mink", image: "/Sofas/Sofa colours/Jumbo Cord/Mink_.webp" },
  ],
  "Chenille Fabric": [
    { name: "Black", image: "/Sofas/Sofa colours/Chenille Fabric/Black_.webp" },
    { name: "Brown", image: "/Sofas/Sofa colours/Chenille Fabric/Brown_.webp" },
    { name: "Grey", image: "/Sofas/Sofa colours/Chenille Fabric/Grey_.webp" },
    { name: "Mink", image: "/Sofas/Sofa colours/Chenille Fabric/Mink_.webp" },
  ],
  "Crushed Velvet": [
    { name: "Shimmer Grey", image: "/Sofas/Sofa colours/Crushed Velvet/Shimmer Grey_.webp" },
    {
      name: "Shimmer Midnight",
      image: "/Sofas/Sofa colours/Crushed Velvet/Shimmer Midnight_.webp",
    },
    { name: "Shimmer Mink", image: "/Sofas/Sofa colours/Crushed Velvet/Shimmer Mink_.webp" },
    { name: "Shimmer Pearl", image: "/Sofas/Sofa colours/Crushed Velvet/Shimmer Pearl_.webp" },
    { name: "Shimmer Steel", image: "/Sofas/Sofa colours/Crushed Velvet/Shimmer Steel_.webp" },
    { name: "Black", image: "/Sofas/Sofa colours/Crushed Velvet/Velvet Black_.webp" },
    { name: "Chocolate", image: "/Sofas/Sofa colours/Crushed Velvet/Velvet Chocolate_.webp" },
    { name: "Cream", image: "/Sofas/Sofa colours/Crushed Velvet/Velvet Cream_.webp" },
    { name: "Gold", image: "/Sofas/Sofa colours/Crushed Velvet/Velvet Gold_.webp" },
    { name: "Silver", image: "/Sofas/Sofa colours/Crushed Velvet/Velvet Silver_.webp" },
  ],
};

function ProductPage() {
  const { product, isDb } = Route.useLoaderData();
  const add = useCart((s) => s.add);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const wish = useWishlist();
  const isWished = wish.has(product.id);

  useEffect(() => {
    window.scrollTo(0, 0);
    const event_id = trackPixelWithId("ViewContent", {
      content_name: product.name,
      content_ids: [product.id],
      content_type: "product",
      value: product.basePrice,
      currency: "GBP",
    });
    const trackingData = getClientTrackingData();
    sendViewContentEvent({
      event_id,
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      value: product.basePrice,
      currency: "GBP",
      client_user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      ...trackingData,
    }).catch(() => {});
  }, [product.id]);

  const isSofa = product.category === "sofas";
  const isDylan = product.id === "dylan-sofa";
  const sofaFabrics = isDylan ? DYLAN_FABRICS : OTHER_SOFA_FABRICS;
  const initialFabric = isSofa ? sofaFabrics[0] : product.fabrics[0];

  const getBedPalette = (fb: any) => {
    if (fb?.colors && fb.colors.length > 0) return fb.colors;
    return BED_FABRIC_PALETTES[fb?.name] ?? [];
  };

  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState(product.sizes[0]);
  const [fabric, setFabric] = useState(initialFabric);
  const [color, setColor] = useState(
    isSofa
      ? SOFA_PALETTES[sofaFabrics[0].name][0]
      : product.fabrics.length > 0
        ? (getBedPalette(product.fabrics[0])[0] ?? product.colors[0])
        : product.colors[0],
  );
  const [mattress, setMattress] = useState(product.mattressOptions[0]);
  const [withMattress, setWithMattress] = useState(product.mattressOptions.length > 0);
  const [frame, setFrame] = useState(product.frameOptions[0]);
  const [headboardOpt, setHeadboard] = useState(product.headboardOptions?.[0]);
  const [storage, setStorage] = useState(product.storageOptions?.[0]);
  const [qty, setQty] = useState(1);
  const [postalCode, setPostalCode] = useState("");
  const [instructions, setInstructions] = useState("");

  const [showSummary, setShowSummary] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const selectionsRef = useRef<HTMLDivElement>(null);
  const cartCount = useCart((s) => s.count());

  useEffect(() => {
    // Preload gallery images for instant switching
    product.images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    if (isSofa && fabric && SOFA_PALETTES[fabric.name]) {
      // Only preload colors for the currently selected fabric, not all 65+
      SOFA_PALETTES[fabric.name].forEach((c) => {
        if (c.image) {
          const img = new Image();
          img.src = c.image;
        }
      });
    }

    let ticking = false;
    const handleUpdate = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const selections = selectionsRef.current;
          if (!selections) {
            ticking = false;
            return;
          }

          const isMobile = window.innerWidth < 1280;
          const scrollY = window.scrollY;

          // Improved: Detect trigger points dynamically
          const triggerY = isMobile ? 500 : 400;
          const isPastGallery = scrollY > triggerY;

          const sRect = selections.getBoundingClientRect();
          const isBeforeSelections = sRect.top > 350;

          setShowSummary(isPastGallery && isBeforeSelections);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleUpdate, { passive: true });
    handleUpdate();
    return () => window.removeEventListener("scroll", handleUpdate);
  }, [product.id]);

  const discount = useMemo(() => {
    const code = postalCode.trim().toUpperCase();
    if (!code) return 0;
    const prefixMatch = code.match(/^[A-Z]+/);
    if (prefixMatch && DISCOUNT_POSTCODES.includes(prefixMatch[0])) return 20;
    return 0;
  }, [postalCode]);

  const ottomanSurcharge = useMemo(() => {
    const isSuperKing = size?.name.toLowerCase().includes("super king");
    return isSuperKing ? 160 : 120;
  }, [size]);

  const assemblySurcharge = useMemo(() => {
    if (!size?.name) return 60;
    const s = size.name.toLowerCase();

    // Check if it's a sliding wardrobe specifically
    const isSliding = product.category === "sliding-wardrobes" || product.id === "sliding-wardrobe";

    if (isSliding) {
      if (s.includes("100cm")) return 70;
      if (s.includes("120cm")) return 80;
      if (s.includes("150cm")) return 90;
      if (s.includes("180cm")) return 100;
      if (s.includes("203cm")) return 110;
      if (s.includes("250cm")) return 120;
    }

    // Default tiered logic for others
    if (s.includes("100cm")) return 60;
    if (s.includes("120cm")) return 70;
    if (s.includes("150cm")) return 80;
    if (s.includes("180cm")) return 80;
    if (s.includes("203cm")) return 90;
    if (s.includes("250cm")) return 100;

    return 60;
  }, [size, product]);

  const unitPrice = useMemo(() => {
    let storagePrice = 0;
    if (storage && storage.name !== "No Storage") {
      if (
        storage.name.toLowerCase().includes("ottoman") ||
        storage.name.toLowerCase().includes("gas lift")
      ) {
        storagePrice = ottomanSurcharge;
      } else {
        storagePrice = storage.extraPrice;
      }
    }

    let framePrice = 0;
    if (frame && frame.name !== "No Assembly" && frame.name.toLowerCase().includes("assembly")) {
      framePrice = assemblySurcharge;
    } else {
      framePrice = frame?.extraPrice ?? 0;
    }

    return (
      product.basePrice +
      (size?.extraPrice ?? 0) +
      (fabric?.extraPrice ?? 0) +
      (mattress?.extraPrice ?? 0) +
      framePrice +
      (headboardOpt?.extraPrice ?? 0) +
      storagePrice -
      discount
    );
  }, [
    product,
    size,
    fabric,
    mattress,
    frame,
    headboardOpt,
    storage,
    ottomanSurcharge,
    assemblySurcharge,
    discount,
  ]);

  const total = unitPrice * qty;
  const related = (PRODUCTS as any[])
    .filter((p: any) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Sizes come as two groups: "… – With Mattress" and "… – No Mattress".
  // Show only the group matching the With/Without Mattress toggle.
  const isWithMattressSize = (n: string) => n.toLowerCase().includes("with mattress");
  const isNoMattressSize = (n: string) => n.toLowerCase().includes("no mattress");
  const hasMattressSizeGroups = product.sizes.some(
    (s) => isWithMattressSize(s.name) || isNoMattressSize(s.name),
  );
  const baseSizeName = (n: string) =>
    n
      .toLowerCase()
      .replace(/\s*(?:–|-|—)\s*with mattress$/i, "")
      .replace(/\s*(?:–|-|—)\s*no mattress$/i, "")
      .trim();

  const sizeOptions = useMemo(() => {
    if (!hasMattressSizeGroups || product.mattressOptions.length === 0) return product.sizes;
    const filtered = product.sizes.filter((s) =>
      withMattress ? isWithMattressSize(s.name) : isNoMattressSize(s.name),
    );
    return filtered.length > 0 ? filtered : product.sizes;
  }, [product.sizes, product.mattressOptions, withMattress, hasMattressSizeGroups]);

  const toggleMattressGroup = (wantWith: boolean) => {
    setWithMattress(wantWith);
    if (hasMattressSizeGroups) {
      const base = baseSizeName(size?.name ?? "");
      const next =
        product.sizes.find(
          (s) =>
            baseSizeName(s.name) === base &&
            (wantWith ? isWithMattressSize(s.name) : isNoMattressSize(s.name)),
        ) ??
        product.sizes.find((s) =>
          wantWith ? isWithMattressSize(s.name) : isNoMattressSize(s.name),
        );
      if (next) setSize(next);
    }
    if (!wantWith) {
      setMattress(null as any);
    } else if (!mattress) {
      setMattress(product.mattressOptions[0]);
    }
  };

  const selectedOptions: Record<string, string> = {
    ...(size && { Size: size.name }),
    ...(color && { Color: color.name }),
    ...(fabric && { Fabric: fabric.name }),
    ...(mattress && { Mattress: mattress.name }),
    ...(headboardOpt && { Headboard: headboardOpt.name }),
    ...(storage && { Storage: storage.name }),
    ...(discount > 0 && { "Local Discount": "-£20 applied" }),
    ...(instructions && { Instructions: instructions }),
  };

  const onAdd = () => {
    add({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      unitPrice,
      qty,
      options: selectedOptions,
    });
    const event_id = trackPixelWithId("AddToCart", {
      content_name: product.name,
      content_ids: [product.id],
      content_type: "product",
      value: unitPrice,
      currency: "GBP",
    });
    const trackingData = getClientTrackingData();
    sendAddToCartEvent({
      event_id,
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      value: unitPrice,
      currency: "GBP",
      client_user_agent: navigator.userAgent,
      ...trackingData,
    }).catch(() => {});
    setCartOpen(true);
  };

  const waMessage = `Hello AQ Beds, I want to order this bed:%0A%0A*${product.name}*%0A${Object.entries(
    selectedOptions,
  )
    .map(([k, v]) => `• ${k}: ${v}`)
    .join("%0A")}%0A• Qty: ${qty}%0A%0ATotal: ${formatGBP(total)}`;

  return (
    <div className="animate-fade-in bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <nav className="text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-brand">
            Home
          </Link>{" "}
          /{" "}
          <Link to="/shop" className="hover:text-brand">
            Shop
          </Link>{" "}
          / <span>{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          <div className="relative" ref={galleryRef}>
            <div className="flex flex-col">
              <div className="rounded-[2.5rem] overflow-hidden bg-white border border-border aspect-video relative shadow-2xl flex items-center justify-center">
                <img
                  src={product.images[activeImg]}
                  alt={`${product.name} — AQ Beds`}
                  className="h-full w-full object-contain"
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3">
                {product.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    aria-label={`View image ${i + 1}`}
                    className={`relative rounded-xl overflow-hidden border-2 w-full transition-all ${
                      activeImg === i
                        ? "border-brand shadow-md"
                        : "border-border hover:border-brand/50"
                    }`}
                    style={{ aspectRatio: "16/9" }}
                  >
                    <img
                      src={src}
                      alt={`${product.name} view ${i + 1} — AQ Beds`}
                      className="absolute inset-0 h-full w-full object-contain p-1"
                      loading="eager"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
              <div className="hidden lg:block relative mt-8 flex-1" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <span className="font-medium">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground">· {product.reviews} reviews</span>
              <span className="ml-3 text-whatsapp font-medium">In stock ({product.stock})</span>
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl mt-3">{product.name}</h1>
            <div className="mt-4 flex items-baseline gap-3">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-3">
                  <span className="font-display font-bold text-3xl text-brand">
                    {formatGBP(unitPrice)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-muted-foreground line-through">
                      {formatGBP(product.originalPrice)}
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <span className="text-whatsapp text-[10px] font-bold mt-1 uppercase tracking-wider">
                    £20 Local delivery discount applied!
                  </span>
                )}
              </div>
            </div>
            <p className="mt-4 text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Options mapping here */}
            {isSofa ? (
              <>
                <OptionGroup label="1. Select Fabric" value={fabric?.name}>
                  <Pills
                    items={sofaFabrics}
                    active={fabric}
                    onSelect={(SelectedFabric) => {
                      setFabric(SelectedFabric);
                      setColor(SOFA_PALETTES[SelectedFabric.name][0]);
                    }}
                  />
                </OptionGroup>

                {fabric && SOFA_PALETTES[fabric.name] && (
                  <OptionGroup label={`2. Select Color (${fabric.name})`} value={color?.name}>
                    <div className="flex flex-wrap gap-3">
                      {SOFA_PALETTES[fabric.name].map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setColor(c)}
                          className={`group relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all ${color?.name === c.name ? "border-brand ring-4 ring-brand/10 scale-105" : "border-border hover:border-brand/40"}`}
                          title={c.name}
                        >
                          {c.image ? (
                            <img
                              src={c.image}
                              alt={`${c.name} — ${fabric?.name} — AQ Beds`}
                              className="h-full w-full object-cover"
                              decoding="async"
                              loading="lazy"
                            />
                          ) : (
                            <div
                              className="h-full w-full border border-black/5"
                              style={{ backgroundColor: c.hex ?? "#ccc" }}
                            />
                          )}
                          <div className="absolute bottom-0 left-0 right-0 h-[18px] bg-black/75 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <span className="text-[7px] font-bold text-white uppercase tracking-tight truncate px-1">
                              {c.name}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </OptionGroup>
                )}
              </>
            ) : product.fabrics && product.fabrics.length > 0 ? (
              <>
                <OptionGroup label="1. Select Fabric" value={fabric?.name}>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {product.fabrics.map((fb: any) => {
                      const active = fabric?.name === fb.name;
                      return (
                        <button
                          key={fb.name}
                          onClick={() => {
                            setFabric(fb);
                            const palette = getBedPalette(fb);
                            if (palette[0]) setColor(palette[0]);
                          }}
                          className={`px-3 h-14 rounded-xl border-2 text-sm font-semibold transition-all flex flex-col items-center justify-center gap-0.5 ${
                            active
                              ? "border-brand bg-brand/10 text-brand shadow-md"
                              : "border-border bg-card hover:border-brand/40 text-foreground"
                          }`}
                        >
                          <span>{fb.name}</span>
                          {fb.extraPrice !== 0 && (
                            <span
                              className={`text-[10px] ${active ? "text-brand/80" : "text-muted-foreground"}`}
                            >
                              +£{fb.extraPrice}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </OptionGroup>

                {fabric && getBedPalette(fabric).length > 0 && (
                  <OptionGroup label={`2. Select Color (${fabric.name})`} value={color?.name}>
                    <div className="flex flex-wrap gap-3">
                      {getBedPalette(fabric).map((c: any) => (
                        <button
                          key={c.name + (c.image || "")}
                          onClick={() => setColor(c)}
                          className={`group relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all ${color?.name === c.name ? "border-brand ring-4 ring-brand/10 scale-105" : "border-border hover:border-brand/40"}`}
                          title={c.name}
                        >
                          {c.image ? (
                            <img
                              src={c.image}
                              alt={`${c.name} — ${fabric.name} — AQ Beds`}
                              className="h-full w-full object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : c.hex ? (
                            <div className="h-full w-full" style={{ backgroundColor: c.hex }} />
                          ) : (
                            <div className="h-full w-full bg-gray-700 flex items-center justify-center text-[8px] text-gray-400">
                              {c.name?.charAt(0)}
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 h-[18px] bg-black/75 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <span className="text-[7px] font-bold text-white uppercase tracking-tight truncate px-1">
                              {c.name}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </OptionGroup>
                )}
              </>
            ) : (
              <OptionGroup label="Colors" value={color?.name}>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setColor(c)}
                      className={`group relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all ${color?.name === c.name ? "border-brand ring-4 ring-brand/10 scale-105" : "border-border hover:border-brand/40"}`}
                      title={c.name}
                    >
                      {c.image ? (
                        <img
                          src={c.image}
                          alt={`${c.name} — ${product.name} — AQ Beds`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div
                          className="h-full w-full"
                          style={{ backgroundColor: c.hex ?? "#ccc" }}
                        />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 h-[18px] bg-black/75 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="text-[7px] font-bold text-white uppercase tracking-tight truncate px-1">
                          {c.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </OptionGroup>
            )}

            {isSofa ? (
              <OptionGroup label="3. Size" value={size?.name}>
                <Pills
                  items={product.sizes}
                  active={size}
                  onSelect={setSize}
                  showAbsolutePriceWithBase={product.basePrice}
                />
              </OptionGroup>
            ) : (
              <OptionGroup
                label={product.fabrics.length > 0 ? "3. Size" : "Size"}
                value={size?.name}
              >
                {product.mattressOptions.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <button
                      onClick={() => toggleMattressGroup(true)}
                      className={`px-4 h-12 rounded-xl border-2 text-sm font-semibold transition-all ${
                        withMattress
                          ? "border-brand bg-brand/10 text-brand shadow-md"
                          : "border-border bg-card hover:border-brand/40"
                      }`}
                    >
                      With Mattress
                    </button>
                    <button
                      onClick={() => toggleMattressGroup(false)}
                      className={`px-4 h-12 rounded-xl border-2 text-sm font-semibold transition-all ${
                        !withMattress
                          ? "border-brand bg-brand/10 text-brand shadow-md"
                          : "border-border bg-card hover:border-brand/40"
                      }`}
                    >
                      Without Mattress
                    </button>
                  </div>
                )}
                <Pills
                  items={sizeOptions}
                  active={size}
                  onSelect={setSize}
                  showAbsolutePriceWithBase={product.basePrice}
                />
                {withMattress && product.mattressOptions.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-border/50">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                      Choose Your Mattress
                    </p>
                    <Pills
                      items={product.mattressOptions}
                      active={mattress}
                      onSelect={setMattress}
                    />
                  </div>
                )}
              </OptionGroup>
            )}
            {product.frameOptions?.length > 0 && (
              <OptionGroup label="Assembly" value={frame?.name}>
                <div className="flex flex-wrap gap-2">
                  {product.frameOptions.map((opt) => {
                    const isAssembly =
                      opt.name.toLowerCase().includes("assembly") && opt.name !== "No Assembly";
                    const price =
                      opt.name === "No Assembly"
                        ? 0
                        : isAssembly
                          ? assemblySurcharge
                          : opt.extraPrice;
                    const active = frame?.name === opt.name;
                    return (
                      <button
                        key={opt.name}
                        onClick={() => setFrame(opt)}
                        className={`px-4 h-11 rounded-xl border text-sm transition ${active ? "border-brand bg-brand text-brand-foreground" : "border-border bg-card hover:border-brand/40"}`}
                      >
                        {opt.name} {price > 0 && `+£${price}`}
                      </button>
                    );
                  })}
                </div>
              </OptionGroup>
            )}
            {product.headboardOptions && product.headboardOptions.length > 0 && (
              <OptionGroup label="Headboard" value={headboardOpt?.name}>
                <Pills
                  items={product.headboardOptions}
                  active={headboardOpt}
                  onSelect={setHeadboard}
                />
              </OptionGroup>
            )}
            {product.storageOptions && product.storageOptions.length > 0 && (
              <OptionGroup label="Storage" value={storage?.name}>
                <div className="flex flex-wrap gap-2">
                  {product.storageOptions.map((opt) => {
                    const isGas =
                      opt.name.toLowerCase().includes("ottoman") ||
                      opt.name.toLowerCase().includes("gas lift");
                    const price =
                      opt.name === "No Storage" ? 0 : isGas ? ottomanSurcharge : opt.extraPrice;
                    const active = storage?.name === opt.name;
                    return (
                      <button
                        key={opt.name}
                        onClick={() => setStorage(opt)}
                        className={`px-4 h-11 rounded-xl border text-sm transition ${active ? "border-brand bg-brand text-brand-foreground" : "border-border bg-card hover:border-brand/40"}`}
                      >
                        {opt.name} {price > 0 && `+£${price}`}
                      </button>
                    );
                  })}
                </div>
              </OptionGroup>
            )}

            <div className="mt-8 p-6 rounded-3xl bg-whatsapp/5 border border-whatsapp/20 space-y-4">
              <h2 className="font-display font-medium text-sm flex items-center gap-2">
                <Truck className="h-4 w-4" /> Local Delivery Discount
              </h2>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Areas like <b>LS, HG, WF, S</b> get £20 off. Enter postcode prefix:
              </p>
              <input
                type="text"
                inputMode="text"
                enterKeyHint="done"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                }}
                placeholder="e.g. LS, HG, WF, S"
                className="w-full h-12 px-5 rounded-2xl bg-white border border-border outline-none focus:border-brand uppercase"
              />
            </div>

            <div
              ref={selectionsRef}
              className="mt-8 rounded-3xl border border-border bg-card p-5 space-y-3"
            >
              <h2 className="font-display font-semibold">Your Selection</h2>
              <ul className="text-sm space-y-1 text-muted-foreground">
                {Object.entries(selectedOptions).map(([k, v]) => (
                  <li key={k} className="flex justify-between">
                    <span>{k}</span>
                    <span className="text-foreground">{v}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between pt-4">
                <div className="inline-flex items-center rounded-xl border border-border">
                  <button
                    className="p-2.5"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-3 tabular-nums">{qty}</span>
                  <button
                    className="p-2.5"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-right flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">
                    Total
                  </span>
                  <span className="font-display font-black text-3xl text-brand">
                    {formatGBP(total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              <button
                onClick={onAdd}
                className="h-14 rounded-2xl bg-brand text-brand-foreground font-black flex items-center justify-center gap-3 shadow-luxury"
              >
                <ShoppingBag className="h-5 w-5" /> Add To Basket
              </button>
              <a
                href={`https://wa.me/447519791128?text=${waMessage}`}
                target="_blank"
                rel="noreferrer"
                className="h-14 rounded-2xl bg-whatsapp text-white font-black flex items-center justify-center gap-3 shadow-lg"
              >
                <MessageCircle className="h-5 w-5" /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display font-bold text-2xl sm:text-3xl mb-6">You may also like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <AnimatePresence>
        {showSummary && (
          <>
            {/* Desktop Quick Summary - Simplified trigger and lower breakpoint (lg instead of xl) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="hidden lg:flex fixed left-6 sm:left-10 top-1/2 -translate-y-1/2 flex-col items-center gap-4 z-50"
            >
              <div className="p-6 rounded-[2.5rem] bg-card/95 backdrop-blur-xl border border-border shadow-luxury flex flex-col items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse mb-1" />
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none">
                  Live Total
                </span>
                <span className="font-display font-black text-3xl sm:text-4xl text-brand leading-none tracking-tighter">
                  {formatGBP(total)}
                </span>
                <button
                  onClick={onAdd}
                  aria-label="Add to basket"
                  className="mt-4 min-h-[44px] min-w-[44px] p-4 rounded-full bg-brand text-brand-foreground shadow-lg hover:scale-110 active:scale-95 transition-all grid place-items-center"
                >
                  <ShoppingBag className="h-6 w-6" />
                </button>
              </div>
            </motion.div>

            {/* Mobile Minimal Total Price Pill - sits ABOVE the cart bar when present */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`lg:hidden fixed left-1/2 -translate-x-1/2 h-12 px-7 rounded-full bg-brand text-brand-foreground shadow-2xl z-40 flex items-center justify-center gap-2 border border-white/20 transition-all duration-300 ${
                cartCount > 0 ? "bottom-20" : "bottom-6"
              }`}
            >
              <span className="text-[10px] font-black uppercase tracking-widest opacity-75">
                Live Total
              </span>
              <span className="w-px h-4 bg-white/30" />
              <span className="text-lg font-display font-black">{formatGBP(total)}</span>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function OptionGroup({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8">
      <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-border/50">
        <h2 className="font-display font-bold text-base tracking-wide">{label}</h2>
        {value && <span className="text-sm font-semibold text-brand/80">{value}</span>}
      </div>
      {children}
    </div>
  );
}

function Pills<T extends { name: string; extraPrice: number }>({
  items,
  active,
  onSelect,
  showAbsolutePriceWithBase,
}: {
  items: T[];
  active?: T;
  onSelect: (it: T) => void;
  showAbsolutePriceWithBase?: number;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => {
        const isActive = active?.name === it.name;
        const price = showAbsolutePriceWithBase
          ? showAbsolutePriceWithBase + it.extraPrice
          : it.extraPrice;
        return (
          <button
            key={it.name}
            onClick={() => onSelect(it)}
            className={`px-4 h-11 rounded-xl border text-sm transition ${isActive ? "border-brand bg-brand text-brand-foreground shadow-md" : "border-border bg-card hover:border-brand/30"}`}
          >
            {it.name}{" "}
            {it.extraPrice !== 0 && (
              <span
                className={`ml-1.5 text-xs ${isActive ? "opacity-80" : "text-muted-foreground"}`}
              >
                {showAbsolutePriceWithBase ? `(£${price})` : `+£${it.extraPrice}`}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
