const fs = require("fs");

let content = fs.readFileSync("src/data/products.ts", "utf8");

// 1. Add 'sofas' to Category type
content = content.replace(
  '  | "sliding-wardrobes"\n  | "bedroom-furniture";',
  '  | "sliding-wardrobes"\n  | "bedroom-furniture"\n  | "sofas";',
);

// 2. Add 'sofas' to CATEGORIES array
const categoryString =
  '  { slug: "bedroom-furniture", name: "Bedroom Furniture", image: "/all%20products%20img/Sleigh/1.webp",             blurb: "Complete the set" },';
const newCategoryString =
  categoryString +
  '\n  { slug: "sofas", name: "Sofas", image: "/Sofas/Diamontee sofa/diamontee-sofa-main.webp", blurb: "Premium sofas for luxury and comfort" },';
content = content.replace(categoryString, newCategoryString);

// 3. Append generated sofas to baseProducts array
let sofasCode = fs.readFileSync("scripts/generated-sofas.txt", "utf8");

// Fix Verona Sofa duplication since Verona.txt listed "Diamontee Sofa"
// We'll surgically replace the last instance
const veronaStart = sofasCode.lastIndexOf('product("diamontee-sofa"');
if (veronaStart !== -1) {
  const before = sofasCode.substring(0, veronaStart);
  let after = sofasCode.substring(veronaStart);
  after = after.replace(
    'product("diamontee-sofa", "Diamontee Sofa"',
    'product("verona-sofa", "Verona Sofa"',
  );
  after = after.replace("/Sofas/Verona Sofa/diamontee-sofa", "/Sofas/Verona Sofa/verona-sofa");
  after = after.replace("/Sofas/Verona Sofa/diamontee-sofa", "/Sofas/Verona Sofa/verona-sofa");
  after = after.replace("/Sofas/Verona Sofa/diamontee-sofa", "/Sofas/Verona Sofa/verona-sofa");
  after = after.replace("/Sofas/Verona Sofa/diamontee-sofa", "/Sofas/Verona Sofa/verona-sofa");
  sofasCode = before + after;
}

content = content.replace(
  "];\n\nexport const PRODUCTS",
  sofasCode + "\n];\n\nexport const PRODUCTS",
);

fs.writeFileSync("src/data/products.ts", content);
console.log("Updated products.ts");
