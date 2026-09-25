import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useMotionValue, useTransform, useSpring, useInView } from "framer-motion";
import { CATEGORIES, PRODUCTS } from "@/features/products/data/products";
import { ProductCard } from "@/features/products/components/ProductCard";
import { HeroCarousel } from "@/components/ui/HeroCarousel";
import { ArrowRight, Truck, MessageCircle, Award, Star } from "lucide-react";
import React, { useRef, lazy, Suspense, useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AQ Beds — Luxury Beds Designed For Perfect Sleep" },
      {
        name: "description",
        content:
          "Premium ottoman, divan & storage beds with modern comfort. Up to 50% OFF + free delivery.",
      },
      { property: "og:title", content: "AQ Beds — Luxury Beds Designed For Perfect Sleep" },
      { property: "og:description", content: "Premium ottoman, divan & storage beds with modern comfort. Up to 50% OFF + free delivery." },
      { property: "og:image", content: "https://www.aqbeds.com/Home%20page%20images/1000152185-clean.webp" },
      { property: "og:url", content: "https://www.aqbeds.com" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AQ Beds — Luxury Beds Designed For Perfect Sleep" },
      { name: "twitter:image", content: "https://www.aqbeds.com/Home%20page%20images/1000152185-clean.webp" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "AQ Beds",
          url: "https://aqbeds.vercel.app",
          logo: "https://aqbeds.vercel.app/logo.png",
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+44-7519-791128",
            contactType: "customer service",
          },
        }),
      },
    ],
  }),
  component: Home,
});

