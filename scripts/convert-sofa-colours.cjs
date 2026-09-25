const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "public", "Sofas", "Sofa Colours");

const VALID_EXTENSIONS = [".png", ".jpg", ".jpeg"];

let converted = 0;
let skipped = 0;
let errors = 0;

async function processFolder(folder) {
  const entries = fs.readdirSync(folder, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(folder, entry.name);

    if (entry.isDirectory()) {
      await processFolder(fullPath);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();

    if (!VALID_EXTENSIONS.includes(ext)) {
      continue;
    }

    const output = fullPath.replace(/\.(png|jpg|jpeg)$/i, ".webp");

    try {
      await sharp(fullPath)
        .webp({
          quality: 85,
          effort: 4,
        })
        .toFile(output);

      fs.unlinkSync(fullPath);

      converted++;

      console.log("✔ Converted:", path.relative(ROOT, output));
    } catch (err) {
      errors++;
      console.error("✖ Failed:", fullPath);
      console.error(err.message);
    }
  }
}

(async () => {
  console.log("");
  console.log("Converting sofa colour swatches...");
  console.log("");

  if (!fs.existsSync(ROOT)) {
    console.error("Folder not found:");
    console.error(ROOT);
    process.exit(1);
  }

  await processFolder(ROOT);

  console.log("");
  console.log("========== DONE ==========");
  console.log("Converted:", converted);
  console.log("Skipped:", skipped);
  console.log("Errors:", errors);
  console.log("==========================");
})();
