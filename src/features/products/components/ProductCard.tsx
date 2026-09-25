import { Link } from "@tanstack/react-router";
import { Heart, Star, ShoppingBag, ArrowRight } from "lucide-react";
import type { Product } from "@/features/products/data/products";
import { formatGBP } from "@/lib/utils/format";
import { useWishlist } from "@/features/cart/store/cart";
import { motion } from "framer-motion";
import { useState } from "react";

const MotionLink = motion(Link) as any;

export function ProductCard({ product }: { product: Product }) {
  const wish = useWishlist();
  const isWished = wish.has(product.id);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group relative flex flex-col rounded-3xl bg-card border border-border overflow-hidden shadow-soft hover:shadow-luxury hover:border-brand/20 transition-all duration-400 no-underline text-foreground cursor-pointer md:hover:-translate-y-1 tap-highlight-transparent"
    >
      {/* Image container */}
      <div
        className="block relative overflow-hidden bg-secondary w-full"
        style={{ aspectRatio: "16 / 9" }}
      >
        {/* Skeleton shimmer */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-border to-secondary animate-[shimmer_1.5s_infinite]" />
        )}

        <img
          src={product.images[0]}
          alt={`${product.name} — AQ Beds`}
          loading="lazy"
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          ref={(img) => {
            if (img?.complete && !imgLoaded) {
              setImgLoaded(true);
            }
          }}
          className={`h-full w-full object-contain transition-transform duration-700 group-hover:scale-108 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
        />

        {/* Cinematic gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.onSale && (
            <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white text-[10px] font-black tracking-wider uppercase shadow-lg">
              Sale
            </span>
          )}
          {product.isNew && (
            <span className="px-2.5 py-1 rounded-full bg-brand text-brand-foreground text-[10px] font-black tracking-wider uppercase shadow-lg">
              New
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            wish.toggle(product.id);
          }}
          aria-label="Toggle wishlist"
          className={`absolute top-3 right-3 h-9 w-9 rounded-full backdrop-blur grid place-items-center transition-all duration-300 z-10 ${
            isWished ? "bg-rose-500 scale-110" : "bg-card/80 hover:bg-rose-50 hover:scale-110"
          }`}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${isWished ? "fill-white text-white" : "text-muted-foreground"}`}
          />
        </button>

        {/* Quick view CTA — appears on hover */}
        <div className="absolute bottom-3 inset-x-3 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <div className="flex items-center justify-center gap-2 h-10 rounded-xl bg-white/90 backdrop-blur text-brand text-xs font-bold shadow-lg">
            <ArrowRight className="h-3.5 w-3.5" />
            View &amp; Customise
          </div>
        </div>
      </div>

      {/* Info panel */}
      <div className="p-4 sm:p-5 flex flex-col gap-2">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold tabular-nums text-foreground">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-muted-foreground">· {product.reviews} reviews</span>
        </div>

        <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-brand transition-colors duration-200 text-sm sm:text-base">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="font-display font-black text-lg text-brand">
            {formatGBP(product.basePrice)}
          </span>
          {product.originalPrice && product.originalPrice > product.basePrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatGBP(product.originalPrice)}
            </span>
          )}
          {product.onSale && product.originalPrice && (
            <span className="text-xs font-bold text-rose-500 ml-auto">
              {Math.round((1 - product.basePrice / product.originalPrice) * 100)}% OFF
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            In stock · Free delivery
          </span>
        </div>
      </div>
    </Link>
  );
}
