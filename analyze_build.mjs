import fs from "fs";
import path from "path";

function getFiles(dir, files_) {
  files_ = files_ || [];
  if (!fs.existsSync(dir)) return files_;
  const files = fs.readdirSync(dir);
  for (const i in files) {
    const name = dir + "/" + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      files_.push({
        path: name,
        size: fs.statSync(name).size,
      });
    }
  }
  return files_;
}

const clientFiles = getFiles("./dist/client");
let totalJS = 0;
let totalCSS = 0;
let largestJS = { path: "", size: 0 };
let largestCSS = { path: "", size: 0 };

clientFiles.forEach((f) => {
  if (f.path.endsWith(".js")) {
    totalJS += f.size;
    if (f.size > largestJS.size) largestJS = f;
  } else if (f.path.endsWith(".css")) {
    totalCSS += f.size;
    if (f.size > largestCSS.size) largestCSS = f;
  }
});

console.log(`--- PRODUCTION CLIENT BUNDLE ---`);
console.log(`Total JS Size: ${(totalJS / 1024).toFixed(2)} KB`);
console.log(`Total CSS Size: ${(totalCSS / 1024).toFixed(2)} KB`);
console.log(`Largest JS File: ${largestJS.path} (${(largestJS.size / 1024).toFixed(2)} KB)`);
console.log(`Largest CSS File: ${largestCSS.path} (${(largestCSS.size / 1024).toFixed(2)} KB)`);

const publicFiles = getFiles("./public");
let largestImage = { path: "", size: 0 };
publicFiles.forEach((f) => {
  if (/\.(webp|png|jpg|jpeg)$/i.test(f.path)) {
    if (f.size > largestImage.size) largestImage = f;
  }
});

console.log(`\n--- ASSETS ---`);
console.log(
  `Largest Image in public/: ${largestImage.path} (${(largestImage.size / 1024).toFixed(2)} KB)`,
);

// Check for legacy files
const legacy = publicFiles.filter((f) => /\.(png|jpg|jpeg)$/i.test(f.path));
console.log(`Remaining legacy images: ${legacy.length}`);
legacy.forEach((f) => console.log(` - ${f.path} (${(f.size / 1024).toFixed(2)} KB)`));
