import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/addproduct")({
  component: SecretProductsController,
});

const mockProducts = [
  {
    id: "1",
    name: "Emperor Ottoman Bed",
    category: "Beds",
    price: "£850",
    stock: 12,
    status: "Active",
  },
  {
    id: "2",
    name: "Luxury Divan Base",
    category: "Beds",
    price: "£420",
    stock: 8,
    status: "Active",
  },
  {
    id: "3",
    name: "Memory Foam Mattress",
    category: "Mattresses",
    price: "£299",
    stock: 24,
    status: "Active",
  },
  {
    id: "4",
    name: "Chesterfield Headboard",
    category: "Headboards",
    price: "£150",
    stock: 0,
    status: "Out of Stock",
  },
];

function SecretProductsController() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [view, setView] = useState<"list">("list");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate({ to: "/admin/login", replace: true });
    } else {
      setIsAuth(true);
    }
    setIsChecking(false);
  }, [navigate]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuth) return null;

  return (
    <div className="h-screen bg-gray-950 text-gray-100 font-sans overflow-hidden flex flex-col relative w-full">
      {/* Isolated Dark Theme Backgrounds */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_80%,rgba(59,130,246,0.07),rgba(255,255,255,0))] pointer-events-none" />

      <main className="flex-1 overflow-y-auto relative z-10 w-full p-4 sm:p-8">
        <AnimatePresence mode="wait">
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="max-w-7xl mx-auto h-full flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent tracking-tight">
                    Secret Products Vault
                  </h1>
                  <p className="text-gray-400 mt-1">
                    Full management access. Manage your inventory, pricing, and variants.
                  </p>
                </div>
              </div>

              <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800/60 rounded-2xl flex flex-col flex-1 overflow-hidden shadow-2xl">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-800/60 flex justify-between items-center bg-gray-950/30">
                  <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left text-sm text-gray-400">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-900/30 border-b border-gray-800/60">
                      <tr>
                        <th scope="col" className="px-6 py-4 font-medium">
                          Product Name
                        </th>
                        <th scope="col" className="px-6 py-4 font-medium">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-4 font-medium">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-4 font-medium">
                          Stock
                        </th>
                        <th scope="col" className="px-6 py-4 font-medium">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-4 font-medium text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60">
                      {mockProducts.map((product, i) => (
                        <motion.tr
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          key={product.id}
                          className="hover:bg-gray-800/20 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-gray-200">{product.name}</td>
                          <td className="px-6 py-4">{product.category}</td>
                          <td className="px-6 py-4">{product.price}</td>
                          <td className="px-6 py-4">{product.stock}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-md
                              ${product.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}
                            `}
                            >
                              {product.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-3">
                              <button
                                className="text-gray-500 hover:text-blue-400 transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                className="text-gray-500 hover:text-red-400 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
