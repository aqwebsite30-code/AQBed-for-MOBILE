import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, KeyRound, ArrowRight, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { loginAdmin } from "../lib/auth";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMessage("Please enter the access key.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      // @ts-ignore
      const response = await loginAdmin({ data: { password } });

      if (response && response.success && response.token) {
        // Store token in localStorage — reliable, no cookie timing issues
        localStorage.setItem("admin_token", response.token);
        toast.success("Welcome back, Admin!");
        // Navigate to dashboard
        navigate({ to: "/admin" });
      } else {
        const errText = response.error || "Incorrect access key. Please try again.";
        setErrorMessage(errText);
      }
    } catch (err: any) {
      console.error("Authentication error:", err);
      setErrorMessage("Connection error. Make sure the server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Pure CSS animated background — no external URLs */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_80%,rgba(59,130,246,0.10),transparent)]" />

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-gray-900/60 backdrop-blur-2xl border border-gray-800/70 rounded-3xl p-8 shadow-2xl shadow-black/60">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 14 }}
              className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-500/25"
            >
              <KeyRound className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white tracking-tight">AQ Beds Admin</h1>
            <p className="text-sm text-gray-500 mt-1">Enter your security key to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Access Key Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Admin Security Key
                </label>
                <div className="flex items-center gap-1 text-[10px] text-indigo-400 font-medium">
                  <ShieldAlert className="w-3 h-3" />
                  <span>Secure Channel</span>
                </div>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  className={`w-full bg-gray-950/60 border text-white rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-2 transition-all font-mono tracking-wider placeholder:text-gray-700 placeholder:tracking-normal text-sm ${
                    errorMessage
                      ? "border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50"
                      : "border-gray-800 focus:ring-blue-500/40 focus:border-blue-500/50"
                  }`}
                  placeholder="Enter your access key"
                  autoFocus
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/25 text-red-400 px-4 py-3 rounded-xl text-sm"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 text-white rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 cursor-pointer mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Unlock Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
