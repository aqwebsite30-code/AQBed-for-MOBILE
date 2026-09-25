import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import {
  Users,
  MousePointerClick,
  ShoppingCart,
  PoundSterling,
  Percent,
  Trophy,
  TrendingUp,
  ChevronRight,
  UserX,
} from "lucide-react";
import { db } from "@/lib/db";
import { useState } from "react";

export const getSalesDashboard = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const [salespeople, orders, siteVisits] = await Promise.all([
      db.salesperson.findMany({ orderBy: { createdAt: "desc" } }),
      db.order.findMany({
        where: { salespersonId: { not: null } },
        orderBy: { createdAt: "desc" },
        take: 200,
      }),
      db.siteVisit.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    ]);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const totalSalespeople = salespeople.length;
    const totalVisits = siteVisits.length;
    const todayVisitsList = siteVisits.filter((v) => new Date(v.createdAt) >= todayStart);
    const todayVisits = todayVisitsList.length;
    const totalOrders = orders.length;
    const todayOrdersList = orders.filter((o) => new Date(o.createdAt) >= todayStart);
    const todayOrders = todayOrdersList.length;
    const todayRevenue = todayOrdersList.reduce((s, o) => s + o.total, 0);
    const monthOrdersList = orders.filter((o) => new Date(o.createdAt) >= monthStart);
    const monthRevenue = monthOrdersList.reduce((s, o) => s + o.total, 0);
    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
    const overallConversion = totalVisits > 0 ? (totalOrders / totalVisits) * 100 : 0;

    const visitCounts: Record<string, number> = {};
    for (const v of siteVisits) {
      visitCounts[v.salespersonId] = (visitCounts[v.salespersonId] ?? 0) + 1;
    }

    const employeeStats = salespeople.map((sp) => {
      const spOrders = orders.filter((o) => o.salespersonId === sp.id);
      const spVisits = visitCounts[sp.id] ?? 0;
      const revenue = spOrders.reduce((s, o) => s + o.total, 0);
      const orderCount = spOrders.length;
      return {
        id: sp.id,
        fullName: sp.fullName,
        employeeCode: sp.employeeCode,
        token: sp.token,
        status: sp.status,
        visitCount: spVisits,
        orderCount,
        revenue,
        conversion: spVisits > 0 ? (orderCount / spVisits) * 100 : 0,
        avgOrderValue: orderCount > 0 ? revenue / orderCount : 0,
      };
    });

    const activeStats = employeeStats.filter((e) => e.status === "active");
    const inactiveStats = employeeStats.filter((e) => e.status !== "active");

    const topByRevenue =
      [...activeStats].sort((a, b) => b.revenue - a.revenue).slice(0, 1)[0] ?? null;
    const topByClicks =
      [...activeStats].sort((a, b) => b.visitCount - a.visitCount).slice(0, 1)[0] ?? null;

    return {
      totalSalespeople,
      totalVisits,
      todayVisits,
      totalOrders,
      todayOrders,
      todayRevenue,
      monthRevenue,
      totalRevenue,
      overallConversion,
      topByRevenue,
      topByClicks,
      activeStats,
      inactiveStats,
    };
  } catch (err: any) {
    console.error("getSalesDashboard error:", err?.message || err);
    return null;
  }
});

export const Route = createFileRoute("/admin/sales-dashboard")({
  loader: () => getSalesDashboard(),
  component: AdminSalesDashboard,
});

const card = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
  border: "1px solid rgba(255,255,255,0.06)",
};

