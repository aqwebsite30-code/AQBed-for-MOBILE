import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  KeyRound,
  Eye,
  EyeOff,
  Save,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { changeAdminPassword, resetAdminPassword } from "../lib/auth";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

type Vis = { current: boolean; newp: boolean; confirm: boolean };

function PasswordField({
  label,
  value,
  onChange,
  field,
  placeholder,
  show,
  toggleShow,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  field: keyof Vis;
  placeholder: string;
  show: Vis;
  toggleShow: (f: keyof Vis) => void;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <input
          type={show[field] ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required
          className="w-full rounded-xl pl-4 pr-11 py-3 text-sm text-white font-mono placeholder:font-sans placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => toggleShow(field)}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-600 hover:text-gray-400 transition-colors"
        >
          {show[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {hint && <p className="text-[10px] text-gray-600">{hint}</p>}
    </div>
  );
}

function AdminSettings() {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [show, setShow] = useState<Vis>({ current: false, newp: false, confirm: false });
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleShow = (f: keyof Vis) => setShow((p) => ({ ...p, [f]: !p[f] }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass || !confirmPass) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (newPass !== confirmPass) {
      toast.error("New keys do not match.");
      return;
    }
    if (newPass.length < 6) {
      toast.error("New key must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setSaved(false);
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        toast.error("Session expired — please log in again.");
        return;
      }

      // @ts-ignore
      const response = await changeAdminPassword({ currentPass, newPass, token });

      if (response?.success) {
        toast.success("Security key updated!");
        setSaved(true);
        setCurrentPass("");
        setNewPass("");
        setConfirmPass("");
        setTimeout(() => setSaved(false), 5000);
      } else {
        toast.error(response?.error ?? "Failed to update. Check your current key.");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const card = {
    background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
    border: "1px solid rgba(255,255,255,0.06)",
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage your security preferences.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Panel */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
        >
          <div className="rounded-2xl p-6 h-full space-y-4" style={card}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">Security Info</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your key is stored as a{" "}
              <span className="text-indigo-400 font-medium">bcrypt hash</span> in Neon PostgreSQL.
              It is never stored in plain text anywhere.
            </p>
            <div className="pt-3 border-t border-white/[0.05] space-y-2">
              {[
                { label: "Storage", val: "Neon PostgreSQL" },
                { label: "Hashing", val: "bcrypt (10 rounds)" },
                { label: "Session", val: "JWT · 24h expiry" },
              ].map((r) => (
                <div key={r.label} className="flex justify-between text-xs">
                  <span className="text-gray-600">{r.label}</span>
                  <span className="text-gray-400 font-medium">{r.val}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Change Password Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="lg:col-span-2"
        >
          <div className="rounded-2xl p-6" style={card}>
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-sm font-semibold text-white">Change Security Key</h2>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <PasswordField
                label="Current Key"
                value={currentPass}
                onChange={setCurrentPass}
                field="current"
                placeholder="Your current key"
                show={show}
                toggleShow={toggleShow}
              />
              <PasswordField
                label="New Key"
                value={newPass}
                onChange={setNewPass}
                field="newp"
                placeholder="Min. 6 characters"
                show={show}
                toggleShow={toggleShow}
                hint="Use a strong combination of letters, numbers, and symbols."
              />
              <PasswordField
                label="Confirm New Key"
                value={confirmPass}
                onChange={setConfirmPass}
                field="confirm"
                placeholder="Repeat new key"
                show={show}
                toggleShow={toggleShow}
              />

              {saved && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm text-emerald-400"
                  style={{
                    background: "rgba(52,211,153,0.06)",
                    border: "1px solid rgba(52,211,153,0.2)",
                  }}
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Security key updated successfully. Use it next time you log in.</span>
                </motion.div>
              )}

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isLoading ? "Updating…" : "Update Key"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  disabled={isLoading}
                  onClick={async () => {
                    const ok = confirm(
                      "Are you sure you want to reset the admin security key to '123'?",
                    );
                    if (!ok) return;
                    setIsLoading(true);
                    try {
                      const token = localStorage.getItem("admin_token");
                      if (!token) {
                        toast.error("Session expired");
                        return;
                      }
                      // @ts-ignore
                      const res = await resetAdminPassword({ token, newPass: "123" });
                      if (res?.success) toast.success("Security key reset to '123'");
                      else toast.error(res?.error || "Reset failed");
                    } catch {
                      toast.error("Connection error");
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-400 bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                >
                  Reset Key to "123"
                </motion.button>

                {!saved && !isLoading && (
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Keep this key safe — there is no recovery
                    link.
                  </p>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
