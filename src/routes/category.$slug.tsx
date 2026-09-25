import { createFileRoute, notFound } from "@tanstack/react-router";
import { CATEGORIES, type Category, getByCategory } from "@/features/products/data/products";
import { getDbProducts } from "@/lib/products";
import { ProductCard } from "@/features/products/components/ProductCard";
import { motion } from "framer-motion";

export const Route = createFileRoute("/category/$slug")({
  loader: async ({ params }) => {
    const cat = CATEGORIES.find((c) => c.slug === params.slug);
    if (!cat) throw notFound();
    const dbProducts = await getDbProducts();
    return { category: cat, dbProducts };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.category.name} — AQ Beds` },
          {
            name: "description",
            content: `Shop ${loaderData.category.name} at AQ Beds. ${loaderData.category.blurb}.`,
          },
          { property: "og:title", content: `${loaderData.category.name} — AQ Beds` },
          { property: "og:description", content: `Shop ${loaderData.category.name} at AQ Beds. ${loaderData.category.blurb}.` },
          { property: "og:image", content: `https://www.aqbeds.com${loaderData.category.image}` },
          { property: "og:url", content: `https://www.aqbeds.com/category/${loaderData.category.slug}` },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "twitter:title", content: `${loaderData.category.name} — AQ Beds` },
          { name: "twitter:image", content: `https://www.aqbeds.com${loaderData.category.image}` },
        ]
      : [],
  }),
  component: CategoryPage,
  notFoundComponent: () => <div className="p-10 text-center">Category not found.</div>,
  errorComponent: ({ error }) => <div className="p-10 text-center">{error.message}</div>,
});

function CategoryPage() {
  const { category, dbProducts } = Route.useLoaderData();
  const staticProducts = getByCategory(category.slug as Category) as any[];
  const dbFiltered = (dbProducts || []).filter((p) => p.category === category.slug);
  const products = [...dbFiltered, ...staticProducts];

  return (
    <div className="animate-fade-in bg-background min-h-screen">
      <section className="relative w-full aspect-video overflow-hidden bg-background">
        <img
          src={category.image}
          alt={category.name}
          className="h-full w-full object-cover object-center"
        />
        {/* Cinematic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 sm:pb-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/70 font-bold">
              The Collection
            </span>
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl mt-2 tracking-tighter leading-none">
              {category.name}
            </h1>
            <p className="mt-4 text-sm sm:text-lg text-white/60 max-w-2xl font-light leading-relaxed">
              {category.blurb}
            </p>
          </motion.div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="text-sm text-muted-foreground mb-6">{products.length} products</div>
        {products.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-3xl border border-dashed border-border">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="font-display font-black text-xl">Coming Soon</h3>
            <p className="text-muted-foreground mt-2 text-sm max-w-xs mx-auto">
              We are working hard to bring you the best {category.name.toLowerCase()}! Please check
              back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
