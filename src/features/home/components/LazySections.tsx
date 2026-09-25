import React from "react";
import { motion, useInView } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useRef } from "react";

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
  const skipAnim =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <motion.div
      ref={ref}
      initial={skipAnim ? { opacity: 1 } : { opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: skipAnim ? 0 : delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:pb-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#040d1a]">
          <div className="absolute -right-16 -bottom-16 h-80 w-80 rounded-full bg-[#1E5F8B]/30 blur-3xl" />
          <div className="absolute right-48 top-0 h-56 w-56 rounded-full bg-[#0d5ea6]/20 blur-3xl" />
          <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-[#0B3C5D]/40 blur-3xl" />

          <div className="relative grid md:grid-cols-2 gap-10 items-center p-10 sm:p-16">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#5b9bd5]/80 font-bold">
                Limited Time Offer
              </span>
              <h2 className="font-display font-black text-4xl sm:text-5xl mt-4 leading-tight text-white">
                Up to 50% OFF
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5b9bd5] to-white">
                  Bestselling Beds.
                </span>
              </h2>
              <p className="mt-5 text-white/60 text-base max-w-md leading-relaxed">
                Build your dream bed with custom fabrics, mattresses and storage. Free UK delivery +
                Cash on Delivery available.
              </p>
              <Link
                to="/shop"
                className="inline-flex mt-8 items-center gap-2 h-12 px-8 rounded-2xl bg-white text-[#0B3C5D] font-bold text-sm hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                Shop The Sale <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="hidden md:grid grid-cols-2 gap-4">
              {[
                { val: "50%", label: "Max Discount" },
                { val: "Free", label: "UK Delivery" },
                { val: "COD", label: "Cash on Delivery" },
                { val: "1 Yr", label: "Warranty" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/8 text-center hover:bg-white/8 transition-colors"
                >
                  <div className="font-display font-black text-3xl text-white">{s.val}</div>
                  <div className="text-xs text-white/50 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function Testimonials({ reviews }: { reviews: any[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24">
      <Reveal className="text-center mb-14">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-brand/60 mb-2">
          Testimonials
        </p>
        <h2 className="font-display font-black text-3xl sm:text-5xl">What Our Sleepers Say</h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
          Join 10,000+ happy customers who transformed their bedrooms with AQ Beds.
        </p>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <Reveal key={r.name} delay={(i % 3) * 0.1}>
            <div className="relative h-full bg-card border border-border rounded-3xl p-8 hover:border-brand/30 hover:shadow-luxury transition-all duration-300 group overflow-hidden">
              <div className="absolute top-6 right-6 text-7xl text-brand/4 font-serif font-black leading-none select-none">
                "
              </div>
              <div className="flex gap-1 mb-5">
                {[...Array(r.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-foreground/85 leading-relaxed text-sm mb-7 italic relative z-10">
                "{r.comment}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand to-blue-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm text-brand">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.city}, UK</p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
