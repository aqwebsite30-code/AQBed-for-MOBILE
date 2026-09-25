import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, UploadCloud, X, Save, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/db";
import { updateProduct, deleteProduct } from "@/lib/admin-products";

const getProductForEdit = createServerFn({ method: "GET" }).handler(
  async ({ data }: { data: string }) => {
    if (!process.env.DATABASE_URL) return null;
    const product = await db.product.findUnique({
      where: { id: data },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });
    if (!product) return null;
    return {
      ...product,
      options: product.options ? JSON.parse(product.options) : {},
    };
  },
);

export const Route = createFileRoute("/admin/products/edit/$id")({
  loader: async ({ params }) => {
    const product = await getProductForEdit({ data: params.id });
    if (!product) throw new Error("Product not found");
    return { product };
  },
  component: EditProduct,
});

const CATEGORIES = [
  "all-beds", "luxury-beds", "ottoman-beds", "divan-beds", "storage-beds",
  "mattresses", "headboards", "wardrobes", "sliding-wardrobes", "bedroom-furniture", "sofas",
];

type OptionRow = { name: string; extraPrice: number };
type ColorRow = { name: string; hex: string; image: string };

function OptionEditor({ label, rows, setRows, priceLabel }: { label: string; rows: OptionRow[]; setRows: (r: OptionRow[]) => void; priceLabel?: string }) {
  const add = () => setRows([...rows, { name: "", extraPrice: 0 }]);
  const remove = (i: number) => setRows(rows.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof OptionRow, value: string | number) => {
    const copy = [...rows];
    copy[i] = { ...copy[i], [field]: value };
    setRows(copy);
  };
  return (
    <div className="bg-white/[0.02] rounded-xl border border-white/[0.06] p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</h4>
        <button type="button" onClick={add} className="text-blue-400 hover:text-blue-300 text-xs font-semibold flex items-center gap-1">
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            <input type="text" value={row.name} onChange={(e) => update(i, "name", e.target.value)} placeholder="Name" className="flex-1 bg-gray-900 border border-white/10 rounded-lg text-xs px-3 py-2 text-white outline-none focus:ring-1 focus:ring-blue-500/30" />
            <input type="number" value={row.extraPrice} onChange={(e) => update(i, "extraPrice", Number(e.target.value))} placeholder={priceLabel || "£"} className="w-20 bg-gray-900 border border-white/10 rounded-lg text-xs px-3 py-2 text-white outline-none focus:ring-1 focus:ring-blue-500/30" />
            <button type="button" onClick={() => remove(i)} className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {rows.length === 0 && <p className="text-[10px] text-gray-600 text-center py-2">No options added yet.</p>}
      </div>
    </div>
  );
}

