import { createFileRoute, Link } from "@tanstack/react-router";
import { PRODUCTS } from "@/features/products/data/products";
import { ProductCard } from "@/features/products/components/ProductCard";
import { useWishlist } from "@/features/cart/store/cart";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — AQ Beds" },
      { name: "description", content: "View your saved AQ Beds favourites. Add to basket or remove items from your wishlist." },
      { property: "og:title", content: "Wishlist — AQ Beds" },
      { property: "og:description", content: "View your saved AQ Beds favourites." },
      { property: "og:image", content: "https://www.aqbeds.com/Home%20page%20images/1000152185-clean.webp" },
      { property: "og:url", content: "https://www.aqbeds.com/wishlist" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Wishlist — AQ Beds" },
      { name: "twitter:image", content: "https://www.aqbeds.com/Home%20page%20images/1000152185-clean.webp" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const ids = useWishlist((s) => s.ids);
  const items = PRODUCTS.filter((p) => ids.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 animate-fade-in">
      <h1 className="font-display font-bold text-3xl">Your Wishlist</h1>
      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No saved items yet.</p>
          <Link
            to="/shop"
            className="inline-block mt-4 h-11 px-6 leading-[2.75rem] rounded-2xl bg-cta text-cta-foreground font-semibold"
          >
            Browse beds
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
