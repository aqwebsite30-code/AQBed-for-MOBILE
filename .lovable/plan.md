
# AQ Beds — Luxury Bed Ecommerce Site

A premium, modern bed/mattress ecommerce frontend inspired by beds.co.uk, with AQ Beds branding, dynamic pricing, cart, and WhatsApp ordering. Built as a frontend-only React app with mock product data (no backend needed for v1).

## Scope (v1)

Frontend-only. Products live in a typed mock data file; cart and wishlist live in `localStorage` via Zustand. No auth, no real payments, no admin dashboard. These can be added later with Lovable Cloud.

## Design System

- Colors (in `src/styles.css` as oklch tokens): primary `#0B3C5D`, accent `#1E5F8B`, button `#0D5EA6`, success/WhatsApp `#25D366`, surfaces `#FFFFFF` / `#F7FAFC`, border `#D9E2EC`, text `#1A1A1A`.
- Typography: Poppins (headings), Inter (body) via Google Fonts.
- Radius 16px, soft luxury shadows, generous spacing, smooth hover/fade animations.

## Routes (TanStack Start, `src/routes/`)

```
__root.tsx           Header + Footer + cart drawer + floating WhatsApp + sticky mobile cart bar
index.tsx            Home: top promo bar, hero, trust badges, featured categories, featured products
shop.tsx             Product listing with filters sidebar + grid
category.$slug.tsx   Category-filtered listing (Ottoman, Divan, Storage, Luxury, Mattresses, Headboards, Bedroom Furniture)
product.$slug.tsx    Single product page with gallery, options, dynamic pricing, Add to Basket + WhatsApp
cart.tsx             Full cart page (drawer is also available globally)
checkout.tsx         Guest checkout form with order summary (mock submit)
search.tsx           Search results page
about.tsx, contact.tsx   Basic supporting pages
```

Each route gets its own `head()` with unique title + description + og tags.

## Components

- `components/layout/`: `Header` (sticky, logo, nav, search, basket, WhatsApp), `Footer`, `MobileMenu`, `TopPromoBar`, `FloatingWhatsApp`, `MobileCartBar`.
- `components/product/`: `ProductCard`, `ProductGrid`, `ProductGallery`, `ProductOptions` (size/color/fabric/mattress/frame/headboard/storage/qty), `PriceSummary`, `QuickViewDialog`, `RelatedProducts`, `Rating`.
- `components/shop/`: `FiltersSidebar` (price slider, bed type, color, size, fabric, storage, mattress included, availability), `SortDropdown`, `Pagination`.
- `components/cart/`: `CartDrawer`, `CartLineItem`, `CouponField`, `OrderSummary`.
- `components/home/`: `Hero`, `TrustBadges`, `FeaturedCategories`, `FeaturedProducts`, `PromoStrip`.

## State (Zustand + localStorage persist)

- `useCartStore`: items (productId, selected options, qty, computed unit price), add/update/remove/clear, totals, coupon.
- `useWishlistStore`: toggle/list.
- `useUIStore`: cart drawer open, mobile menu open.

## Dynamic Pricing

Unit price = `base_price + size_modifier + mattress.extra_price + frame.extra_price + fabric.extra_price + headboard.extra_price + storage.extra_price`. Recomputed live in `ProductOptions` and `PriceSummary`, persisted into the cart line so totals stay correct across the drawer, cart page, and checkout.

## WhatsApp Ordering

Helper `buildWhatsAppUrl(message)` → `https://wa.me/923119274879?text=...`. Two entry points:
- Product page: sends product name, selected options, qty, total.
- Cart/Checkout: sends formatted list of all line items + grand total.

Plus a global floating WhatsApp FAB.

## Mock Data

`src/data/products.ts` — ~18–24 products across the 7 categories with images, colors, sizes (Single → Super King), fabrics, mattress/frame options, stock, rating. Images generated as luxury bedroom photography saved to `src/assets/` and imported.

## Animations

Tailwind keyframes already configured (fade-in, scale-in, hover-scale). Card lift on hover, image zoom on hover, smooth drawer slide, fade-in on section mount.

## Out of Scope (call out to user)

Not included in v1, easy to add later with Lovable Cloud:
- Real product database / admin dashboard / inventory
- User accounts, real reviews, real payments (Stripe)
- Server-side search (currently client-side over mock data)

## Technical Notes

- All colors via semantic tokens in `src/styles.css`; no hard-coded hex in components.
- Poppins/Inter loaded via `<link>` in `__root.tsx` head.
- Images generated with `imagegen` (premium for hero, fast for product thumbs), stored in `src/assets/`, imported as ES modules.
- Fully responsive, mobile-first; sticky bottom cart bar + floating WhatsApp on mobile.

Ready to build on approval.
