import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

const HOLO_IMAGES = [
  "/Home%20page%20images/1000152185-clean.webp",
  "/Home%20page%20images/1000152187-clean.webp",
  "/Home%20page%20images/1000152189-clean.webp",
  "/Home%20page%20images/1000152191-clean.webp",
  "/Home%20page%20images/1000152193-clean.webp",
  "/Home%20page%20images/1000152195-clean.webp",
  "/Home%20page%20images/1000152197-clean.webp",
  "/Home%20page%20images/1000152199-clean.webp",
];

const MOBILE_IMAGES = [
  "/Home%20page%20images%20for%20mobile/1000155658-clean.webp",
  "/Home%20page%20images%20for%20mobile/1000155659-clean.webp",
  "/Home%20page%20images%20for%20mobile/1000155660-clean.webp",
  "/Home%20page%20images%20for%20mobile/1000155661-clean.webp",
  "/Home%20page%20images%20for%20mobile/1000155662-clean.webp",
  "/Home%20page%20images%20for%20mobile/1000155663-clean.webp",
  "/Home%20page%20images%20for%20mobile/1000155664-clean.webp",
  "/Home%20page%20images%20for%20mobile/1000155665-clean.webp",
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const nextStep = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % HOLO_IMAGES.length);
  }, []);

  const prevStep = useCallback(() => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + HOLO_IMAGES.length) % HOLO_IMAGES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextStep, 6000);
    return () => clearInterval(timer);
  }, [nextStep]);

  const variants = useMemo(
    () => ({
      enter: { opacity: 0, scale: 1.05 },
      center: { opacity: 1, scale: 1, zIndex: 1 },
      exit: { opacity: 0, scale: 0.95, zIndex: 0 },
    }),
    [],
  );

  // Optimized Preloader
  useEffect(() => {
    const nextIdx = (index + 1) % HOLO_IMAGES.length;
    const preload = document.createElement("link");
    preload.rel = "preload";
    preload.as = "image";
    preload.href = isMobile ? MOBILE_IMAGES[nextIdx] : HOLO_IMAGES[nextIdx];
    document.head.appendChild(preload);
    return () => {
      document.head.removeChild(preload);
    };
  }, [index, isMobile]);

  // 3D tilt (Desktop only)
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(y, [0, 1], [4, -4]), { damping: 40, stiffness: 80 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-4, 4]), { damping: 40, stiffness: 80 });

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isMobile) return;
    const { clientX, clientY, currentTarget } = event;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set((clientX - left) / width);
    y.set((clientY - top) / height);
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-[#050505] aspect-[3/4] sm:aspect-[4/5] md:h-auto md:aspect-video md:min-h-[600px] 2xl:max-h-[850px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0.5);
        y.set(0.5);
      }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Priority 1 Fix: Static fallback for first image to prevent black box before hydration */}
        <div className="absolute inset-0 h-full w-full pointer-events-none">
          <picture>
            <source media="(max-width: 767px)" srcSet={MOBILE_IMAGES[0]} />
            <source media="(min-width: 768px)" srcSet={HOLO_IMAGES[0]} />
            <img
              src={isMobile ? MOBILE_IMAGES[0] : HOLO_IMAGES[0]}
              alt=""
              fetchPriority="high"
              loading="eager"
              decoding="sync"
              className="h-full w-full object-cover object-center"
            />
          </picture>
        </div>

        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.8 } }}
            className="absolute inset-0 h-full w-full z-10"
          >
            <picture>
              <source media="(max-width: 767px)" srcSet={MOBILE_IMAGES[index]} />
              <source media="(min-width: 768px)" srcSet={HOLO_IMAGES[index]} />
              <img
                src={isMobile ? MOBILE_IMAGES[index] : HOLO_IMAGES[index]}
                alt="Luxury Bed Collection"
                fetchPriority={index === 0 ? "high" : "auto"}
                loading="eager"
                decoding="async"
                className="h-full w-full object-cover object-center transform-gpu will-change-transform"
              />
            </picture>
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 z-20" />
      </div>

      <div className="relative z-30 h-full flex flex-col items-center justify-center pointer-events-none px-4">
        <motion.div
          style={!isMobile ? { rotateX, rotateY, perspective: 1000 } : {}}
          className="w-full max-w-4xl text-center transform-gpu"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden sm:flex justify-center mb-6"
          >
            <span className="inline-block px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/70 text-[10px] sm:text-[11px] font-bold tracking-[0.3em] uppercase">
              Est. 2018 — Luxury British Craftsmanship
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-white font-display font-black tracking-tighter select-none leading-[1.05] mb-4 sm:mb-6"
            style={{ fontSize: "clamp(2.5rem, 9vw, 7.5rem)" }}
          >
            Sleep Like{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-50 to-blue-200">
              Royalty.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="hidden sm:block text-white/50 text-lg sm:text-xl max-w-2xl mx-auto mb-8 font-light leading-relaxed"
          >
            Handcrafted luxury beds designed for perfect sleep and tailored to your room.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 pointer-events-auto px-2"
          >
            <Link
              to="/shop"
              className="group relative h-12 sm:h-14 px-8 sm:px-10 rounded-full bg-white text-[#0B3C5D] font-black text-sm sm:text-base flex items-center gap-2 overflow-hidden transition-all hover:scale-105 active:scale-95 w-full sm:w-auto justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Shop Collection
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>
            <Link
              to="/category/$slug"
              params={{ slug: "ottoman-beds" }}
              className="h-12 sm:h-14 px-8 sm:px-10 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white font-bold text-sm sm:text-base flex items-center transition-all hover:bg-white/10 active:scale-95 w-full sm:w-auto justify-center"
            >
              Best Sellers
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-5 sm:bottom-10 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-10 z-40 flex items-center gap-2">
        <button
          onClick={prevStep}
          aria-label="Previous slide"
          className="min-h-[44px] min-w-[44px] sm:h-12 sm:w-12 rounded-full border border-white/20 bg-black/40 backdrop-blur-xl text-white flex items-center justify-center hover:bg-white hover:text-black transition-all active:scale-90"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex gap-1.5 items-center px-2">
          {HOLO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              aria-label={`Go to slide ${i + 1} of ${HOLO_IMAGES.length}`}
              className={`min-h-[44px] min-w-[28px] flex items-center justify-center rounded-full transition-all duration-300 ${i === index ? "bg-white w-5 h-1.5" : "bg-white/40 w-1.5 h-1.5"}`}
            />
          ))}
        </div>
        <button
          onClick={nextStep}
          aria-label="Next slide"
          className="min-h-[44px] min-w-[44px] sm:h-12 sm:w-12 rounded-full border border-white/20 bg-black/40 backdrop-blur-xl text-white flex items-center justify-center hover:bg-white hover:text-black transition-all active:scale-90"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
