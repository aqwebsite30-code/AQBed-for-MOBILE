import { createServerFn } from "@tanstack/react-start";
import { db } from "./db";

export type Option = { name: string; extraPrice: number };
export type Color = { name: string; hex?: string; image?: string };

export type FabricWithColors = {
  name: string;
  extraPrice: number;
  colors: Color[];
};

export interface DbProductData {
  id: string;
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  originalPrice?: number;
  category: string;
  stock: number;
  images: string[];
  rating: number;
  featured: boolean;
  colors: Color[];
  sizes: Option[];
  fabrics: FabricWithColors[];
  mattressOptions: Option[];
  frameOptions: Option[];
  headboardOptions?: Option[];
  storageOptions?: Option[];
}

function parseOptions(raw: string | null) {
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function mapDbProduct(p: any): DbProductData {
  const opts = parseOptions(p.options);
  const fabrics: FabricWithColors[] = (opts.fabrics || []).map((f: any) => ({
    name: f.name || "",
    extraPrice: f.extraPrice || 0,
    colors: (f.colors || []).map((c: any) => ({
      name: c.name || "",
      hex: c.hex || undefined,
      image: c.image || undefined,
    })),
  }));
  const allColors: Color[] = [];
  fabrics.forEach((f) => allColors.push(...f.colors));
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description || "",
    basePrice: p.price,
    originalPrice: p.salePrice || undefined,
    category: p.category,
    stock: p.stock,
    images: (p.images || []).map((i: any) => i.imageUrl),
    rating: p.rating || 0,
    featured: p.featured || false,
    colors: allColors,
    sizes: opts.sizes || [],
    fabrics,
    mattressOptions: opts.mattressOptions || [],
    frameOptions: opts.frameOptions || [],
    headboardOptions: opts.headboardOptions || undefined,
    storageOptions: opts.storageOptions || undefined,
  };
}

export const getDbProductBySlug = createServerFn({ method: "GET" }).handler(
  async ({ data }: { data: string }) => {
    try {
      const product = await db.product.findUnique({
        where: { slug: data },
        include: { images: { orderBy: { sortOrder: "asc" } } },
      });
      if (!product) return null;
      return mapDbProduct(product);
    } catch {
      return null;
    }
  },
);

export const getDbProducts = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    });
    return products.map(mapDbProduct);
  } catch {
    return [];
  }
});
