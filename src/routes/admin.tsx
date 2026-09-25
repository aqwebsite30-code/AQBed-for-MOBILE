import { createFileRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  ChevronRight,
  Zap,
  MessageCircle,
  Menu,
  X,
  Users,
  BarChart3,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const NAV_LINKS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Live Chat", href: "/admin/chat", icon: MessageCircle, badge: true },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Sales Team", href: "/admin/sales", icon: Users },
  { name: "Sales Dashboard", href: "/admin/sales-dashboard", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isChecking, setIsChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoginPage = currentPath === "/admin/login";

  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    if (isLoginPage) {
      setIsChecking(false);
      setIsAuth(true);
      return;
    }
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate({ to: "/admin/login", replace: true });
    } else {
      setIsAuth(true);
    }
    setIsChecking(false);
  }, [currentPath, navigate, isLoginPage]);

  if (isChecking)
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-8 h-8 rounded-full border-2 border-blue-500/30 border-t-blue-500"
        />
      </div>
    );

  if (isLoginPage) return <Outlet />;
  if (!isAuth) return null;

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate({ to: "/admin/login", replace: true });
  };

  return (
    <div className="flex h-screen bg-[#070b14] text-gray-100 font-sans overflow-hidden">
      {/* ── Mobile Nav Toggle ──────────────────────────────────── */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-[#0d1526] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* ── Mobile Overlay ─────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        } md:relative md:translate-x-0 md:z-20 md:flex-shrink-0`}
        style={{
          background: "linear-gradient(180deg, #0d1526 0%, #090e1a 100%)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Mobile close button */}
        <button
          onClick={closeSidebar}
          className="md:hidden absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Glow top */}
        <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

        {/* Logo */}
        <div className="px-6 pt-7 pb-5 border-b border-white/[0.05]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-tight">AQ Beds</p>
              <p className="text-[10px] text-blue-400/80 font-medium tracking-wider uppercase">
                Admin Portal
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-3 mb-3">
            Main Menu
          </p>

          {NAV_LINKS.map((link) => {
            const active = link.exact
              ? currentPath === link.href
              : currentPath.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                to={link.href as any}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative group ${
                  active ? "text-white" : "text-gray-500 hover:text-gray-200"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(99,102,241,0.08) 100%)",
                      border: "1px solid rgba(59,130,246,0.2)",
                    }}
                    transition={{ type: "spring", duration: 0.4 }}
                  />
                )}
                <div className="absolute inset-0 rounded-xl group-hover:bg-white/[0.03] transition-colors" />

                <div
                  className={`relative flex items-center justify-center w-8 h-8 rounded-lg ${
                    active
                      ? "bg-blue-500/15 text-blue-400"
                      : "text-gray-500 group-hover:text-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="relative text-sm font-medium flex-1">{link.name}</span>
                {(link as any).badge && currentPath !== "/admin/chat" && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                )}
                {active && <ChevronRight className="relative w-3.5 h-3.5 text-blue-400/60" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom — User + Logout */}
        <div className="p-3 border-t border-white/[0.05]">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.02] mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Administrator</p>
              <p className="text-[10px] text-gray-500 truncate">admin@aqbeds.com</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-500/70 hover:text-red-400 hover:bg-red-500/8 transition-all duration-200 cursor-pointer group"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────── */}
      <main
        className="flex-1 relative overflow-y-auto pt-16 md:pt-0"
        style={{ background: "#070b14" }}
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="min-h-full relative z-10"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
