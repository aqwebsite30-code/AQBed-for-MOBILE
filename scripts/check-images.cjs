const fs = require("fs");
const path = require("path");

const PUBLIC_DIR = path.join(__dirname, "../public");
const MAX_SIZE_KB = 300;

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      const ext = path.extname(file).toLowerCase();
      if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
        results.push({ file, size: stat.size });
      }
    }
  });
  return results;
}

console.log("--- AQ BEDS IMAGE PIPELINE AUDIT ---");
const images = walk(PUBLIC_DIR);
const oversized = images.filter((img) => img.size > MAX_SIZE_KB * 1024);

if (oversized.length > 0) {
  console.log(`\nFound ${oversized.length} oversized images (> ${MAX_SIZE_KB}KB):`);
  oversized
    .sort((a, b) => b.size - a.size)
    .forEach((img) => {
      const relPath = path.relative(PUBLIC_DIR, img.file);
      const sizeMB = (img.size / (1024 * 1024)).toFixed(2);
      console.log(`[!] ${relPath} - ${sizeMB} MB`);
    });
  console.log("\nACTION: Please convert these to .webp and compress below 300KB.");
} else {
  console.log("\nAll images within performance budget (< 300KB). Well done!");
}
