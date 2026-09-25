import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingBag,
  PackageSearch,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCcw,
  Circle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { db } from "@/lib/db";
import { seedDatabase } from "@/lib/seed";
import { useState } from "react";

export const getDashboardData = createServerFn({ method: "GET" }).handler(async () => {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn("DATABASE_URL is missing. Returning empty dashboard data.");
      return {
        revenue: 0,
        activeOrders: 0,
        avgOrderValue: 0,
        lowStock: 0,
        totalProducts: 0,
        recentOrders: [],
        chartData: [],
      };
    }
    const [orders, totalRev, lowStock, totalProducts, allOrdersCount] = await Promise.all([
      db.order.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
      db.order.aggregate({ _sum: { total: true } }),
      db.product.count({ where: { stock: { lt: 5 } } }),
      db.product.count(),
      db.order.count(),
    ]);

    const revenue = totalRev?._sum?.total || 0;
    const avgOrderValue = allOrdersCount > 0 ? revenue / allOrdersCount : 0;

    const chartData = [
      { name: "Jan", total: 1200 },
      { name: "Feb", total: 2400 },
      { name: "Mar", total: 1800 },
      { name: "Apr", total: 3200 },
      { name: "May", total: 4100 },
      { name: "Jun", total: revenue },
    ];
    return {
      revenue,
      activeOrders: allOrdersCount,
      avgOrderValue,
      lowStock,
      totalProducts,
      recentOrders: orders.map((o) => ({
        id: o.id.slice(0, 8),
        fullId: o.id,
        customer: o.customerName,
        amount: `£${o.total.toFixed(2)}`,
        status: o.status,
        date: o.createdAt.toLocaleDateString(),
      })),
      chartData,
    };
  } catch (err) {
    console.error("Dashboard query failed", err);
    return null;
  }
});

export const Route = createFileRoute("/admin/")({
  loader: () => getDashboardData(),
  component: AdminDashboard,
});

const STATUS_STYLES: Record<string, string> = {
  delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  processing: "bg-blue-500/10    text-blue-400    border-blue-500/20",
  shipped: "bg-indigo-500/10  text-indigo-400  border-indigo-500/20",
  pending: "bg-amber-500/10   text-amber-400   border-amber-500/20",
};

function Stat({ title, value, change, trend, Icon, color, bg, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl p-6 group cursor-default"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Corner glow */}
      <div
        className={`absolute -top-8 -right-8 w-32 h-32 ${bg} rounded-full blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-500`}
      />

      <div className="relative flex justify-between items-start mb-5">
        <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${bg}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <span
          className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border ${
            trend === "up"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}
        >
          {trend === "up" ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {change}
        </span>
      </div>
      <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
      <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
    </motion.div>
  );
}

function AdminDashboard() {
  const data = Route.useLoaderData();
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    await seedDatabase();
    window.location.reload();
  };

  if (!data)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <div className="p-4 bg-red-500/10 rounded-2xl mb-4 text-red-500">
          <PackageSearch className="w-8 h-8 mx-auto mb-2" />
          <h2 className="text-xl font-bold">Database Connection Error</h2>
        </div>
        <p className="text-gray-400 max-w-md">
          We couldn't reach the database to load your dashboard stats. Please check your
          DATABASE_URL or try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all"
        >
          Try Refreshing
        </button>
      </div>
    );

  const stats = [
    {
      title: "Total Revenue",
      value: `£${data.revenue.toLocaleString()}`,
      change: "+12%",
      trend: "up",
      Icon: DollarSign,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      delay: 0,
    },
    {
      title: "Total Sales",
      value: data.activeOrders.toString(),
      change: "+8%",
      trend: "up",
      Icon: ShoppingBag,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      delay: 0.07,
    },
    {
      title: "Avg. Order",
      value: `£${data.avgOrderValue.toFixed(0)}`,
      change: "Stable",
      trend: "up",
      Icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      delay: 0.14,
    },
    {
      title: "Low Stock",
      value: data.lowStock.toString(),
      change: data.lowStock > 0 ? "Action needed" : "All good",
      trend: data.lowStock > 0 ? "down" : "up",
      Icon: PackageSearch,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      delay: 0.21,
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap justify-between items-center gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Welcome back. Here's your store at a glance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {data.totalProducts === 0 && (
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
            >
              <RefreshCcw className={`w-4 h-4 ${seeding ? "animate-spin" : ""}`} />
              {seeding ? "Seeding…" : "Seed Data"}
            </button>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => (
          <Stat key={s.title} {...s} />
        ))}
      </div>

      {/* Chart + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="lg:col-span-3 rounded-2xl p-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-semibold text-white">Revenue Overview</h2>
            </div>
            <span className="text-xs text-gray-600 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.05]">
              Last 6 months
            </span>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#374151"
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#374151"
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `£${v}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d1526",
                    borderColor: "rgba(255,255,255,0.08)",
                    borderRadius: "0.75rem",
                    color: "#f3f4f6",
                    fontSize: 12,
                  }}
                  itemStyle={{ color: "#60a5fa" }}
                  cursor={{ stroke: "rgba(59,130,246,0.2)", strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revGrad)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-2 rounded-2xl p-6 flex flex-col"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-white">Recent Orders</h2>
            </div>
            <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              View all →
            </button>
          </div>
          <div className="flex-1 space-y-2">
            {data.recentOrders.length === 0 ? (
              <p className="text-gray-600 text-xs py-8 text-center">No orders yet.</p>
            ) : (
              data.recentOrders.map((order: any, i: number) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  style={{ border: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                      {order.customer.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                        {order.customer}
                      </p>
                      <p className="text-[10px] text-gray-600">#{order.id}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-xs font-bold text-white">{order.amount}</p>
                    <span
                      className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-md border inline-block mt-0.5 ${STATUS_STYLES[order.status.toLowerCase()] ?? STATUS_STYLES.pending}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
