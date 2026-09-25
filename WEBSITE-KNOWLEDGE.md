# AQBeds Website — Complete Knowledge Guide

> Everything you need to work on this site on a new device: what it is, how it works,
> which files do what, and how to make common changes safely.
> This doc is specific to the **AQBed-for-MOBILE** snapshot repo.

---

## 1. What this site is

**AQBeds** (https://www.aqbeds.com) — a UK online bed/furniture e-commerce store.

- Product catalog: beds, divan beds, ottoman beds, sofas, wardrobes, bunk beds
- Full shop: browse, search, wishlist, cart, checkout (delivery + payment flow)
- Admin panel at `/admin` (login `/admin/login`): products, orders, sales, live chat, settings
- Meta Ads tracking: Pixel + Conversions API (CAPI) with event deduplication
- Meta product catalog CSV feed for dynamic product ads
- SEO: sitemap, robots, IndexNow submission after each build

---

## 2. Tech stack

| Layer | Technology |
|---|---|
| Framework | TanStack Start (SSR) + TanStack Router (file-based routes) |
| UI | React 19, Tailwind CSS 4, shadcn/ui (Radix primitives), Framer Motion |
| State | Zustand (cart), TanStack Query (server data) |
| Forms | react-hook-form + zod |
| Database | Neon Postgres via Prisma 6 |
| Server functions | TanStack `createServerFn` (runs on server, called from components) |
| API endpoints | Plain Node.js files in `api/` (raw `res.setHeader`/`res.end`) |
| Build | Vite 7 (`NITRO_PRESET=vercel`) |
| Hosting | Vercel (production: `https://www.aqbeds.com`) |
| Package manager | npm (also has bun.lock, but npm is what Vercel uses) |

---

## 3. Setup on a new device

```bash
git clone https://github.com/aqwebsite30-code/AQBed-for-MOBILE.git
cd AQBed-for-MOBILE
npm install
```

`.env` is committed in this repo (intentional — private backup repo) and contains:

| Variable | Used for |
|---|---|
| `DATABASE_URL` | Neon Postgres connection (Prisma) |
| `DIRECT_URL` | Neon direct connection (Prisma migrations) |
| `META_PIXEL_ID` | Meta pixel ID (`1109711544904339`) |
| `META_CAPI_ACCESS_TOKEN` | Meta Conversions API token |
| `ADMIN_EMAIL` (optional) | Admin login email, defaults to `admin@aqbeds.com` |
| `JWT_SECRET` (optional) | Session signing for admin |
| `RESEND_API_KEY` (optional) | Transactional email |

Also expected in Vercel env (not all in `.env`): same CAPI token, pixel ID.

### Commands

```bash
npm run dev          # local dev server (vite dev, default port 5173)
npm run build        # prisma generate + NITRO_PRESET=vercel vite build
npm run lint         # eslint
npm run format       # prettier
```

**Windows / PowerShell notes:**

- Build with: `$env:NITRO_PRESET="vercel"; npx vite build` (or `npm run build`)
- Never run two builds at the same time (causes `ENOTEMPTY` on `dist/`)
- `src/routes/product.$slug.tsx` — `$` must be escaped in PowerShell commands
- Prefer `git add -A` over naming that file explicitly

---

## 4. Repository / deployment workflow

### Remotes (on the original dev machine)

| Remote | URL | Purpose |
|---|---|---|
| `origin` | `AQBeds-website-perfect-code-to-save.git` | Main production repo |
| (this repo) | `AQBed-for-MOBILE.git` | Snapshot / mobile work |

### Main production flow (original machine)

1. Commit on branch `clean-main`
2. Push: `git push origin clean-main:master`
3. Deploy: `npx vercel --prod --yes` (if "Not authorized": `npx vercel login`)
4. Verify: open https://www.aqbeds.com, check Meta events (see section 8)

### Rules that were always followed on production work

- **Never push or deploy without explicit approval** — two separate questions:
  "Should I push to repo? Yes or No" and "Should I deploy to Vercel? Yes or No"
- Do **not** modify Purchase CAPI execution casually:
  - `src/lib/orders.ts` → `firePurchaseCAPI` (server-side Purchase)
  - `api/meta-capi.js` → Purchase handler
  - `st`/`country` hashing was deliberately NOT added there (server Purchase already sends `content_ids`)

---

## 5. Project structure

```
├── api/                        # Vercel serverless functions (plain Node.js)
│   ├── index.js                # SSR entry — serves the TanStack app (catch-all)
│   ├── meta-capi.js            # Meta Conversions API endpoint POST /api/meta-capi
│   └── meta-catalog.js         # Product catalog CSV GET /api/meta-catalog.csv
├── prisma/
│   └── schema.prisma           # DB schema (Product, Order, AdminUser, ...)
├── public/                     # Static assets: product images, robots.txt, sitemap.xml
├── scripts/
│   ├── submit-indexnow.js      # postbuild: SEO ping (IndexNow)
│   └── process-images.js       # image optimization helper
├── src/
│   ├── routes/                 # file-based routes (TanStack Router)
│   │   ├── __root.tsx          # ROOT layout: <head>, Meta pixel, global effects  ⭐
│   │   ├── index.tsx           # homepage
│   │   ├── shop.tsx            # shop listing
│   │   ├── product.$slug.tsx   # product detail page  ($ = dynamic param)
│   │   ├── category.$slug.tsx  # category page
│   │   ├── cart.tsx            # cart page
│   │   ├── checkout.tsx        # checkout (InitiateCheckout + Purchase pixel)
│   │   ├── admin*.tsx          # admin panel pages
│   │   └── ...                 # about, contact, faqs, delivery, returns, search, wishlist
│   ├── components/
│   │   ├── layout/             # Header, Footer, CartDrawer, LiveChatWidget, ...
│   │   └── ui/                 # shadcn/ui primitives (button, dialog, ...)
│   ├── features/
│   │   ├── cart/store/cart.ts  # Zustand cart store
│   │   ├── products/           # ProductCard + product data
│   │   └── home/               # homepage sections (LazySections)
│   ├── hooks/
│   │   ├── use-mobile.tsx      # mobile viewport hook
│   │   └── useTracking.ts      # pixel tracking helpers
│   ├── lib/
│   │   ├── meta-pixel.ts       # generateEventId (UUID), trackPixelWithId, fbp/fbc
│   │   ├── meta-capi.ts        # client CAPI: PageView/ViewContent/AddToCart/InitiateCheckout
│   │   ├── orders.ts           # order creation + firePurchaseCAPI  ⭐ DO NOT casually edit
│   │   ├── products.ts         # product queries (DB + fallback)
│   │   ├── products-catalog.cjs# static catalog (32 products) used when DB is empty
│   │   ├── auth/               # admin login (bcrypt + JWT)
│   │   ├── db/                 # Prisma client
│   │   └── email/              # Resend email
│   ├── routeTree.gen.ts        # AUTO-GENERATED by router plugin — never hand-edit
│   ├── router.tsx / server.ts / start.ts
│   └── styles.css              # global styles + Tailwind
├── vercel.json                 # Vercel routes: /api/* before SPA catch-all
├── vite.config.ts
└── .env                        # secrets (present in this snapshot repo)
```

### Key files in one line

| File | What it does |
|---|---|
| `src/routes/__root.tsx` | Global layout; Meta Pixel base snippet; ONE PageView per route effect |
| `src/lib/meta-pixel.ts` | `generateEventId()` → UUID shared by browser + CAPI |
| `src/lib/meta-capi.ts` | Browser-side Conversions API calls (dedup events) |
| `api/meta-capi.js` | Server endpoint that forwards events to Meta (hashes PII: em/ph/fn/ln/ct/st/country) |
| `api/meta-catalog.js` | Serves catalog CSV with `sale_price` for Meta Shopping |
| `src/lib/orders.ts` | Order persistence + server Purchase event |
| `src/features/cart/store/cart.ts` | Cart state (Zustand, localStorage persisted) |
| `prisma/schema.prisma` | Data model |

---

## 6. Routing

File-based via TanStack Router. Route files in `src/routes/`:

| File | URL |
|---|---|
| `index.tsx` | `/` |
| `shop.tsx` | `/shop` |
| `product.$slug.tsx` | `/product/:slug` (e.g. `/product/divan`) |
| `category.$slug.tsx` | `/category/:slug` |
| `cart.tsx` | `/cart` |
| `checkout.tsx` | `/checkout` |
| `admin.login.tsx` | `/admin/login` |
| `admin.products.edit.$id.tsx` | `/admin/products/edit/:id` |

- Add a page: create `src/routes/my-page.tsx` exporting a route — `routeTree.gen.ts` regenerates on dev/build.
- Dynamic param: use `$param` in filename, read via `Route.useParams()`.
- **Never hand-edit `src/routeTree.gen.ts`.**

---

## 7. Database (Prisma + Neon)

Models: `Product`, `ProductVariant`, `ProductImage`, `Order`, `Salesperson`, `SiteVisit`, `AdminUser`, `ChatMessage`.

```bash
npx prisma generate        # after schema changes (also runs in build)
npx prisma migrate dev     # create/apply migrations
npx prisma db push         # push schema without migration file
```

- DB can be **empty** — the site falls back to `src/lib/products-catalog.cjs` (32 static products).
- Catalog/product **IDs are strings** like `ambessador`, `divan`, `hilton` — these are also Meta `content_ids`.
- Seed helper: `src/lib/seed.ts`; admin reset: `reset-admin-password.mjs`.

### Admin login

- URL: `/admin/login`
- Email default: `admin@aqbeds.com` (override with `ADMIN_EMAIL`)
- Password stored as bcrypt hash in `AdminUser` table
- Reset: `node reset-admin-password.mjs`

---

## 8. Meta tracking (Pixel + CAPI) — READ CAREFULLY

This is the most fragile and most important part of the site.

### IDs

- Pixel ID: `1109711544904339`
- CAPI token: `META_CAPI_ACCESS_TOKEN` in `.env` + Vercel env

### How deduplication works

Every browser event must send a **UUID `eventID`** that is string-identical to the
`event_id` sent to CAPI. Meta then dedups browser vs server event.

```
Browser: fbq("track", "PageView", {}, { eventID: sharedEventId })
Server:  POST /api/meta-capi { event_name, event_id: sharedEventId, ... }
```

- UUIDs generated by `generateEventId()` in `src/lib/meta-pixel.ts` (crypto.randomUUID).

### The ONE PageView rule (critical)

- Exactly **ONE browser PageView per route** (per path, per full page load).
- Implemented in `src/routes/__root.tsx`:
  - Module-level guard `lastPageViewPath` — StrictMode-safe, resets on full reload.
  - Effect fires on `location.pathname` change: generates one UUID, fires browser PageView + CAPI PageView with the same ID.

### Why `disablePushState` is required

Meta's `fbevents.js` hooks `history.pushState` and **auto-fires** a PageView on SPA
navigations with an eid like `ob3_plugin-set_<64-hex>` — which can never match CAPI
and creates duplicate/undedupable views.

Fix (already in `__root.tsx`, do not remove):

```js
fbq.disablePushState = true;
fbq.allowDuplicatePageViews = true;
fbq("set", "autoConfig", false, "1109711544904339");
fbq("init", "1109711544904339", { automaticConfiguration: false, automaticConfig: false });
```

Also set inside the PageView effect before tracking.

### Events sent

| Event | Where | Extra data |
|---|---|---|
| PageView | `__root.tsx` effect | shared UUID |
| ViewContent | `product.$slug.tsx` | `content_ids: [product.id]`, `content_type: "product"` |
| AddToCart | `product.$slug.tsx` / cart | `content_ids` |
| InitiateCheckout | `checkout.tsx` (mount + submit) | `content_ids`, `content_type: "product"` |
| Purchase | browser (`checkout.tsx`) + server (`orders.ts` → `api/meta-capi.js`) | `content_ids` |

CAPI server hashes PII (SHA-256 lowercase): `em` (email), `ph` (phone), `fn`, `ln`, `ct`, `st`, `country`, `zp`, plus `external_id`, `fbp`, `FBC`.
**Purchase server handler intentionally does NOT hash `st`/`country`** — leave it alone.

### Verifying tracking (self-verification required)

There is a Playwright script pattern used previously (see `tmp/inspect-pixel.mjs` in snapshots):

1. Load the site, click real links (SPA nav to `/shop`, `/product/...`)
2. Capture `https://www.facebook.com/tr/` requests → parse `eid=` param
3. Capture `POST /api/meta-capi` bodies → `event_id`
4. Assert:
   - OB3 count = 0 (no `ob3_plugin-set_` eids)
   - exactly 1 PageView per route
   - every browser `eid` is a UUID and matches a CAPI `event_id` (`dedup_ok: true`)
   - ViewContent has `content_ids` / `content_type`
5. Wait long enough (5–8s per route) — product pages need time to hydrate

Quick manual check: DevTools → Network → filter `facebook.com/tr/` → inspect `eid=`.

### Catalog feed

- URL: `https://www.aqbeds.com/api/meta-catalog.csv`
- Columns include `id, title, description, link, image_link, price, sale_price, availability, ...`
- Source: DB if present, else `src/lib/products-catalog.cjs`
- Defined in `api/meta-catalog.js` (route mapping in `vercel.json`)

---

## 9. Vercel deployment details

`vercel.json` routes (order matters):

1. `/api/meta-capi` → `api/meta-capi.js`
2. `/api/meta-catalog.csv` → `api/meta-catalog.js`
3. `/` → `api/index` (SSR handler)
4. filesystem assets
5. `/(.*)` → `api/index` (SPA/SSR catch-all)

- Build command: `npm run build` (= `prisma generate && NITRO_PRESET=vercel vite build`)
- Output: `dist/client`
- Postbuild: `scripts/submit-indexnow.js` (pings IndexNow for SEO — expects 200 OK)
- Deploy CLI: `npx vercel --prod --yes`
- API files are **raw Node.js** — no Express, use `res.setHeader` / `res.statusCode` / `res.end`

---

## 10. Common changes — recipes

### Add / edit a product image
Images live in `public/all products img/<Product Name>/` and `public/Sofas/...`.
Update product record (admin panel or `products-catalog.cjs` for static fallback) and set `image_link` accordingly.

### Change product price / sale price
- Live DB product: admin panel → Products → Edit
- Static fallback: `src/lib/products-catalog.cjs` (has `price` + `sale_price`)

### Add a new page
1. Create `src/routes/my-page.tsx` (copy structure from `about.tsx`)
2. Add nav link in `src/components/layout/Header.tsx` (and Footer if needed)
3. Dev server regenerates `routeTree.gen.ts` automatically

### Change checkout / order logic
- Order create + server Purchase: `src/lib/orders.ts` ⚠️
- Checkout UI + browser Purchase: `src/routes/checkout.tsx`
- Always keep browser and server Purchase `event_id` shared, and include `content_ids`.

### Change Meta tracking
- Pixel base code / PageView guard: `src/routes/__root.tsx` ⚠️
- Client CAPI payloads: `src/lib/meta-capi.ts`
- Server hashing / forwarding: `api/meta-capi.js`
- After ANY tracking change: rebuild, deploy, re-run browser verification (section 8).

### Change styling
- Global styles: `src/styles.css` (Tailwind 4 syntax)
- Component-level: Tailwind classes inline; shadcn components in `src/components/ui/`

### Emails
`src/lib/email/` (Resend). Requires `RESEND_API_KEY`.

### SEO
- Sitemap: `public/sitemap.xml`
- Robots: `public/robots.txt`
- IndexNow auto-ping: `scripts/submit-indexnow.js` (postbuild)

---

## 11. Gotchas & hard-won lessons

1. **`ob3_plugin-set_` PageViews** — Meta auto-fires these on SPA nav unless `fbq.disablePushState = true`. If they come back, someone removed those lines from `__root.tsx`.
2. **Double PageView on initial load** — StrictMode double-mounts effects in dev. The `lastPageViewPath` module guard exists for this. Don't remove it.
3. **Instrumenting `window.fbq` too early** — if you define/replace `fbq` before the base snippet runs, the snippet's `if (f.fbq) return` exits and the pixel never loads. Verify via network interception only.
4. **DB empty is normal** — static catalog fallback kicks in automatically.
5. **Concurrent vite builds** race on `dist/` → `ENOTEMPTY`. Build serially.
6. **`npm run build` on PowerShell** may fail on env var syntax → use `$env:NITRO_PRESET="vercel"; npx vite build`.
7. **Push quirk**: `git push` sometimes prints "Everything up-to-date" spuriously — re-run; check stderr for the real ref update.
8. **Purchase CAPI** is sacred — don't add fields experimentally; verify in Events Manager first.
9. **`content_ids` must equal product `id` strings** (`divan`, `ambessador`, ...) for catalog ad matching.
10. **Product link click-testing**: SPA nav must be done via real `<a>` clicks (or pushState + popstate fallback); wait 5–8s for events to flush.

---

## 12. Live URLs

| URL | Purpose |
|---|---|
| https://www.aqbeds.com | Production site |
| https://www.aqbeds.com/api/meta-catalog.csv | Meta catalog feed |
| https://www.aqbeds.com/api/meta-capi | CAPI endpoint (POST) |
| https://vercel.com/abdulraheem1/aqbeds | Vercel dashboard |
| `AQBeds-website-perfect-code-to-save.git` | Main production repo |
| `AQBed-for-MOBILE.git` | This snapshot repo |

---

*Snapshot taken after Meta PageView dedup fix (commit `adfec04` on main repo: disablePushState + single-PageView guard, verified live: OB3=0, 1 PageView/route, all dedup_ok.)*
