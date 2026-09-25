import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Clock,
  Truck,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Package,
  Loader2,
  Trash2,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  User,
  MessageSquare,
} from "lucide-react";
import { db } from "@/lib/db";
import { useState } from "react";
import { toast } from "sonner";

import { z } from "zod";

export const getOrders = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { salesperson: true },
    });
    const tokens = orders.filter((o) => o.trackingToken).map((o) => o.trackingToken as string);
    const visits =
      tokens.length > 0
        ? await db.siteVisit.findMany({
            where: { token: { in: tokens } },
            orderBy: { createdAt: "desc" },
          })
        : [];
    const visitMap: Record<string, any> = {};
    for (const v of visits) {
      if (!visitMap[v.token]) visitMap[v.token] = v;
    }
    return orders.map((o) => ({
      ...o,
      visit: o.trackingToken ? (visitMap[o.trackingToken] ?? null) : null,
    }));
  } catch {
    return [];
  }
});

export const updateOrderStatus = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { id, status } = z.object({ id: z.string(), status: z.string() }).parse(data);
    await db.order.update({ where: { id }, data: { status } });
    return { success: true };
  },
);

export const deleteOrder = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    const { id } = z.object({ id: z.string() }).parse(data);
    await db.order.delete({ where: { id } });
    return { success: true };
  },
);

export const Route = createFileRoute("/admin/orders")({
  loader: () => getOrders(),
  component: AdminOrders,
});

