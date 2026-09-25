# 🛌 AQ Beds — Image Optimization & Upload Guide

To maintain a premium, instant-loading experience on mobile, all new products must follow these strict asset guidelines.

## 📁 Format & Resolution Standards

| Asset Type | Format | Max Dimensions | Target Size | Purpose |
|:--- |:--- |:--- |:--- |:--- |
| **Hero Image** | `.webp` | 1920 x 1080px | **< 300KB** | Homepage Carousel |
| **Main Product** | `.webp` | 1200 x 1200px | **100–250KB** | Product Grid & Main View |
| **Gallery Img** | `.webp` | 800 x 800px | **50–150KB** | Product Detail Slides |
| **Swatches** | `.webp` | 60 x 60px | **< 5KB** | Color/Fabric Selectors |

## 🚫 Rejected Formats
The system will eventually enforce these via server-side checks. Do NOT upload:
- **PNG**: Generally 5x-10x larger than WebP. Convert to WebP first.
- **JPG**: Large files with high compression artifacts. Use WebP (Lossy 80% quality).
- **GIF**: Extremely heavy. Use MP4/WebM if animation is needed.

## 🛠️ Recommended Optimization Workflow

1.  **Capture/Export**: Export your raw images as High Quality JPGs.
2.  **Convert**: Use [Squoosh.app](https://squoosh.app/) or [Sharp](https://sharp.pixelplumbing.com/).
3.  **Resize**: Ensure width does not exceed **1200px** for standard product images.
4.  **WebP Encoding**:
    - Select **WebP** format.
    - Set quality to **75–85%**.
    - Check "Effort" to maximum (9) for best compression.
5.  **Audit**: Run the local audit script to verify:
    ```bash
    node scripts/check-images.cjs
    ```

## 📝 Admin Panel Checklist
- [ ] Image name is descriptive (e.g., `ottoman-bed-grey-velvet.webp`).
- [ ] File size is visible in the uploader and under **250KB**.
- [ ] No layout shifts: Ensure your product image has a consistent aspect ratio (1:1 or 4:3) across the category.

---
*Following these guidelines ensures the AQ Beds platform remains the fastest ecommerce site in the UK bedding industry.*
