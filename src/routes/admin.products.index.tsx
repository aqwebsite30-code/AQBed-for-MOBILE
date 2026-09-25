import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import {
  Search,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { db } from "@/lib/db";
import { useState } from "react";

export const getProducts = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    });
    return products;
  } catch {
    return [];
  }
});

export const Route = createFileRoute("/admin/products/")({
  loader: () => getProducts(),
  component: ProductsList,
});

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0)
    return (
      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
        <XCircle className="w-2.5 h-2.5" /> Out of Stock
      </span>
    );
  if (stock < 5)
    return (
      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <AlertTriangle className="w-2.5 h-2.5" /> Low · {stock}
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <CheckCircle className="w-2.5 h-2.5" /> {stock} in stock
    </span>
  );
}

function ProductsList() {
  const data = Route.useLoaderData() as any[];
  const [products, setProducts] = useState<any[]>(data ?? []);
  const [query, setQuery] = useState("");

  const filtered = products.filter(
    (p) =>
      !query ||
      p.name?.toLowerCase().includes(query.toLowerCase()) ||
      p.category?.toLowerCase().includes(query.toLowerCase()),
  );

  const card = {
    background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
    border: "1px solid rgba(255,255,255,0.06)",
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-wrap justify-between items-center gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Products</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {products.length} product{products.length !== 1 ? "s" : ""} in inventory
          </p>
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="flex items-center gap-3"
      >
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          />
        </div>
      </motion.div>

      {/* Table - Desktop */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="rounded-2xl overflow-hidden hidden md:block"
        style={card}
      >
        {/* Table head */}
        <div
          className="grid grid-cols-[2fr_1fr_1fr_1fr] px-5 py-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
        >
          <span>Product</span>
          <span>Category</span>
          <span>Price</span>
          <span>Stock</span>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="w-10 h-10 text-gray-800 mb-3" />
            <p className="text-gray-600 text-sm">
              {query ? "No products match your search." : "No products yet."}
            </p>
          </div>
        ) : (
          filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.04, duration: 0.3 }}
              className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-5 py-4 hover:bg-white/[0.02] transition-colors group"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
            >
              {/* Name + image */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex-shrink-0 overflow-hidden border border-white/[0.06]">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-4 h-4 text-gray-700" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                    {product.name}
                  </p>
                  <p className="text-[10px] text-gray-600 truncate">#{product.id?.slice(0, 8)}</p>
                </div>
              </div>

              <span className="text-xs text-gray-500">{product.category ?? "—"}</span>
              <span className="text-sm font-semibold text-white">
                £{Number(product.price ?? 0).toLocaleString()}
              </span>
              <StockBadge stock={product.stock ?? 0} />
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center" style={card}>
            <Package className="w-10 h-10 text-gray-800 mb-3" />
            <p className="text-gray-600 text-sm">
              {query ? "No products match your search." : "No products yet."}
            </p>
          </div>
        ) : (
          filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.04, duration: 0.3 }}
              className="rounded-2xl p-4 flex items-center gap-4"
              style={card}
            >
              <div className="w-14 h-14 rounded-xl bg-white/[0.04] flex-shrink-0 overflow-hidden border border-white/[0.06]">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-gray-700" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{product.name}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{product.category ?? "—"}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm font-bold text-white">
                    £{Number(product.price ?? 0).toLocaleString()}
                  </span>
                  <StockBadge stock={product.stock ?? 0} />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
