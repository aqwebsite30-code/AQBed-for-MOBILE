import { createServerFn } from "@tanstack/react-start";
import { db } from "./db";
import { z } from "zod";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const createProduct = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    try {
      const { name, description, price, salePrice, stock, sku, category, featured, imageUrls, options } = data;

      const slug = slugify(name);
      const finalSlug = slug;

      const product = await db.product.create({
        data: {
          name,
          slug: finalSlug,
          description,
          price: Number(price),
          salePrice: salePrice ? Number(salePrice) : null,
          stock: Number(stock),
          sku: sku || null,
          category,
          featured: !!featured,
          options: JSON.stringify(options || {}),
          images: {
            create: (imageUrls || []).map((url: string, i: number) => ({
              imageUrl: url,
              sortOrder: i,
            })),
          },
        },
        include: { images: true },
      });

      return { success: true, product };
    } catch (error: any) {
      console.error("Create product error:", error);
      return { success: false, error: error.message };
    }
  },
);

export const updateProduct = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    try {
      const { id, name, description, price, salePrice, stock, sku, category, featured, imageUrls, options } = data;

      const slug = slugify(name);

      await db.product.update({
        where: { id },
        data: {
          name,
          slug,
          description,
          price: Number(price),
          salePrice: salePrice ? Number(salePrice) : null,
          stock: Number(stock),
          sku: sku || null,
          category,
          featured: !!featured,
          options: JSON.stringify(options || {}),
        },
      });

      await db.productImage.deleteMany({ where: { productId: id } });
      if (imageUrls && imageUrls.length > 0) {
        await db.productImage.createMany({
          data: imageUrls.map((url: string, i: number) => ({
            productId: id,
            imageUrl: url,
            sortOrder: i,
          })),
        });
      }

      return { success: true };
    } catch (error: any) {
      console.error("Update product error:", error);
      return { success: false, error: error.message };
    }
  },
);

export const deleteProduct = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    try {
      const { id } = z.object({ id: z.string() }).parse(data);
      await db.productImage.deleteMany({ where: { productId: id } });
      await db.productVariant.deleteMany({ where: { productId: id } });
      await db.product.delete({ where: { id } });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },
);
