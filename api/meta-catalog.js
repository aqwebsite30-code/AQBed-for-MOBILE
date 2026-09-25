import { PrismaClient } from "@prisma/client";
import { PRODUCTS_CATALOG, BASE_URL, normalizeImages } from "../src/lib/products-catalog.cjs";

const prisma = new PrismaClient();

function escapeCsv(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function formatPrice(price) {
  return price.toFixed(2) + " GBP";
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== "GET") {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: "Method not allowed" }));
  }

  try {
    // Try database first
    let dbProducts = [];
    try {
      dbProducts = await prisma.product.findMany({
        where: { stock: { gt: 0 } },
        orderBy: { createdAt: "desc" },
        include: { images: { orderBy: { sortOrder: "asc" } } },
      });
    } catch (dbErr) {
      console.warn("[meta-catalog] DB query failed, using static products:", dbErr.message);
    }

    // Fallback to static products if DB empty
    const products = dbProducts.length > 0 ? dbProducts : PRODUCTS_CATALOG;

    // CSV header matching Meta Commerce Manager spec
    const headers = [
      "id",
      "title",
      "description",
      "availability",
      "condition",
      "price",
      "sale_price",
      "link",
      "image_link",
      "additional_image_link",
      "brand",
    ];

    const rows = products.map((p) => {
      let images = [];
      if (p.images) {
        images = normalizeImages(p.images);
      }

      const mainImage = images[0] || "";
      const additionalImages = images.slice(1, 11).join(",");

      // DB product: { price, salePrice } — static fallback: { basePrice, originalPrice }
      const isDb = typeof p.price === "number";
      const regular = isDb ? p.price : (p.originalPrice ?? p.basePrice);
      const sale = isDb ? (p.salePrice ?? p.price) : p.basePrice;
      const priceCol = formatPrice(regular);
      const salePriceCol = sale < regular ? formatPrice(sale) : "";
      const availability = (p.stock ?? 0) > 0 ? "in stock" : "out of stock";
      const slug = p.slug || p.id;

      return [
        escapeCsv(slug),
        escapeCsv(p.name),
        escapeCsv(p.description || ""),
        escapeCsv(availability),
        escapeCsv("new"),
        escapeCsv(priceCol),
        escapeCsv(salePriceCol),
        escapeCsv(`${BASE_URL}/product/${slug}`),
        escapeCsv(mainImage),
        escapeCsv(additionalImages),
        escapeCsv("AQBeds"),
      ];
    });

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800");
    res.statusCode = 200;
    return res.end(csv);
  } catch (err) {
    console.error("[meta-catalog] error:", err);
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: "Failed to generate catalog" }));
  } finally {
    await prisma.$disconnect();
  }
}