import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { randomBytes } from "node:crypto";
import {
  Users,
  Plus,
  Trash2,
  Copy,
  Check,
  Loader2,
  UserPlus,
  Power,
  Mail,
  Phone,
  Link2,
} from "lucide-react";
import { db } from "@/lib/db";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";

export const getSalespersons = createServerFn({ method: "GET" }).handler(async () => {
  try {
    return await db.salesperson.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
});

export const createSalesperson = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    try {
      const schema = z.object({
        fullName: z.string().min(1),
        email: z.string().optional().or(z.literal("")),
        phone: z.string().optional().or(z.literal("")),
      });
      const parsed = schema.parse(data);

      const token = randomBytes(4).toString("base64url").toUpperCase().slice(0, 6);
      const employeeCode = "AQ" + randomBytes(3).toString("hex").toUpperCase();

      const sp = await db.salesperson.create({
        data: {
          fullName: parsed.fullName,
          email: parsed.email || null,
          phone: parsed.phone || null,
          employeeCode,
          status: "active",
          token,
        },
      });

      return { success: true, salesperson: sp };
    } catch (err: any) {
      console.error("createSalesperson error:", err?.message || err);
      return { success: false, error: err?.message || "unknown error" };
    }
  },
);

export const updateSalesperson = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    try {
      const schema = z.object({
        id: z.string().min(1),
        fullName: z.string().optional(),
        email: z.string().optional().or(z.literal("")),
        phone: z.string().optional().or(z.literal("")),
        status: z.string().optional(),
      });
      const parsed = schema.parse(data);

      await db.salesperson.update({
        where: { id: parsed.id },
        data: {
          ...(parsed.fullName !== undefined ? { fullName: parsed.fullName } : {}),
          ...(parsed.email !== undefined ? { email: parsed.email || null } : {}),
          ...(parsed.phone !== undefined ? { phone: parsed.phone || null } : {}),
          ...(parsed.status !== undefined ? { status: parsed.status } : {}),
        },
      });

      return { success: true };
    } catch (err: any) {
      console.error("updateSalesperson error:", err?.message || err);
      return { success: false, error: err?.message || "unknown error" };
    }
  },
);

export const deleteSalesperson = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    try {
      const { id } = z.object({ id: z.string().min(1) }).parse(data);
      await db.salesperson.delete({ where: { id } });
      return { success: true };
    } catch (err: any) {
      console.error("deleteSalesperson error:", err?.message || err);
      return { success: false, error: err?.message || "unknown error" };
    }
  },
);

export const Route = createFileRoute("/admin/sales")({
  loader: () => getSalespersons(),
  component: AdminSales,
});

const card = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
  border: "1px solid rgba(255,255,255,0.06)",
};

function CopyToken({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const fullLink = `https://www.aqbeds.com/?t=${value}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy.");
    }
  };
  return (
    <button
      onClick={copy}
      title={fullLink}
      className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-gray-400 hover:text-blue-400 hover:border-blue-500/30 transition-colors max-w-full"
    >
      <Link2 className="w-3 h-3 shrink-0" />
      <span className="truncate">aqbeds.com/?t={value}</span>
      {copied ? (
        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
      ) : (
        <Copy className="w-3 h-3 shrink-0" />
      )}
    </button>
  );
}

function AdminSales() {
  const data = Route.useLoaderData();
  const [salespeople, setSalespeople] = useState<any[]>(data ?? []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      // @ts-ignore
      const res = await createSalesperson({ data: { fullName: name, email, phone } });
      if (res?.success && res.salesperson) {
        setSalespeople((prev) => [res.salesperson, ...prev]);
        setName("");
        setEmail("");
        setPhone("");
        toast.success("Salesperson added!");
      } else {
        toast.error(res?.error || "Failed to add.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (sp: any) => {
    setBusyId(sp.id);
    try {
      const next = sp.status === "active" ? "inactive" : "active";
      // @ts-ignore
      const res = await updateSalesperson({ data: { id: sp.id, status: next } });
      if (res?.success) {
        setSalespeople((prev) => prev.map((p) => (p.id === sp.id ? { ...p, status: next } : p)));
        toast.success(`Marked ${next}.`);
      } else {
        toast.error(res?.error || "Update failed.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (sp: any) => {
    if (!confirm(`Delete ${sp.fullName}? This cannot be undone.`)) return;
    setBusyId(sp.id);
    try {
      // @ts-ignore
      const res = await deleteSalesperson({ data: { id: sp.id } });
      if (res?.success) {
        setSalespeople((prev) => prev.filter((p) => p.id !== sp.id));
        toast.success("Deleted.");
      } else {
        toast.error(res?.error || "Delete failed.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-wrap justify-between items-center gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sales Team</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {salespeople.length} salesperson{salespeople.length !== 1 ? "s" : ""} · Share your
            referral links to track orders
          </p>
        </div>
      </motion.div>

      {/* Add form */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="rounded-2xl p-6"
        style={card}
      >
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-semibold text-white">Add New Salesperson</h2>
        </div>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name *"
            required
            className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-gray-600 bg-white/[0.03] border border-white/[0.06] outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (optional)"
            type="email"
            className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-gray-600 bg-white/[0.03] border border-white/[0.06] outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone (optional)"
            className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-gray-600 bg-white/[0.03] border border-white/[0.06] outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
          />
          <button
            type="submit"
            disabled={creating || !name.trim()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-500/20"
          >
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add
          </button>
        </form>
      </motion.div>

      {/* List */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="rounded-2xl overflow-hidden"
        style={card}
      >
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] px-5 py-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest border-b border-white/[0.04]">
          <span>Salesperson</span>
          <span>Employee Code</span>
          <span>Referral Link</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {salespeople.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Users className="w-10 h-10 text-gray-800 mb-3" />
            <p className="text-gray-600 text-sm">No salespeople yet. Add your first one above.</p>
          </div>
        ) : (
          salespeople.map((sp, i) => (
            <motion.div
              key={sp.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.03, duration: 0.3 }}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center px-5 py-4 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {sp.fullName?.charAt(0) ?? "?"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate uppercase tracking-tight">
                    {sp.fullName}
                  </p>
                  <p className="text-[10px] text-gray-600 truncate flex items-center gap-2">
                    {sp.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-2.5 h-2.5" /> {sp.email}
                      </span>
                    )}
                    {sp.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-2.5 h-2.5" /> {sp.phone}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono text-gray-400">{sp.employeeCode}</span>

              <div>
                <CopyToken value={sp.token} />
              </div>

              <span
                className={`inline-flex w-fit items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
                  sp.status === "active"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    sp.status === "active" ? "bg-emerald-400" : "bg-gray-500"
                  }`}
                />
                {sp.status}
              </span>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => handleToggle(sp)}
                  disabled={busyId === sp.id}
                  title={sp.status === "active" ? "Deactivate" : "Activate"}
                  className={`p-2 rounded-lg border transition-colors disabled:opacity-40 ${
                    sp.status === "active"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                  }`}
                >
                  {busyId === sp.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Power className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(sp)}
                  disabled={busyId === sp.id}
                  className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}
