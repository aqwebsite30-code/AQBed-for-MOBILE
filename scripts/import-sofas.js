import sharp from "sharp";
import fs from "fs";
import path from "path";

async function processImage(inputPath, outputPath, width, quality = 80) {
  try {
    const originalMetadata = await sharp(inputPath).metadata();
    const originalSize = fs.statSync(inputPath).size;

    await sharp(inputPath).resize(width).webp({ quality }).toFile(outputPath);

    // Remove metadata is inherently handled by sharp unless withMetadata() is called
    const optimizedSize = fs.statSync(outputPath).size;
    const compression = ((1 - optimizedSize / originalSize) * 100).toFixed(2);

    console.log(`- ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
    console.log(`  Original: ${(originalSize / 1024).toFixed(2)}KB`);
    console.log(`  Optimized: ${(optimizedSize / 1024).toFixed(2)}KB`);
    console.log(`  Compression: ${compression}%`);
    console.log(`  Dimensions: ${width}px width`);

    // delete original file as per requirements
    fs.unlinkSync(inputPath);

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
  const sofasDir = path.join(process.cwd(), "public/Sofas");
  const dirs = fs
    .readdirSync(sofasDir)
    .filter((f) => fs.statSync(path.join(sofasDir, f)).isDirectory());

  let productsCode = "";

  for (const dir of dirs) {
    const productDir = path.join(sofasDir, dir);
    const files = fs.readdirSync(productDir);

    const imageExts = [".jpg", ".jpeg", ".png", ".webp"];
    // do not re-process already converted main/gallery files unless they are original names
    const images = files.filter(
      (f) =>
        imageExts.includes(path.extname(f).toLowerCase()) &&
        !f.includes("gallery") &&
        !f.includes("main"),
    );

    const txtFile = files.find((f) => f.toLowerCase().endsWith(".txt"));
    if (!txtFile) continue;

    const textContent = fs.readFileSync(path.join(productDir, txtFile), "utf8");

    // Parse info
    // sample: name: Alaska Sofa
    const nameMatch = textContent.match(/name:\s*(.+)/i);
    const name = nameMatch ? nameMatch[1].trim() : dir;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    console.log(`\nProcessing ${name}...`);

    let imagesData = [];
    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const inputPath = path.join(productDir, file);
      const isMain = i === 0;
      const suffix = isMain ? "main" : `gallery-${i}`;
      const outputPath = path.join(productDir, `${slug}-${suffix}.webp`);
      const width = isMain ? 1200 : 800; // Product Main Images: 1200px, Gallery: 800px

      await processImage(inputPath, outputPath, width, 80);
      imagesData.push(`/Sofas/${dir}/${slug}-${suffix}.webp`);
    }

    const priceMatch =
      textContent.match(/discounted price (\d+)£?/i) || textContent.match(/1 seater (\d+)£?/i);
    let basePrice = 280;
    if (priceMatch) basePrice = parseInt(priceMatch[1], 10);

    const origPriceMatch = textContent.match(/price:£(\d+)/i);
    let originalPrice = 320;
    if (origPriceMatch) originalPrice = parseInt(origPriceMatch[1], 10);

    const sizes = [];
    // 1 seater, 2 seater...
    const sizesLines = textContent.match(/(\d\+?\d*\s+seater\s+\d+£?)/gi) || [];
    sizesLines.forEach((line) => {
      const match = line.match(/(.*?seater)\s+(\d+)£?/i);
      if (match) {
        const val = parseInt(match[2], 10);
        sizes.push(`      { name: "${match[1].trim()}", extraPrice: ${val - basePrice} },`);
      }
    });

    const frameOptions = [];
    const footstool = textContent.match(/Footstool\s+(\d+)£?/i);
    if (footstool)
      frameOptions.push(`      { name: "Footstool", extraPrice: ${parseInt(footstool[1], 10)} },`);
    const highBack = textContent.match(/High back\s+(\d+)£?/i);
    if (highBack)
      frameOptions.push(`      { name: "High back", extraPrice: ${parseInt(highBack[1], 10)} },`);
    const assembly = textContent.match(/Assembly Charges.*?(\d+)£?/i);
    if (assembly)
      frameOptions.push(
        `      { name: "Professional Assembly", extraPrice: ${parseInt(assembly[1], 10)} },`,
      );
    const chromeLegs = textContent.match(/Chrome legs.*?(\d+)£?/i);
    if (chromeLegs)
      frameOptions.push(
        `      { name: "Chrome legs", extraPrice: ${parseInt(chromeLegs[1], 10)} },`,
      );

    if (sizes.length === 0) {
      sizes.push(`      { name: "1 seater", extraPrice: 0 },`);
    }

    productsCode += `
  // ══════════════════════════════════════════════════════════════════════════
  // ${name.toUpperCase()}
  // ══════════════════════════════════════════════════════════════════════════
  product("${slug}", "${name}", "sofas", ${basePrice}, ${originalPrice},
    "${imagesData[0]}", {
    sizes: [
${sizes.join("\n")}
    ],
    frameOptions: [
      { name: "No Additional Options", extraPrice: 0 },
${frameOptions.join("\n")}
    ],
    images: [
      ${imagesData.map((img) => `"${img}"`).join(",\n      ")}
    ],
    description: "Premium handcrafted ${name}, customized for luxury and comfort.",
    storageOptions: [],
    headboardOptions: [],
    mattressOptions: [],
    fabrics: [],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Grey", hex: "#808080" },
      { name: "Black", hex: "#1A1A1A" },
      { name: "Oak", hex: "#A08151" }
    ],
  }),
`;
  }

  const generatedFile = path.join(process.cwd(), "scripts", "generated-sofas.txt");
  fs.writeFileSync(generatedFile, productsCode);
  console.log("Finished. Check " + generatedFile);
}

run();
