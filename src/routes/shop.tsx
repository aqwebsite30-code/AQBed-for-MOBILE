import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useRef } from "react";
import { PRODUCTS, searchProducts } from "@/features/products/data/products";
import { getDbProducts } from "@/lib/products";
import { ProductCard } from "@/features/products/components/ProductCard";
import { SlidersHorizontal, X, ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";

export const Route = createFileRoute("/shop")({
  loader: async () => {
    const dbProducts = await getDbProducts();
    return { dbProducts };
  },
  head: () => ({
    meta: [
      { title: "Shop All Beds — AQ Beds" },
      {
        name: "description",
        content: "Browse our complete collection of luxury beds, mattresses and bedroom furniture.",
      },
      { property: "og:title", content: "Shop All Beds — AQ Beds" },
      { property: "og:description", content: "Browse our complete collection of luxury beds, mattresses and bedroom furniture at AQ Beds." },
      { property: "og:image", content: "https://www.aqbeds.com/Home%20page%20images/1000152185-clean.webp" },
      { property: "og:url", content: "https://www.aqbeds.com/shop" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Shop All Beds — AQ Beds" },
      { name: "twitter:image", content: "https://www.aqbeds.com/Home%20page%20images/1000152185-clean.webp" },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { dbProducts } = Route.useLoaderData();
  const [maxPrice, setMaxPrice] = useState(1500);
  const [sort, setSort] = useState<"featured" | "low" | "high">("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true });

  const toggleCat = (cat: string) =>
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );

  const toggleSize = (size: string) =>
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );

  // Only show beds in Shop All
  const bedsOnly = useMemo(() => {
    const staticBeds = PRODUCTS.filter(
      (p) =>
        !["wardrobes", "sliding-wardrobes", "sofas", "bedroom-furniture"].includes(p.category),
    ) as any[];
    const dbBeds = (dbProducts || []).filter(
      (p) =>
        !["wardrobes", "sliding-wardrobes", "sofas", "bedroom-furniture"].includes(p.category),
    );
    return [...dbBeds, ...staticBeds];
  }, [dbProducts]);

  // Dynamic Filters (Priority 8)
  const dynamicCategories = useMemo(
    () => Array.from(new Set(bedsOnly.map((p) => p.category))),
    [bedsOnly],
  );
  const dynamicSizes = useMemo(() => {
    const s = new Set<string>();
    bedsOnly.forEach((p) => p.sizes?.forEach((sz) => s.add(sz.name)));
    return Array.from(s).sort();
  }, [bedsOnly]);

  const list = useMemo(() => {
    let filtered = bedsOnly;

    // Search bar (Priority 1 — covers sizes and keywords)
    if (search.trim()) {
      // searchProducts returns all products, so filter down to bedsOnly again
      const searchResults = searchProducts(search);
      filtered = searchResults.filter(
        (p) =>
          !["wardrobes", "sliding-wardrobes", "sofas", "bedroom-furniture"].includes(p.category),
      );
    }

    // Secondary Filters (Price)
    filtered = filtered.filter((p) => p.basePrice <= maxPrice);

    // Dynamic Category sidebar filter
    if (selectedCats.length > 0) {
      filtered = filtered.filter((p) => selectedCats.includes(p.category));
    }

    // Dynamic Size sidebar filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((p) => p.sizes?.some((sz) => selectedSizes.includes(sz.name)));
    }

    if (sort === "low") return [...filtered].sort((a, b) => a.basePrice - b.basePrice);
    if (sort === "high") return [...filtered].sort((a, b) => b.basePrice - a.basePrice);
    return filtered;
  }, [maxPrice, sort, search, selectedCats, selectedSizes]);

  const hasActiveFilters =
    selectedCats.length > 0 ||
    selectedSizes.length > 0 ||
    search.trim().length > 0 ||
    maxPrice < 1500;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header Banner ── */}
      <div className="relative bg-[#0a0a0a] text-white overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-transparent to-blue-500/10 opacity-50" />
        <div ref={headerRef} className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-brand/80 mb-4 block">
              Premium Collection
            </span>
            <h1 className="font-display font-black text-5xl sm:text-7xl tracking-tighter leading-none mb-6">
              Shop All Beds
            </h1>
            <p className="text-white/50 text-lg max-w-xl font-light leading-relaxed">
              Discover British craftsmanship at its finest. Search by size, category, or style to
              find your perfect bed.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        {/* ── Search + Sort bar ── */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <input
              type="search"
              placeholder='Try "King Size", "Ottoman", "Small Double"…'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 sm:h-14 pl-11 sm:pl-12 pr-10 rounded-2xl border border-border bg-card text-sm focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/30 transition-all duration-300"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center gap-2 h-12 px-5 rounded-2xl border border-border bg-card text-sm font-bold active:scale-95 transition-all"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters {hasActiveFilters && <span className="h-2 w-2 rounded-full bg-brand" />}
          </button>
          <div className="relative min-w-[160px] sm:min-w-[180px]">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="w-full h-12 sm:h-14 rounded-2xl border border-border bg-card px-4 sm:px-5 pr-10 text-sm font-semibold appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-brand/5 transition-all duration-300"
            >
              <option value="featured">Most Popular</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
            <ChevronDown className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-8 lg:gap-12">
          {/* ── Sidebar Filters ── */}
          <aside
            className={`${
              showFilters ? "fixed inset-0 z-50 bg-background overflow-y-auto" : "hidden"
            } lg:block lg:sticky lg:top-24 h-fit`}
          >
            <div className={`space-y-4 ${showFilters ? "p-6" : ""}`}>
              {showFilters && (
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <h2 className="text-2xl font-black">Filters</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}

              {/* Category Filter */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-display font-bold text-xs mb-4 text-foreground/60 uppercase tracking-widest">
                  Category
                </h3>
                <ul className="space-y-2.5">
                  {dynamicCategories.map((cat) => (
                    <li key={cat}>
                      <label className="flex items-center gap-3 text-sm cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedCats.includes(cat)}
                          onChange={() => toggleCat(cat)}
                          className="rounded accent-brand w-4 h-4 cursor-pointer"
                        />
                        <span
                          className={`transition-colors capitalize ${selectedCats.includes(cat) ? "text-brand font-bold" : "text-muted-foreground group-hover:text-foreground"}`}
                        >
                          {cat.replace(/-/g, " ")}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Size Filter */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-display font-bold text-xs mb-4 text-foreground/60 uppercase tracking-widest">
                  Bed Size
                </h3>
                <ul className="space-y-2.5">
                  {dynamicSizes.map((sz) => (
                    <li key={sz}>
                      <label className="flex items-center gap-3 text-sm cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(sz)}
                          onChange={() => toggleSize(sz)}
                          className="rounded accent-brand w-4 h-4 cursor-pointer"
                        />
                        <span
                          className={`transition-colors ${selectedSizes.includes(sz) ? "text-brand font-bold" : "text-muted-foreground group-hover:text-foreground"}`}
                        >
                          {sz}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-xs text-foreground/60 uppercase tracking-widest">
                    Budget
                  </h3>
                  <span className="text-xs font-black text-brand bg-brand/10 px-2 py-1 rounded-lg">
                    Up to £{maxPrice}
                  </span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={1500}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-brand cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground mt-2">
                  <span>£200</span>
                  <span>£1,500</span>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setSelectedCats([]);
                    setSelectedSizes([]);
                    setMaxPrice(1500);
                    setSearch("");
                  }}
                  className="w-full py-3 text-xs font-bold text-muted-foreground hover:text-brand transition-colors uppercase tracking-widest border border-dashed border-border rounded-2xl"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {/* ── Products Grid ── */}
          <div className="min-h-[400px]">
            {/* Active filter pills + count */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <p className="text-sm font-medium text-muted-foreground mr-2">
                <span className="text-foreground font-black">{list.length}</span> beds found
              </p>
              {search && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold">
                  "{search}"
                  <button onClick={() => setSearch("")}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedCats.map((c) => (
                <button
                  key={c}
                  onClick={() => toggleCat(c)}
                  className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold flex items-center gap-1 hover:bg-indigo-500/20 transition-all"
                >
                  {c.replace(/-/g, " ")} <X className="h-2.5 w-2.5" />
                </button>
              ))}
              {selectedSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSize(s)}
                  className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold flex items-center gap-1 hover:bg-emerald-500/20 transition-all"
                >
                  {s} <X className="h-2.5 w-2.5" />
                </button>
              ))}
            </div>

            {list.length === 0 ? (
              <div className="text-center py-24 bg-card rounded-3xl border border-dashed border-border">
                <div className="text-5xl mb-4">🛋️</div>
                <h3 className="font-display font-black text-xl">No beds found</h3>
                <p className="text-muted-foreground mt-2 text-sm max-w-xs mx-auto">
                  Try a different size, category, or reset your filters.
                </p>
                <button
                  onClick={() => {
                    setMaxPrice(1500);
                    setSearch("");
                    setSelectedCats([]);
                    setSelectedSizes([]);
                  }}
                  className="mt-6 h-11 px-7 rounded-2xl bg-brand text-brand-foreground font-black text-sm hover:scale-105 active:scale-95 transition-all"
                >
                  Show All Beds
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {list.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
