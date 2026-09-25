import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  Check,
  MousePointerClick,
  ShoppingCart,
  PoundSterling,
  Package,
  Receipt,
  BarChart3,
  Link2,
  CalendarClock,
} from "lucide-react";
import { db } from "@/lib/db";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";

export const getSalespersonDetail = createServerFn({ method: "GET" }).handler(
  async ({ data }: { data: any }) => {
    try {
      const { id } = z.object({ id: z.string().min(1) }).parse(data);

      const sp = await db.salesperson.findUnique({ where: { id } });
      if (!sp) return null;

      const [orders, visits, products] = await Promise.all([
        db.order.findMany({
          where: { salespersonId: sp.id },
          orderBy: { createdAt: "desc" },
          take: 500,
        }),
        db.siteVisit.findMany({
          where: { salespersonId: sp.id },
          orderBy: { createdAt: "desc" },
          take: 200,
        }),
        db.product.findMany({ orderBy: { featured: "desc" }, take: 8 }),
      ]);

      const orderCount = orders.length;
      const revenue = orders.reduce((s, o) => s + o.total, 0);
      const avgOrderValue = orderCount > 0 ? revenue / orderCount : 0;

      let itemsSold = 0;
      for (const o of orders) {
        try {
          const parsed = JSON.parse(o.items || "[]");
          if (Array.isArray(parsed)) {
            itemsSold += parsed.reduce((s: number, i: any) => s + (Number(i.qty) || 0), 0);
          }
        } catch {}
      }

      const visitCount = visits.length;
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayVisits = visits.filter((v) => new Date(v.createdAt) >= todayStart).length;

      const recentOrders = orders.slice(0, 10).map((o) => ({
        id: o.id.slice(0, 8).toUpperCase(),
        customerName: o.customerName,
        total: o.total,
        status: o.status,
        createdAt: o.createdAt,
      }));

      const months: { key: string; label: string; revenue: number; orders: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setDate(1);
        d.setMonth(d.getMonth() - i);
        months.push({
          key: `${d.getFullYear()}-${d.getMonth()}`,
          label: d.toLocaleDateString("en-GB", { month: "short" }),
          revenue: 0,
          orders: 0,
        });
      }
      const monthIndex: Record<string, number> = {};
      months.forEach((m, i) => (monthIndex[m.key] = i));
      for (const o of orders) {
        const d = new Date(o.createdAt);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        const idx = monthIndex[key];
        if (idx !== undefined) {
          months[idx].revenue += o.total;
          months[idx].orders += 1;
        }
      }

      const referralLinks = products.map((p) => ({
        name: p.name,
        slug: p.slug,
        url: `https://www.aqbeds.com/product/${p.slug}?t=${sp.token}`,
      }));

      return {
        salesperson: {
          id: sp.id,
          fullName: sp.fullName,
          email: sp.email,
          phone: sp.phone,
          employeeCode: sp.employeeCode,
          token: sp.token,
          status: sp.status,
          createdAt: sp.createdAt,
        },
        orderCount,
        revenue,
        avgOrderValue,
        itemsSold,
        visitCount,
        todayVisits,
        recentOrders,
        monthlyChart: months,
        referralLinks,
      };
    } catch (err: any) {
      console.error("getSalespersonDetail error:", err?.message || err);
      return null;
    }
  },
);

export const Route = createFileRoute("/admin/sales/$id")({
  loader: ({ params }) => getSalespersonDetail({ data: { id: params.id } }),
  component: AdminSalespersonDetail,
});