function EditProduct() {
  const navigate = useNavigate();
  const { product } = Route.useLoaderData();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(String(product.price));
  const [salePrice, setSalePrice] = useState(product.salePrice ? String(product.salePrice) : "");
  const [stock, setStock] = useState(String(product.stock));
  const [sku, setSku] = useState(product.sku || "");
  const [category, setCategory] = useState(product.category);
  const [featured, setFeatured] = useState(product.featured);
  const [imageUrls, setImageUrls] = useState<string[]>(product.images?.map((i: any) => i.imageUrl) || []);
  const [imageInput, setImageInput] = useState("");

  const opts = product.options || {};
  const [fabrics, setFabrics] = useState<OptionRow[]>(
    (opts.fabrics || []).map((f: any) => ({ name: f.name || "", extraPrice: f.extraPrice || 0 })),
  );
  const [fabricColors, setFabricColors] = useState<ColorRow[][]>(
    (opts.fabrics || []).map((f: any) => (f.colors || []).map((c: any) => ({ name: c.name || "", hex: c.hex || "#000000", image: c.image || "" }))),
  );
  const [sizes, setSizes] = useState<OptionRow[]>(opts.sizes || []);
  const [mattressOptions, setMattressOptions] = useState<OptionRow[]>(opts.mattressOptions || []);
  const [frameOptions, setFrameOptions] = useState<OptionRow[]>(opts.frameOptions || []);
  const [headboardOptions, setHeadboardOptions] = useState<OptionRow[]>(opts.headboardOptions || []);
  const [storageOptions, setStorageOptions] = useState<OptionRow[]>(opts.storageOptions || []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((f) => setImageUrls((prev) => [...prev, URL.createObjectURL(f)]));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "image/*": [] } });

  const addImageUrl = () => {
    if (imageInput.trim()) { setImageUrls((prev) => [...prev, imageInput.trim()]); setImageInput(""); }
  };

  const removeImage = (i: number) => setImageUrls((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || !category) { toast.error("Name, Price, and Category are required."); return; }
    setIsSubmitting(true);
    try {
      const options = {
        fabrics: fabrics
          .map((f, i) => ({
            name: f.name.trim(),
            extraPrice: f.extraPrice,
            colors: (fabricColors[i] || []).filter((c: ColorRow) => c.name.trim()),
          }))
          .filter((f) => f.name),
        sizes: sizes.filter((s) => s.name.trim()),
        mattressOptions: mattressOptions.filter((m) => m.name.trim()),
        frameOptions: frameOptions.filter((f) => f.name.trim()),
        headboardOptions: headboardOptions.filter((h) => h.name.trim()),
        storageOptions: storageOptions.filter((s) => s.name.trim()),
      };
      const result = await updateProduct({
        data: {
          id: product.id,
          name: name.trim(),
          description,
          price: Number(price),
          salePrice: salePrice ? Number(salePrice) : null,
          stock: Number(stock),
          sku: sku.trim() || null,
          category,
          featured,
          imageUrls,
          options,
        },
      });
      if (result?.success) {
        toast.success("Product updated!");
        navigate({ to: "/admin/products" });
      } else toast.error(result?.error || "Update failed.");
    } catch (err: any) { toast.error(err.message || "Error"); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this product permanently?")) return;
    setIsDeleting(true);
    try {
      const result = await deleteProduct({ data: { id: product.id } });
      if (result?.success) { toast.success("Product deleted."); navigate({ to: "/admin/products" }); }
      else toast.error(result?.error || "Delete failed.");
    } catch { toast.error("Network error."); }
    finally { setIsDeleting(false); }
  };

  const card = {
    background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
    border: "1px solid rgba(255,255,255,0.06)",
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto h-full overflow-y-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/products" className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Edit Product</h1>
          <p className="text-gray-400 mt-1 text-sm">{product.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* General */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-6" style={card}>
              <h2 className="text-lg font-semibold text-white mb-6">General Information</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Product Title</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-950/50 border border-gray-800 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50" placeholder="e.g. Emperor Ottoman Bed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} className="w-full bg-gray-950/50 border border-gray-800 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none" placeholder="Describe the product..." />
                </div>
              </div>
            </motion.div>

            {/* Media */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl p-6" style={card}>
              <h2 className="text-lg font-semibold text-white mb-6">Media Gallery</h2>
              <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors duration-300 ${isDragActive ? "border-blue-500 bg-blue-500/5" : "border-gray-700 bg-gray-950/50 hover:border-gray-500"}`}>
                <input {...getInputProps()} />
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4"><UploadCloud className="w-8 h-8 text-blue-400" /></div>
                <p className="text-white font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">SVG, PNG, JPG or GIF</p>
              </div>
              <div className="mt-4 flex gap-2">
                <input type="text" value={imageInput} onChange={(e) => setImageInput(e.target.value)} placeholder="Or paste an image URL..." className="flex-1 bg-gray-950/50 border border-gray-800 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImageUrl())} />
                <button type="button" onClick={addImageUrl} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors">Add</button>
              </div>
              {imageUrls.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <AnimatePresence>
                    {imageUrls.map((url, idx) => (
                      <motion.div key={idx} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="relative aspect-square rounded-xl bg-gray-800 border border-gray-700 overflow-hidden group">
                        <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button type="button" onClick={() => removeImage(idx)} className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"><X className="w-4 h-4" /></button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>

            {/* Variants */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl p-6" style={card}>
              <h2 className="text-lg font-semibold text-white mb-6">Product Variants</h2>
              <div className="space-y-6">
                {/* Fabrics & Colors */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Fabrics &amp; Colors</h4>
                    <button type="button" onClick={() => setFabrics([...fabrics, { name: "", extraPrice: 0 }])} className="text-blue-400 hover:text-blue-300 text-xs font-semibold flex items-center gap-1"><Plus className="w-3 h-3" /> Add Fabric</button>
                  </div>
                  <div className="space-y-3">
                    {fabrics.map((fabric, fi) => {
                      const fc = fabricColors[fi] || [];
                      return (
                        <div key={fi} className="bg-white/[0.02] rounded-xl border border-white/[0.06] p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <input type="text" value={fabric.name} onChange={(e) => { const copy = [...fabrics]; copy[fi] = { ...copy[fi], name: e.target.value }; setFabrics(copy); }} placeholder="Fabric name (e.g. Crushed Velvet)" className="flex-1 bg-gray-900 border border-white/10 rounded-lg text-xs px-3 py-2 text-white outline-none focus:ring-1 focus:ring-blue-500/30" />
                            <input type="number" value={fabric.extraPrice} onChange={(e) => { const copy = [...fabrics]; copy[fi] = { ...copy[fi], extraPrice: Number(e.target.value) }; setFabrics(copy); }} placeholder="+£" className="w-20 bg-gray-900 border border-white/10 rounded-lg text-xs px-3 py-2 text-white outline-none focus:ring-1 focus:ring-blue-500/30" />
                            <button type="button" onClick={() => { setFabrics(fabrics.filter((_, i) => i !== fi)); const copy = [...fabricColors]; copy.splice(fi, 1); setFabricColors(copy); }} className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                          <div className="ml-2 pl-3 border-l border-white/[0.06]">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Colors</span>
                              <button type="button" onClick={() => { const copy = [...fabricColors]; if (!copy[fi]) copy[fi] = []; copy[fi] = [...copy[fi], { name: "", hex: "#000000", image: "" }]; setFabricColors(copy); }} className="text-blue-400 hover:text-blue-300 text-[10px] font-semibold flex items-center gap-1"><Plus className="w-2.5 h-2.5" /> Add Color</button>
                            </div>
                            {fc.length === 0 ? (
                              <p className="text-[10px] text-gray-600 text-center py-1">No colors for this fabric.</p>
                            ) : (
                              <div className="space-y-1.5">
                                {fc.map((c: ColorRow, ci: number) => (
                                  <div key={ci} className="flex items-center gap-1.5">
                                    <input type="color" value={c.hex} onChange={(e) => { const copy = [...fabricColors]; copy[fi] = [...copy[fi]]; copy[fi][ci] = { ...copy[fi][ci], hex: e.target.value }; setFabricColors(copy); }} className="w-7 h-7 rounded-lg border border-white/10 bg-gray-900 cursor-pointer flex-shrink-0" />
                                    <input type="text" value={c.name} onChange={(e) => { const copy = [...fabricColors]; copy[fi] = [...copy[fi]]; copy[fi][ci] = { ...copy[fi][ci], name: e.target.value }; setFabricColors(copy); }} placeholder="Color name" className="flex-1 bg-gray-900 border border-white/10 rounded-lg text-[10px] px-2 py-1.5 text-white outline-none focus:ring-1 focus:ring-blue-500/30" />
                                    <input type="text" value={c.image} onChange={(e) => { const copy = [...fabricColors]; copy[fi] = [...copy[fi]]; copy[fi][ci] = { ...copy[fi][ci], image: e.target.value }; setFabricColors(copy); }} placeholder="Image URL" className="flex-[2] bg-gray-900 border border-white/10 rounded-lg text-[10px] px-2 py-1.5 text-white outline-none focus:ring-1 focus:ring-blue-500/30" />
                                    <button type="button" onClick={() => { const copy = [...fabricColors]; copy[fi] = copy[fi].filter((_: any, idx: number) => idx !== ci); setFabricColors(copy); }} className="p-1 text-red-400 hover:text-red-300 rounded-lg transition-colors"><Trash2 className="w-3 h-3" /></button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {fabrics.length === 0 && <p className="text-[10px] text-gray-600 text-center py-2">No fabrics added. Add a fabric first, then add colors under it.</p>}
                  </div>
                </div>
                <OptionEditor label="Sizes" rows={sizes} setRows={setSizes} priceLabel="+£" />
                <OptionEditor label="Mattress Options" rows={mattressOptions} setRows={setMattressOptions} priceLabel="+£" />
                <OptionEditor label="Frame Options" rows={frameOptions} setRows={setFrameOptions} priceLabel="+£" />
                <OptionEditor label="Headboard Options" rows={headboardOptions} setRows={setHeadboardOptions} priceLabel="+£" />
                <OptionEditor label="Storage Options" rows={storageOptions} setRows={setStorageOptions} priceLabel="+£" />
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl p-6" style={card}>
              <h2 className="text-lg font-semibold text-white mb-6">Pricing & Stock</h2>
              <div className="space-y-5">
                <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Original Price (£) <span className="text-gray-600 font-normal">(strikethrough)</span></label><input type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder="e.g. 250" className="w-full bg-gray-950/50 border border-gray-800 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50" /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Discount Price (£) <span className="text-gray-600 font-normal">(customer pays)</span></label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 185" className="w-full bg-gray-950/50 border border-gray-800 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Stock</label><input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full bg-gray-950/50 border border-gray-800 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50" /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-1.5">SKU</label><input type="text" value={sku} onChange={(e) => setSku(e.target.value)} className="w-full bg-gray-950/50 border border-gray-800 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50" /></div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl p-6" style={card}>
              <h2 className="text-lg font-semibold text-white mb-6">Categorization</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-gray-950/50 border border-gray-800 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none">
                    <option value="">Select category...</option>
                    {CATEGORIES.map((c) => (<option key={c} value={c}>{c.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</option>))}
                  </select>
                </div>
                <div className="pt-4 border-t border-gray-800">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-5 h-5 rounded border-gray-700 text-blue-500 focus:ring-blue-500 bg-gray-950" />
                    <div><span className="block text-sm font-medium text-white">Featured Product</span><span className="block text-xs text-gray-500 mt-0.5">Show on homepage</span></div>
                  </label>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Actions */}
        <div className="fixed bottom-0 left-0 md:left-64 right-0 p-4 bg-gray-900/80 backdrop-blur-xl border-t border-gray-800 flex items-center justify-between gap-4 z-20">
          <button type="button" onClick={handleDelete} disabled={isDeleting} className="px-6 py-2.5 rounded-xl font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-2 border border-red-500/20">
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete Product
          </button>
          <div className="flex gap-4">
            <Link to="/admin/products" className="px-6 py-2.5 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">Cancel</Link>
            <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/25 disabled:opacity-70">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