const Testimonials = lazy(() => import("@/features/home/components/LazySections"));
const PromoBanner = lazy(() =>
  import("@/features/home/components/LazySections").then((m) => ({ default: m.PromoBanner })),
);

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "20px" });

  // Bug 1 Fix: Ensure initial sections are visible if JavaScript/IO is delayed or on first render
  const [hasAppeared, setHasAppeared] = useState(false);
  useEffect(() => {
    if (inView) setHasAppeared(true);
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={inView || hasAppeared ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.4, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Home() {
  // Best Sellers - Only Beds
  const bestsellingSlugs = [
    "ambessador", // Bed
    "divan-ottoman-bed", // Bed
    "panel-line", // Bed
    "florida-bed", // Bed
    "sleigh", // Bed
    "oxford-wingback", // Bed
    "hilton", // Bed
    "arizona", // Bed
  ];
  const featured = bestsellingSlugs
    .map((slug) => PRODUCTS.find((p) => p.slug === slug))
    .filter(Boolean) as typeof PRODUCTS;
  const disableHero = typeof window !== "undefined" && (window as any).__AQ_FLAGS?.DISABLE_HERO;

  const reviews = [
    {
      name: "Sarah Jenkins",
      city: "London",
      comment:
        "The Aurora Ottoman bed is a game changer! The storage is huge and the plush velvet feels so premium. Delivery was super fast too.",
      rating: 5,
    },
    {
      name: "David Thompson",
      city: "Manchester",
      comment:
        "Best sleep I've had in years. The mattress we added is perfect. Great quality bed frame and very sturdy. Highly recommend!",
      rating: 5,
    },
    {
      name: "Emma Wilson",
      city: "Birmingham",
      comment:
        "I was hesitant to buy a bed online but AQ Beds exceeded my expectations. The color is exactly like the pictures and it looks beautiful in my room.",
      rating: 5,
    },
    {
      name: "James Miller",
      city: "Leeds",
      comment:
        "Incredible quality for the price. The hydraulic lift on the ottoman bed is so smooth. This is my second purchase from them!",
      rating: 5,
    },
    {
      name: "Chloe Davies",
      city: "Bristol",
      comment:
        "Fast delivery and great communication. The assembly was straightforward and the bed looks much more expensive than it was.",
      rating: 5,
    },
    {
      name: "Noah Smith",
      city: "Glasgow",
      comment:
        "Finally found a bed that doesn't creak! Super solid frame and the fabric is top notch. 10/10 service.",
      rating: 5,
    },
  ];

  return (
    <div className="overflow-x-hidden">
      {!disableHero && <HeroCarousel />}

      {/* ══════════════════════════════════════════════════════
          TRUST BADGES — Elevated glass
      ══════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Award, t: "Premium Quality", s: "Handcrafted British excellence" },
              { icon: Truck, t: "Free UK Delivery", s: "Fast, reliable, to your door" },
              { icon: MessageCircle, t: "WhatsApp Support", s: "One message away, always" },
            ].map(({ icon: Icon, t, s }) => (
              <div
                key={t}
                className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border hover:border-brand/30 hover:shadow-luxury transition-all duration-300 group"
              >
                <div className="h-12 w-12 rounded-xl bg-brand/10 text-brand grid place-items-center flex-shrink-0 group-hover:bg-brand group-hover:text-white transition-all duration-300">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{t}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════════
          CATEGORIES — Bento Grid
      ══════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:py-16">
        <Reveal className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-brand/60 mb-2">
              Explore
            </p>
            <h2 className="font-display font-black text-3xl sm:text-5xl">Shop By Category</h2>
            <p className="text-muted-foreground mt-3 max-w-md">
              Curated collections crafted for every bedroom — find your perfect centrepiece.
            </p>
          </div>
          <Link
            to="/shop"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-brand hover:gap-3 transition-all group"
          >
            View all{" "}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* All Beds - Large Card (Spans full width on mobile for impact) */}
          <Reveal className="col-span-2 md:row-span-2 h-full">
            <Link
              to="/category/$slug"
              params={{ slug: "all-beds" }}
              className="group relative overflow-hidden rounded-3xl block w-full h-full min-h-[220px] sm:min-h-[320px] md:min-h-[440px] tap-highlight-transparent"
            >
              <div className="absolute inset-0">
                <img
                  src={CATEGORIES.find((c) => c.slug === "all-beds")?.image}
                  alt="All Beds"
                  className="h-full w-full object-cover transition-transform duration-700 md:group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-brand/20 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 text-white">
                <h3 className="font-display font-black text-2xl sm:text-4xl">All Beds</h3>
                <p className="text-xs sm:text-base text-white/70 mt-1 sm:mt-2">
                  Our entire collection of handcrafted beds
                </p>
                <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold mt-4 sm:mt-6 px-4 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm md:group-hover:bg-brand md:group-hover:border-brand transition-all">
                  Explore Collection <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          </Reveal>

          {/* Other Categories - Use a more attractive 4:5 aspect ratio on mobile instead of square */}
          {CATEGORIES.filter((c) => c.slug !== "all-beds")
            .slice(0, 10)
            .map((c, i) => {
              const content = (
                <Link
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="group relative overflow-hidden rounded-2xl sm:rounded-3xl block aspect-[4/5] sm:aspect-square cursor-pointer active:scale-[0.98] transition-transform tap-highlight-transparent bg-muted"
                >
                  <div className="absolute inset-0">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="h-full w-full object-cover transition-transform duration-700 md:group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white">
                    <h3 className="font-display font-bold text-base sm:text-xl">{c.name}</h3>
                    <p className="hidden sm:block text-[10px] sm:text-xs text-white/70 mt-1 opacity-0 md:group-hover:opacity-100 translate-y-2 md:group-hover:translate-y-0 transition-all duration-300">
                      {c.blurb}
                    </p>
                  </div>
                </Link>
              );
              return (
                <React.Fragment key={c.slug}>
                  <div className="hidden md:block">
                    <Reveal delay={(i + 1) * 0.05} className="h-full">
                      {content}
                    </Reveal>
                  </div>
                  <div className="block md:hidden">{content}</div>
                </React.Fragment>
              );
            })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <Reveal className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-brand/60 mb-2">
              Bestsellers
            </p>
            <h2 className="font-display font-black text-3xl sm:text-5xl">Our Most Loved Beds</h2>
            <p className="text-muted-foreground mt-3 max-w-md">
              Handpicked favourites, loved by thousands of sleepers across the UK.
            </p>
          </div>
          <Link
            to="/shop"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-brand hover:gap-3 transition-all group"
          >
            Full Shop{" "}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.05}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PROMO BANNER & TESTIMONIALS (LAZY LOADED)
      ══════════════════════════════════════════════════════ */}
      <Suspense fallback={null}>
        <PromoBanner />
        <Testimonials reviews={reviews} />
      </Suspense>
    </div>
  );
}
