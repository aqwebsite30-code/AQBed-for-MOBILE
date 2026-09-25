import fs from "fs";
import path from "path";

const files = [
  "c:/Users/AL QADIR AGENCY/Desktop/aq-web/al qadir website/src/routes/product.$slug.tsx",
  "c:/Users/AL QADIR AGENCY/Desktop/aq-web/al qadir website/src/lib/auth.ts", // might have some
];

files.forEach((file) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, "utf8");
    content = content.replace(/\.png/gi, ".webp");
    content = content.replace(/\.jpg/gi, ".webp");
    fs.writeFileSync(file, content);
    console.log(`Updated ${path.basename(file)} to use .webp extensions`);
  }
});
