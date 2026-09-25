import { createFileRoute, Link } from "@tanstack/react-router";
import { searchProducts } from "@/features/products/data/products";
import { ProductCard } from "@/features/products/components/ProductCard";
import { z } from "zod";

export const Route = createFileRoute("/search")({
  validateSearch: (s) => z.object({ q: z.string().optional() }).parse(s),
  head: () => ({
    meta: [
      { title: "Search — AQ Beds" },
      { name: "description", content: "Search for luxury beds, ottomans, divans, sofas and bedroom furniture at AQ Beds." },
      { property: "og:title", content: "Search — AQ Beds" },
      { property: "og:description", content: "Search for luxury beds, ottomans, divans, sofas and bedroom furniture at AQ Beds." },
      { property: "og:image", content: "https://www.aqbeds.com/Home%20page%20images/1000152185-clean.webp" },
      { property: "og:url", content: "https://www.aqbeds.com/search" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Search — AQ Beds" },
      { name: "twitter:image", content: "https://www.aqbeds.com/Home%20page%20images/1000152185-clean.webp" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q = "" } = Route.useSearch();
  const results = searchProducts(q);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 animate-fade-in">
      <h1 className="font-display font-bold text-3xl">
        {q ? (
          <>
            Results for "<span className="text-brand">{q}</span>"
          </>
        ) : (
          "Search"
        )}
      </h1>
      <p className="text-muted-foreground mt-2">
        {q ? `${results.length} products found` : "Type a search term above."}
      </p>
      {results.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : q ? (
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">No products matched your search.</p>
          <Link
            to="/shop"
            className="inline-block mt-4 h-11 px-6 leading-[2.75rem] rounded-2xl bg-cta text-cta-foreground font-semibold"
          >
            Browse all
          </Link>
        </div>
      ) : null}
    </div>
  );
}
