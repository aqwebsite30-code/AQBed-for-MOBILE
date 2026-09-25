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

async function cleanup() {
  console.log("--- Cleaning Up Legacy Assets ---");
  const allFiles = await getFiles(PUBLIC_DIR);
  const legacyFiles = allFiles.filter((f) => /\.(png|jpg|jpeg)$/i.test(f));

  let deletedCount = 0;
  let deletedSize = 0;

  for (const file of legacyFiles) {
    const ext = path.extname(file);
    const webpPath = file.replace(ext, ".webp");

    if (fs.existsSync(webpPath)) {
      const stats = await fs.promises.stat(file);
      deletedSize += stats.size;
      await fs.promises.unlink(file);
      deletedCount++;
      console.log(`Deleted legacy asset: ${path.basename(file)}`);
    }
  }

  console.log("--- Cleanup Complete ---");
  console.log(`Total Files Deleted: ${deletedCount}`);
  console.log(`Total Space Freed: ${(deletedSize / 1024 / 1024).toFixed(2)} MB`);
}

cleanup();
