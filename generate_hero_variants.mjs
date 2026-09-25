import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HERO_DIR = path.join(__dirname, "public", "Home page images");
const HERO_MOBILE_DIR = path.join(__dirname, "public", "Home page imaegs for mobile");

async function generateVariants(dir, width, suffix) {
  const dirents = await fs.promises.readdir(dir);
  const images = dirents.filter((f) => f.endsWith(".webp") && !f.includes("@"));

  for (const img of images) {
    const inputPath = path.join(dir, img);
    const outputPath = inputPath.replace(".webp", `${suffix}.webp`);

    try {
      await sharp(inputPath).resize(width).webp({ quality: 80 }).toFile(outputPath);
      console.log(`Generated ${path.basename(outputPath)}`);
    } catch (err) {
      console.error(`Error processing ${img}:`, err);
    }
  }
}

async function start() {
  console.log("--- Generating Hero Variants ---");
  // Desktop: 1x (1200px), 2x (2400px)
  await generateVariants(HERO_DIR, 1200, "@1x");
  await generateVariants(HERO_DIR, 2400, "@2x");

  // Mobile: 1x (600px), 2x (1200px)
  await generateVariants(HERO_MOBILE_DIR, 600, "@1x");
  await generateVariants(HERO_MOBILE_DIR, 1200, "@2x");
}

start();