const STATUS_CONFIG: Record<string, { label: string; icon: any; style: string }> = {
  pending: {
    label: "Pending",
    icon: Clock,
    style: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  processing: {
    label: "Processing",
    icon: Package,
    style: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    style: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    style: "bg-red-500/10 text-red-400 border-red-500/20",
  },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status.toLowerCase()] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span
      className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg border ${cfg.style}`}
    >
      <Icon className="w-2.5 h-2.5" /> {cfg.label}
    </span>
  );
}

function parseAddress(address: string) {
  const parts = address.split(", ").reverse();
  return {
    country: parts[0] || "",
    postcode: parts[1] || "",
    city: parts[2] || "",
    addr1: parts.slice(3).reverse().join(", "),
  };
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-gray-500" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-gray-600 uppercase font-bold tracking-wider">{label}</p>
        <p className="text-sm text-gray-200 mt-0.5 break-words">{value || "—"}</p>
      </div>
    </div>
  );
}

function OrderDetail({ order, onDelete }: { order: any; onDelete: () => void }) {
  const items = JSON.parse(order.items || "[]");
  const [status, setStatus] = useState(order.status);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const addr = parseAddress(order.customerAddress || "");

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      // @ts-ignore
      const res = await updateOrderStatus({ data: { id: order.id, status } });
      if (res?.success) toast.success("Status updated!");
      else toast.error("Update failed.");
    } catch {
      toast.error("Network error.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this order? This cannot be undone.")) return;
    setDeleting(true);
    try {
      // @ts-ignore
      const res = await deleteOrder({ data: { id: order.id } });
      if (res?.success) {
        toast.success("Order deleted.");
        onDelete();
      } else toast.error("Delete failed.");
    } catch {
      toast.error("Network error.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white/[0.01] border-b border-white/[0.04] px-4 md:px-16 py-4 md:py-8 space-y-8">
      {/* Status Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 font-mono">
            #{order.id?.slice(0, 8).toUpperCase()}
          </span>
          <StatusBadge status={order.status ?? "pending"} />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-gray-900 border border-white/10 rounded-lg text-xs py-1.5 px-2 text-white outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
              <option key={s} value={s}>
                {s.toUpperCase()}
              </option>
            ))}
          </select>
          <button
            onClick={handleUpdate}
            disabled={updating || status === order.status}
            className="px-3 py-1.5 bg-blue-600 text-[10px] font-bold text-white rounded-lg disabled:opacity-30 hover:bg-blue-500 transition-colors"
          >
            {updating ? <Loader2 className="w-3 h-3 animate-spin" /> : "SAVE"}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-3 py-1.5 bg-red-600/20 text-red-400 text-[10px] font-bold rounded-lg hover:bg-red-600/30 transition-colors border border-red-500/20 disabled:opacity-30"
          >
            {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : "DELETE"}
          </button>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Contact + Address + Payment */}
        <div className="space-y-6">
          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <User className="w-3 h-3" /> Contact
            </h4>
            <div className="space-y-3">
              <InfoRow icon={User} label="Full Name" value={order.customerName} />
              <InfoRow icon={Mail} label="Email" value={order.customerEmail} />
              <InfoRow icon={Phone} label="Phone" value={order.customerPhone} />
            </div>
          </div>

          {/* Salesperson Attribution */}
          <div>
            <h4 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <User className="w-3 h-3" /> Attribution
            </h4>
            <div className="space-y-3">
              {order.salesperson ? (
                <InfoRow icon={User} label="Salesperson" value={order.salesperson.fullName} />
              ) : (
                <InfoRow icon={User} label="Salesperson" value="Organic (no referral)" />
              )}
              <InfoRow icon={Mail} label="Tracking Token" value={order.trackingToken || "—"} />
              <InfoRow
                icon={Mail}
                label="Traffic Source"
                value={order.visit?.referrer || order.visit?.pageUrl || "—"}
              />
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h4 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <MapPin className="w-3 h-3" /> Shipping Address
            </h4>
            <div className="space-y-3">
              <InfoRow icon={MapPin} label="Address Line 1" value={addr.addr1} />
              <InfoRow icon={MapPin} label="City" value={addr.city} />
              <InfoRow icon={MapPin} label="Postcode" value={addr.postcode} />
              <InfoRow icon={MapPin} label="Country" value={addr.country} />
            </div>
          </div>

          {/* Payment */}
          <div>
            <h4 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3 flex items-center gap-2">
              <CreditCard className="w-3 h-3" /> Payment
            </h4>
            <div className="space-y-3">
              <InfoRow icon={CreditCard} label="Method" value="Cash on Delivery" />
            </div>
          </div>

          {/* Instructions */}
          {order.instructions && (
            <div>
              <h4 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                <MessageSquare className="w-3 h-3" /> Instructions
              </h4>
              <div className="px-4 py-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <p className="text-sm text-amber-400/90 italic">"{order.instructions}"</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Order Items */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest flex items-center gap-2">
            <Package className="w-3 h-3" /> Order Items ({items.length})
          </h4>
          <div className="space-y-3">
            {items.map((item: any, idx: number) => (
              <div
                key={idx}
                className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
              >
                <img
                  src={item.image}
                  className="w-14 h-14 rounded-lg object-cover bg-gray-900 flex-shrink-0"
                  alt=""
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{item.name}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Qty: {item.qty}</p>
                  {item.options && Object.keys(item.options).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {Object.entries(item.options).map(([k, v]) => (
                        <span
                          key={k}
                          className="text-[9px] px-1.5 py-0.5 rounded-md bg-white/[0.04] text-gray-500 border border-white/[0.04]"
                        >
                          {k}: {v as string}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-white">
                    £{(item.unitPrice * item.qty).toFixed(2)}
                  </p>
                  <p className="text-[10px] text-gray-600">£{item.unitPrice} each</p>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="pt-4 border-t border-white/[0.04] flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">Total</span>
            <span className="text-xl font-black text-blue-400">£{order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminOrders() {
  const data = Route.useLoaderData();
  const [orders, setOrders] = useState<any[]>(data ?? []);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const tabs = ["all", "pending", "processing", "shipped", "delivered", "cancelled"];

  const filtered = orders.filter((o) => {
    const matchTab = tab === "all" || o.status?.toLowerCase() === tab;
    const matchQuery =
      !query ||
      o.customerName?.toLowerCase().includes(query.toLowerCase()) ||
      o.id?.includes(query);
    return matchTab && matchQuery;
  });

  const card = {
    background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
    border: "1px solid rgba(255,255,255,0.06)",
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total ?? 0), 0);

  const handleDelete = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-wrap justify-between items-center gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Orders</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {orders.length} order{orders.length !== 1 ? "s" : ""} · Total revenue:{" "}
            <span className="text-white font-semibold">£{totalRevenue.toLocaleString()}</span>
          </p>
        </div>
      </motion.div>

      {/* Search + Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <div className="relative max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by customer or order ID…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          />
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {tabs.map((t) => {
            const count =
              t === "all"
                ? orders.length
                : orders.filter((o) => o.status?.toLowerCase() === t).length;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  tab === t
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]"
                }`}
                style={tab !== t ? { border: "1px solid rgba(255,255,255,0.06)" } : undefined}
              >
                {t}{" "}
                {count > 0 && (
                  <span className={`ml-1 ${tab === t ? "opacity-70" : "opacity-40"}`}>
                    ({count})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Table - Desktop */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="rounded-2xl overflow-hidden hidden md:block"
        style={card}
      >
        <div
          className="grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr_1fr] px-5 py-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
        >
          <span>Customer</span>
          <span>Salesperson</span>
          <span>Order ID</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Date</span>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingCart className="w-10 h-10 text-gray-800 mb-3" />
            <p className="text-gray-600 text-sm">
              {query || tab !== "all" ? "No orders match your filters." : "No orders yet."}
            </p>
          </div>
        ) : (
          filtered.map((order, i) => (
            <div key={order.id}>
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.03, duration: 0.3 }}
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                className={`grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr_1fr] items-center px-5 py-4 hover:bg-white/[0.02] transition-colors group cursor-pointer ${expandedId === order.id ? "bg-white/[0.03]" : ""}`}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {order.customerName?.charAt(0) ?? "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate group-hover:text-blue-300 transition-colors uppercase tracking-tight">
                      {order.customerName}
                    </p>
                    <p className="text-[10px] text-gray-600 truncate">{order.customerEmail}</p>
                  </div>
                </div>

                {order.salesperson?.fullName ? (
                  <span className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold truncate pr-2">
                    <User className="w-3 h-3 shrink-0" />
                    {order.salesperson.fullName}
                  </span>
                ) : (
                  <span className="text-xs text-gray-600 italic truncate pr-2">Organic</span>
                )}
                <span className="text-xs font-mono text-gray-500 tracking-tighter">
                  #{order.id?.slice(0, 8).toUpperCase()}
                </span>
                <span className="text-sm font-bold text-white">
                  £{Number(order.total ?? 0).toFixed(2)}
                </span>
                <StatusBadge status={order.status ?? "pending"} />
                <span className="text-xs text-gray-600 uppercase font-medium">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })
                    : "—"}
                </span>
              </motion.div>

              {expandedId === order.id && (
                <OrderDetail order={order} onDelete={() => handleDelete(order.id)} />
              )}
            </div>
          ))
        )}
      </motion.div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center" style={card}>
            <ShoppingCart className="w-10 h-10 text-gray-800 mb-3" />
            <p className="text-gray-600 text-sm">
              {query || tab !== "all" ? "No orders match your filters." : "No orders yet."}
            </p>
          </div>
        ) : (
          filtered.map((order, i) => (
            <div key={order.id}>
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.03, duration: 0.3 }}
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                className="rounded-2xl p-4 cursor-pointer"
                style={card}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {order.customerName?.charAt(0) ?? "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate uppercase">
                        {order.customerName}
                      </p>
                      <p className="text-[10px] text-gray-500 truncate">{order.customerEmail}</p>
                      {order.salesperson?.fullName ? (
                        <p className="text-[10px] text-blue-400/80 truncate mt-0.5">
                          Salesperson: {order.salesperson.fullName}
                        </p>
                      ) : (
                        <p className="text-[10px] text-gray-600 italic truncate mt-0.5">Organic</p>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-white flex-shrink-0">
                    £{Number(order.total ?? 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={order.status ?? "pending"} />
                    <span className="text-[10px] text-gray-600 font-mono">
                      #{order.id?.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-600 uppercase font-medium">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })
                      : "—"}
                  </span>
                </div>
              </motion.div>

              {expandedId === order.id && (
                <OrderDetail order={order} onDelete={() => handleDelete(order.id)} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
