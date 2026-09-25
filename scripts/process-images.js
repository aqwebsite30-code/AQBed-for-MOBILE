import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function processImage(inputPath, outputPath, width, quality = 80) {
  try {
    const originalMetadata = await sharp(inputPath).metadata();
    const originalSize = fs.statSync(inputPath).size;

    await sharp(inputPath).resize(width).webp({ quality }).toFile(outputPath);

    const optimizedSize = fs.statSync(outputPath).size;
    const compression = ((1 - optimizedSize / originalSize) * 100).toFixed(2);

    console.log(`- ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
    console.log(`  Original: ${(originalSize / 1024).toFixed(2)}KB`);
    console.log(`  Optimized: ${(optimizedSize / 1024).toFixed(2)}KB`);
    console.log(`  Compression: ${compression}%`);
    console.log(`  Dimensions: ${width}px width`);

    return {
      originalSize,
      optimizedSize,
      filename: path.basename(outputPath),
    };
  } catch (err) {
    console.error(`Error processing ${inputPath}:`, err.message);
  }
}

async function run() {
  const products = [
    {
      name: "alina-wardrobe",
      dir: "public/Wardrobes",
      images: [
        "IMG_20260621_152130.png",
        "IMG_20260621_152420.png",
        "IMG_20260621_160040.png",
        "a52f7f821b714c6194523ec237348e0e.png",
      ],
    },
    {
      name: "sliding-wardrobe",
      dir: "public/Sliding wardrobe",
      images: [
        "1000158187-ezremove.png",
        "1000158188-clean.png",
        "1000158203-clean.png",
        "1000158206-ezremove.png",
      ],
    },
  ];

  for (const p of products) {
    console.log(`\nProcessing ${p.name}...`);
    for (let i = 0; i < p.images.length; i++) {
      const input = path.join(process.cwd(), p.dir, p.images[i]);
      const isMain = i === 0;
      const suffix = isMain ? "main" : `gallery-${i}`;
      const output = path.join(process.cwd(), p.dir, `${p.name}-${suffix}.webp`);
      const width = isMain ? 1200 : 800;

      await processImage(input, output, width);
    }
  }
}

run();
