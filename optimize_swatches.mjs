import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COLOR_DIR = path.join(__dirname, "public", "COLOR");

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

async function optimizeSwatches() {
  console.log("--- Optimizing Color Swatches ---");
  const allFiles = await getFiles(COLOR_DIR);
  // Target both webp and original images to be safe
  const swatchFiles = allFiles.filter((f) => /\.(webp|png|jpg|jpeg)$/i.test(f));

  console.log(`Found ${swatchFiles.length} swatches to process.`);

  for (const file of swatchFiles) {
    const ext = path.extname(file);
    const webpPath = file.endsWith(".webp") ? file : file.replace(ext, ".webp");
    const tempPath = webpPath + ".tmp.webp";

    try {
      await sharp(file)
        .resize(60, 60, { fit: "cover" }) // Swatches don't need to be big
        .webp({ quality: 60, effort: 6 }) // Aggressive compression for tiny icons
        .toFile(tempPath);

      await fs.promises.rename(tempPath, webpPath);
      const stats = await fs.promises.stat(webpPath);
      console.log(`Optimized ${path.basename(webpPath)}: ${(stats.size / 1024).toFixed(1)} KB`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
}

optimizeSwatches();
