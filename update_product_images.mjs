import fs from "fs";
import path from "path";

const file = "c:/Users/AL QADIR AGENCY/Desktop/aq-web/al qadir website/src/data/products.ts";
let content = fs.readFileSync(file, "utf8");

content = content.replace(/\.png/gi, ".webp");
content = content.replace(/\.jpg/gi, ".webp");

fs.writeFileSync(file, content);
console.log("Updated products.ts to use .webp extensions");