function StatCard({ title, value, sub, Icon, color, bg, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl p-6"
      style={card}
    >
      <div
        className={`absolute -top-8 -right-8 w-32 h-32 ${bg} rounded-full blur-2xl opacity-60`}
      />
      <div className="relative">
        <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${bg} mb-5`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        {sub && <p className="text-[11px] text-gray-500 mt-1.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

function InfoBox({ title, value, sub, Icon, color, bg, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      className="rounded-2xl p-5 flex items-center gap-4"
      style={card}
    >
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="min-w-0">
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-0.5">
          {title}
        </p>
        <p className="text-lg font-bold text-white truncate">{value}</p>
        {sub && <p className="text-[11px] text-gray-500 truncate">{sub}</p>}
      </div>
    </motion.div>
  );
}

function EmployeeTable({ stats, emptyText }: { stats: any[]; emptyText: string }) {
  if (stats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center" style={card}>
        <UserX className="w-10 h-10 text-gray-800 mb-3" />
        <p className="text-gray-600 text-sm">{emptyText}</p>
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="rounded-2xl overflow-hidden"
      style={card}
    >
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] px-5 py-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest border-b border-white/[0.04]">
        <span>Salesperson</span>
        <span>Link Clicks</span>
        <span>Orders</span>
        <span>Revenue</span>
        <span>Conversion</span>
        <span>Avg Order</span>
        <span></span>
      </div>
      {stats.map((e, i) => (
        <Link
          key={e.id}
          to="/admin/sales/$id"
          params={{ id: e.id }}
          className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] items-center px-5 py-4 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group"
        >
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {e.fullName?.charAt(0) ?? "?"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate uppercase tracking-tight group-hover:text-blue-300 transition-colors">
                {e.fullName}
              </p>
              <p className="text-[10px] text-gray-600 font-mono">{e.employeeCode}</p>
            </div>
          </div>
          <span className="text-sm text-gray-300 font-semibold">{e.visitCount}</span>
          <span className="text-sm text-gray-300 font-semibold">{e.orderCount}</span>
          <span className="text-sm font-bold text-white">£{e.revenue.toFixed(2)}</span>
          <span className="text-xs text-gray-400">{e.conversion.toFixed(1)}%</span>
          <span className="text-xs text-gray-400">£{e.avgOrderValue.toFixed(2)}</span>
          <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-blue-400 transition-colors" />
        </Link>
      ))}
    </motion.div>
  );
}

function AdminSalesDashboard() {
  const initialData = Route.useLoaderData();
  const [data, setData] = useState<any>(initialData);
  const [refreshing, setRefreshing] = useState(false);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <div className="p-4 bg-red-500/10 rounded-2xl mb-4 text-red-500">
          <TrendingUp className="w-8 h-8 mx-auto mb-2" />
          <h2 className="text-xl font-bold">Dashboard Error</h2>
        </div>
        <p className="text-gray-400 max-w-md">
          We couldn't load the sales dashboard data. Please check the database connection.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all"
        >
          Try Refreshing
        </button>
      </div>
    );
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // @ts-ignore
      const fresh = await getSalesDashboard();
      if (fresh) setData(fresh);
    } catch {
      /* ignore refresh errors */
    } finally {
      setRefreshing(false);
    }
  };

  const activeCount = data.activeStats.length;
  const inactiveCount = data.inactiveStats.length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-wrap justify-between items-center gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sales Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Referral performance across your sales team.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/20"
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Salespeople"
          value={data.totalSalespeople}
          sub={`${activeCount} active · ${inactiveCount} inactive`}
          Icon={Users}
          color="text-blue-400"
          bg="bg-blue-500/10"
          delay={0}
        />
        <StatCard
          title="Link Clicks"
          value={data.totalVisits}
          sub={`${data.todayVisits} today`}
          Icon={MousePointerClick}
          color="text-indigo-400"
          bg="bg-indigo-500/10"
          delay={0.07}
        />
        <StatCard
          title="Referral Orders"
          value={data.totalOrders}
          sub={`${data.todayOrders} today`}
          Icon={ShoppingCart}
          color="text-emerald-400"
          bg="bg-emerald-500/10"
          delay={0.14}
        />
        <StatCard
          title="Referral Revenue"
          value={`£${data.totalRevenue.toLocaleString()}`}
          sub={`£${data.todayRevenue.toLocaleString()} today · £${data.monthRevenue.toLocaleString()} this month`}
          Icon={PoundSterling}
          color="text-amber-400"
          bg="bg-amber-500/10"
          delay={0.21}
        />
      </div>

      {/* Info boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <InfoBox
          title="Overall Conversion"
          value={`${data.overallConversion.toFixed(1)}%`}
          sub="Orders per link click"
          Icon={Percent}
          color="text-emerald-400"
          bg="bg-emerald-500/10"
          delay={0.1}
        />
        <InfoBox
          title="Top Revenue"
          value={data.topByRevenue ? data.topByRevenue.fullName : "—"}
          sub={data.topByRevenue ? `£${data.topByRevenue.revenue.toFixed(2)}` : "No data yet"}
          Icon={Trophy}
          color="text-amber-400"
          bg="bg-amber-500/10"
          delay={0.16}
        />
        <InfoBox
          title="Top Clicks"
          value={data.topByClicks ? data.topByClicks.fullName : "—"}
          sub={data.topByClicks ? `${data.topByClicks.visitCount} link clicks` : "No data yet"}
          Icon={MousePointerClick}
          color="text-indigo-400"
          bg="bg-indigo-500/10"
          delay={0.22}
        />
      </div>

      {/* Active employees */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-400" /> Active Salespeople
        </h2>
        <EmployeeTable stats={data.activeStats} emptyText="No active salespeople yet." />
      </div>

      {/* Inactive employees */}
      {data.inactiveStats.length > 0 && (
        <div className="opacity-70">
          <h2 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
            <UserX className="w-4 h-4 text-gray-500" /> Inactive Salespeople
          </h2>
          <EmployeeTable stats={data.inactiveStats} emptyText="No inactive salespeople." />
        </div>
      )}
    </div>
  );
}
