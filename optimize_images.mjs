import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "public");

async function getFiles(dir) {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    }),
  );
  return Array.prototype.concat(...files);
}

async function optimize() {
  console.log("--- Starting Image Optimization ---");
  const allFiles = await getFiles(PUBLIC_DIR);
  const imageFiles = allFiles.filter((f) => /\.(png|jpg|jpeg)$/i.test(f));

  console.log(`Found ${imageFiles.length} images to process.`);

  let totalSaved = 0;
  let processed = 0;

  for (const file of imageFiles) {
    const stats = await fs.promises.stat(file);
    const originalSize = stats.size;
    const ext = path.extname(file);
    const webpPath = file.replace(ext, ".webp");

    try {
      // Basic optimization: Convert to WebP with sensible defaults
      let pipeline = sharp(file);

      // Determine target width/quality based on folder/name
      let options = { quality: 80, effort: 4 };
      if (file.includes("Home page images") || file.includes("mobile")) {
        options.quality = 75; // Hero images slightly more compressed
      } else if (file.includes("all products img")) {
        options.quality = 80;
      }

      await pipeline.webp(options).toFile(webpPath);

      const newStats = await fs.promises.stat(webpPath);
      const saved = originalSize - newStats.size;
      totalSaved += saved;
      processed++;

      console.log(
        `[${processed}/${imageFiles.length}] Optimized ${path.basename(file)}: Saved ${(saved / 1024).toFixed(1)} KB`,
      );

      // If we want to replace the original extension in the codebase eventually, we keep the original for now.
      // But the user wants automatic optimization. For now let's just generate WebP.
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }

  console.log("--- Optimization Complete ---");
  console.log(`Total Images Processed: ${processed}`);
  console.log(`Total Space Saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
}

optimize();