const card = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
  border: "1px solid rgba(255,255,255,0.06)",
};

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy.");
    }
  };
  return (
    <button
      onClick={copy}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
        copied
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          : "bg-blue-600 hover:bg-blue-500 text-white border border-transparent"
      }`}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : (label ?? "Copy")}
    </button>
  );
}

function StatBox({ title, value, Icon, color, bg, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="rounded-2xl p-5"
      style={card}
    >
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</p>
      <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
    </motion.div>
  );
}

function AdminSalespersonDetail() {
  const data = Route.useLoaderData();

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <p className="text-gray-400 max-w-md">
          Salesperson not found, or the data could not be loaded.
        </p>
        <Link
          to="/admin/sales"
          className="mt-6 px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all"
        >
          Back to Sales Team
        </Link>
      </div>
    );
  }

  const { salesperson: sp } = data;
  const referralUrl = `https://www.aqbeds.com/?t=${sp.token}`;
  const chartMax = Math.max(...data.monthlyChart.map((m: any) => m.revenue), 1);
  const hasChartData = data.monthlyChart.some((m: any) => m.revenue > 0);

  const statusBadge =
    sp.status === "active"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : "bg-gray-500/10 text-gray-500 border-gray-500/20";

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          to="/admin/sales"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Sales Team
        </Link>
      </motion.div>

      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
        className="rounded-2xl p-6"
        style={card}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-lg shadow-blue-500/20">
              {sp.fullName?.charAt(0) ?? "?"}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold text-white tracking-tight uppercase">
                  {sp.fullName}
                </h1>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${statusBadge}`}
                >
                  {sp.status}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap text-xs text-gray-500">
                <span className="font-mono">{sp.employeeCode}</span>
                <span className="w-1 h-1 bg-gray-600 rounded-full" />
                <span className="font-mono text-gray-400">Token: {sp.token}</span>
                {sp.email && (
                  <>
                    <span className="w-1 h-1 bg-gray-600 rounded-full" />
                    <span>{sp.email}</span>
                  </>
                )}
                {sp.phone && (
                  <>
                    <span className="w-1 h-1 bg-gray-600 rounded-full" />
                    <span>{sp.phone}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <span className="text-[11px] text-gray-600">
            Joined {new Date(sp.createdAt).toLocaleDateString("en-GB")}
          </span>
        </div>

        {/* Referral link */}
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl bg-white/[0.02] border border-white/[0.06] px-4 py-3">
          <Link2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <p className="text-sm font-mono text-gray-300 truncate flex-1 min-w-0">{referralUrl}</p>
          <CopyButton text={referralUrl} label="Copy Link" />
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatBox
          title="Link Clicks"
          value={data.visitCount}
          Icon={MousePointerClick}
          color="text-indigo-400"
          bg="bg-indigo-500/10"
          delay={0.05}
        />
        <StatBox
          title="Orders"
          value={data.orderCount}
          Icon={ShoppingCart}
          color="text-blue-400"
          bg="bg-blue-500/10"
          delay={0.1}
        />
        <StatBox
          title="Revenue"
          value={`£${data.revenue.toFixed(0)}`}
          Icon={PoundSterling}
          color="text-emerald-400"
          bg="bg-emerald-500/10"
          delay={0.15}
        />
        <StatBox
          title="Products Sold"
          value={data.itemsSold}
          Icon={Package}
          color="text-amber-400"
          bg="bg-amber-500/10"
          delay={0.2}
        />
        <StatBox
          title="Avg Order Value"
          value={`£${data.avgOrderValue.toFixed(0)}`}
          Icon={Receipt}
          color="text-cyan-400"
          bg="bg-cyan-500/10"
          delay={0.25}
        />
        <StatBox
          title="Clicks Today"
          value={data.todayVisits}
          Icon={CalendarClock}
          color="text-purple-400"
          bg="bg-purple-500/10"
          delay={0.3}
        />
      </div>

      {/* Product tracking links */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="rounded-2xl p-6"
        style={card}
      >
        <div className="flex items-center gap-2 mb-4">
          <Link2 className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-semibold text-white">Product Tracking Links</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.referralLinks.map((l: any) => (
            <div
              key={l.slug}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{l.name}</p>
                <p className="text-[10px] font-mono text-gray-500 truncate">{l.url}</p>
              </div>
              <CopyButton text={l.url} label="Copy" />
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Monthly chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="lg:col-span-3 rounded-2xl p-6"
          style={card}
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-white">Monthly Performance</h2>
          </div>
          {hasChartData ? (
            <div className="flex items-end gap-3 h-52">
              {data.monthlyChart.map((m: any, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full">
                  <span className="text-[10px] font-semibold text-gray-400">
                    £{m.revenue > 0 ? m.revenue.toFixed(0) : ""}
                  </span>
                  <div className="flex-1 w-full flex items-end">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-indigo-500 transition-all"
                      style={{
                        height:
                          m.revenue > 0 ? `${Math.max((m.revenue / chartMax) * 100, 3)}%` : "2%",
                        opacity: m.revenue > 0 ? 0.85 : 0.2,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">{m.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm py-16 text-center">
              No sales data in the last 6 months yet.
            </p>
          )}
        </motion.div>

        {/* Recent orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="lg:col-span-2 rounded-2xl p-6"
          style={card}
        >
          <div className="flex items-center gap-2 mb-5">
            <ShoppingCart className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Recent Orders</h2>
          </div>
          {data.recentOrders.length === 0 ? (
            <p className="text-gray-600 text-xs py-12 text-center">
              No orders attributed to this salesperson yet.
            </p>
          ) : (
            <div className="space-y-2">
              {data.recentOrders.map((o: any) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.03] transition-colors"
                  style={{ border: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate uppercase">
                      {o.customerName}
                    </p>
                    <p className="text-[10px] text-gray-600 font-mono">
                      #{o.id} ·{" "}
                      {new Date(o.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-xs font-bold text-white">£{o.total.toFixed(2)}</p>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-gray-500">
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
