import { Link, useLocation } from "@tanstack/react-router";
import { Search, ShoppingBag, Menu, X, Heart, Sparkles, ArrowRight } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useCart, useUI, useWishlist } from "@/features/cart/store/cart";
import { CATEGORIES, PRODUCTS, getSearchSuggestions } from "@/features/products/data/products";
import { buildWhatsAppUrl, formatGBP } from "@/lib/utils/format";
import { motion, AnimatePresence } from "framer-motion";

export function TopPromoBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="relative bg-gradient-to-r from-brand via-[#1E5F8B] to-brand text-white text-xs sm:text-sm overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 py-2.5 flex items-center justify-center gap-4 text-center">
        <Sparkles className="h-3.5 w-3.5 opacity-70 flex-shrink-0" />
        <span className="font-semibold tracking-wide">
          ✦ Free Delivery On All Beds &nbsp;·&nbsp; Up To 50% OFF This Week &nbsp;·&nbsp; Cash on
          Delivery Available ✦
        </span>
        <Sparkles className="h-3.5 w-3.5 opacity-70 flex-shrink-0" />
        <button
          onClick={() => setVisible(false)}
          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition"
          aria-label="Close banner"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

export function Header() {
  if (typeof window !== "undefined") {
    const now = performance.now();
    console.log(`[AQ-DEBUG] Header Rendered at: ${now.toFixed(2)}ms`);
  }

  useEffect(() => {
    const now = performance.now();
    console.log(`[AQ-DEBUG] Header Mounted at: ${now.toFixed(2)}ms`);
  }, []);

  const count = useCart((s) => s.count());
  const wishCount = useWishlist((s) => s.ids.length);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const [menu, setMenu] = useState(false);
  const [q, setQ] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Detect scroll for glass-morph transition
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenu(false);
  }, [location.pathname]);

  const navLinks = [
    { label: "Shop All", to: "/shop" as const },
    { label: "Divan Beds", to: "/category/$slug" as const, params: { slug: "divan-beds" } },
    { label: "Ottoman Beds", to: "/category/$slug" as const, params: { slug: "ottoman-beds" } },
    { label: "Storage Beds", to: "/category/$slug" as const, params: { slug: "storage-beds" } },
    { label: "Luxury Beds", to: "/category/$slug" as const, params: { slug: "luxury-beds" } },
    { label: "Mattresses", to: "/category/$slug" as const, params: { slug: "mattresses" } },
  ];

  const suggestions = useMemo(() => getSearchSuggestions(q), [q]);

  return (
    <>
      <TopPromoBar />
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 md:backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06)] border-b border-border/50"
            : "bg-background/80 md:backdrop-blur-md border-b border-border/30"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-4 h-16 lg:h-[68px]">
            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-accent transition min-h-[44px] min-w-[44px]"
              onClick={() => setMenu(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo */}
            <h1 className="m-0">
              <Link
                to="/"
                className="flex items-center gap-2.5 shrink-0 group"
                aria-label="AQ Beds Home"
              >
                <div className="h-9 w-9 rounded-xl bg-brand grid place-items-center text-brand-foreground font-display font-black text-sm shadow-[0_0_20px_rgba(11,60,93,0.3)] group-hover:shadow-[0_0_30px_rgba(11,60,93,0.5)] transition-all duration-300">
                  AQ
                </div>
                <span className="font-display font-black text-xl tracking-tight hidden sm:inline">
                  AQ <span className="text-brand">Beds</span>
                </span>
              </Link>
            </h1>

            {/* Desktop search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-auto relative group">
              <form action="/search" method="get" className="w-full relative">
                <input
                  name="q"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search beds, mattresses, headboards…"
                  className="w-full h-10 rounded-2xl border border-border bg-card/60 pl-10 pr-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all duration-200"
                  autoComplete="off"
                  aria-label="Search"
                />
                <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </form>

              {/* Desktop Live Search Results */}
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-12 left-0 w-full bg-background border border-border rounded-2xl shadow-xl overflow-hidden z-50 flex flex-col"
                  >
                    <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-secondary/50 border-b border-border">
                      Search Suggestions
                    </div>
                    <div className="max-h-[70vh] overflow-y-auto">
                      {suggestions.map((s: any, idx: number) => {
                        if (s.type === "category")
                          return (
                            <Link
                              key={idx}
                              to="/category/$slug"
                              params={{ slug: s.slug! }}
                              onClick={() => setQ("")}
                              className="flex items-center gap-3 p-3 hover:bg-brand/5 border-b border-border last:border-0 group"
                            >
                              <Sparkles className="h-4 w-4 text-brand/50 group-hover:text-brand" />
                              <span className="text-sm font-semibold">
                                In <span className="text-brand">{s.label}</span>
                              </span>
                            </Link>
                          );
                        if (s.type === "product") {
                          return (
                            <Link
                              key={idx}
                              to="/product/$slug"
                              params={{ slug: s.slug! }}
                              onClick={() => setQ("")}
                              className="flex items-center gap-4 p-4 hover:bg-accent border-b border-border last:border-0 group transition-all"
                            >
                              <div className="h-14 w-14 rounded-xl overflow-hidden shadow-sm flex-shrink-0 bg-secondary">
                                <img
                                  src={s.image}
                                  alt=""
                                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                />
                              </div>
                              <div className="flex flex-col flex-1 min-w-0 gap-1">
                                <span className="text-sm font-bold truncate group-hover:text-brand transition-colors tracking-tight">
                                  {s.label}
                                </span>
                                <div className="flex items-center gap-2.5">
                                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md">
                                    {s.categoryName?.replace(/-/g, " ")}
                                  </span>
                                  <span className="h-1 w-1 rounded-full bg-border" />
                                  <span className="text-sm font-black text-brand">
                                    {s.price ? formatGBP(s.price) : ""}
                                  </span>
                                </div>
                              </div>
                              <div className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground group-hover:bg-brand group-hover:text-white group-hover:border-brand transition-all">
                                <ArrowRight className="h-3.5 w-3.5" />
                              </div>
                            </Link>
                          );
                        }
                        return (
                          <Link
                            key={idx}
                            to="/search"
                            search={{ q: s.label }}
                            onClick={() => setQ("")}
                            className="flex items-center gap-3 p-3 hover:bg-accent border-b border-border last:border-0 group"
                          >
                            <Search className="h-4 w-4 text-muted-foreground group-hover:text-brand" />
                            <span className="text-sm">{s.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right actions */}
            <div className="ml-auto flex items-center gap-1">
              {/* WhatsApp CTA */}
              <a
                href={buildWhatsAppUrl("Hello AQ Beds, I'd like to chat about an order.")}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-2xl bg-[#25D366] text-white px-4 h-9 text-xs font-bold hover:bg-[#20ba5a] transition-all hover:scale-105 shadow-[0_0_15px_rgba(37,211,102,0.25)]"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                  <path d="M20.52 3.48A11.93 11.93 0 0 0 12.04 0C5.5 0 .2 5.3.2 11.84c0 2.09.55 4.13 1.6 5.93L0 24l6.4-1.68a11.86 11.86 0 0 0 5.64 1.44h.01c6.54 0 11.84-5.3 11.84-11.84 0-3.16-1.23-6.13-3.37-8.44ZM12.05 21.5h-.01a9.66 9.66 0 0 1-4.93-1.35l-.35-.21-3.8 1 1.01-3.7-.23-.38a9.65 9.65 0 1 1 17.94-5.02 9.66 9.66 0 0 1-9.63 9.66Zm5.52-7.23c-.3-.15-1.79-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.36.22-.66.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.36.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51l-.58-.01c-.2 0-.53.07-.81.38-.28.3-1.07 1.05-1.07 2.55s1.1 2.97 1.25 3.17c.15.2 2.16 3.3 5.23 4.62.73.31 1.3.5 1.74.64.73.23 1.4.2 1.92.12.59-.09 1.79-.73 2.05-1.43.26-.7.26-1.3.18-1.42-.07-.13-.27-.2-.57-.35Z" />
                </svg>
                WhatsApp
              </a>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2.5 rounded-xl hover:bg-accent transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                <AnimatePresence>
                  {wishCount > 0 && (
                    <motion.span
                      key="wish-count"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] grid place-items-center font-bold"
                    >
                      {wishCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 rounded-xl hover:bg-accent transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={`Open basket${count > 0 ? ` (${count} item${count > 1 ? "s" : ""})` : ""}`}
              >
                <ShoppingBag className="h-5 w-5" />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      key="cart-count"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-brand text-brand-foreground text-[10px] grid place-items-center font-bold"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-2 h-14 text-[15px] font-bold overflow-x-auto scrollbar-none pb-1 mt-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                // @ts-ignore
                params={link.params}
                className="px-5 py-2.5 rounded-full border border-border/60 bg-card shadow-sm text-muted-foreground font-semibold hover:border-brand/40 hover:bg-brand/5 hover:text-brand transition-all duration-300 whitespace-nowrap flex-shrink-0"
                activeProps={{
                  className:
                    "px-5 py-2.5 rounded-full border border-brand/50 bg-brand/10 text-brand font-bold whitespace-nowrap flex-shrink-0 shadow-sm transition-all duration-300 transform scale-[1.02]",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile search */}
          <div className="md:hidden pb-3 relative">
            <form action="/search" method="get" className="relative">
              <input
                name="q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search beds…"
                className="w-full h-10 rounded-2xl border border-border bg-card pl-10 pr-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
                autoComplete="off"
                aria-label="Search"
              />
              <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </form>

            {/* Mobile Live Results */}
            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute top-11 left-0 w-full bg-background border border-border rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden max-h-[60vh] overflow-y-auto"
                >
                  <div className="px-3 py-2 text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] bg-secondary/30">
                    Suggestions
                  </div>
                  {suggestions.map((s: any, idx: number) => {
                    if (s.type === "category")
                      return (
                        <Link
                          key={idx}
                          to="/category/$slug"
                          params={{ slug: s.slug! }}
                          onClick={() => setQ("")}
                          className="flex items-center gap-3 p-3 active:bg-accent border-b border-border last:border-0"
                        >
                          <div className="h-8 w-8 rounded-lg bg-brand/10 flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-brand" />
                          </div>
                          <span className="text-sm font-bold">
                            In <span className="text-brand">{s.label}</span>
                          </span>
                        </Link>
                      );
                    if (s.type === "product")
                      return (
                        <Link
                          key={idx}
                          to="/product/$slug"
                          params={{ slug: s.slug! }}
                          onClick={() => setQ("")}
                          className="flex items-center gap-3 p-3 active:bg-accent border-b border-border last:border-0"
                        >
                          <img
                            src={PRODUCTS.find((p) => p.id === s.slug)?.images[0]}
                            alt=""
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                          <div className="flex flex-col flex-1">
                            <span className="text-sm font-bold truncate">{s.label}</span>
                            <span className="text-[10px] text-muted-foreground">Product</span>
                          </div>
                        </Link>
                      );
                    return (
                      <Link
                        key={idx}
                        to="/search"
                        search={{ q: s.label }}
                        onClick={() => setQ("")}
                        className="flex items-center gap-3 p-3 active:bg-accent border-b border-border last:border-0"
                      >
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{s.label}</span>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer Menu ── */}
      <AnimatePresence>
        {menu && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMenu(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-background shadow-2xl flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-brand grid place-items-center text-brand-foreground font-black text-xs">
                    AQ
                  </div>
                  <span className="font-display font-black text-lg">AQ Beds</span>
                </div>
                <button
                  onClick={() => setMenu(false)}
                  aria-label="Close"
                  className="p-1.5 rounded-lg hover:bg-accent transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 mb-3">
                  Explore
                </p>
                {navLinks.map((link, i) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    // @ts-ignore
                    params={link.params}
                    onClick={() => setMenu(false)}
                    className="flex items-center px-4 py-3 rounded-2xl text-sm font-medium hover:bg-accent hover:text-brand transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-border mt-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 mb-3">
                    Account
                  </p>
                  <Link
                    to="/wishlist"
                    onClick={() => setMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium hover:bg-accent transition"
                  >
                    <Heart className="h-4 w-4" /> Wishlist
                    {wishCount > 0 && (
                      <span className="ml-auto text-xs font-bold text-rose-500">{wishCount}</span>
                    )}
                  </Link>
                </div>
              </nav>

              {/* WhatsApp CTA in drawer */}
              <div className="p-4 border-t border-border">
                <a
                  href={buildWhatsAppUrl("Hello AQ Beds, I'd like to enquire about a bed.")}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 h-12 rounded-2xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#20ba5a] transition"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M20.52 3.48A11.93 11.93 0 0 0 12.04 0C5.5 0 .2 5.3.2 11.84c0 2.09.55 4.13 1.6 5.93L0 24l6.4-1.68a11.86 11.86 0 0 0 5.64 1.44h.01c6.54 0 11.84-5.3 11.84-11.84 0-3.16-1.23-6.13-3.37-8.44Z" />
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
