import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { z } from "zod";

// Secure bcrypt helpers — dynamic import keeps Node.js off the client bundle
async function hashPassword(password: string): Promise<string> {
  if (typeof window !== "undefined") return ""; // Should never run on client
  const bcrypt = await import("bcryptjs");
  const salt = await bcrypt.default.genSalt(10);
  return bcrypt.default.hash(password, salt);
}

async function comparePassword(password: string, hash: string): Promise<boolean> {
  if (typeof window !== "undefined") return false;
  const bcrypt = await import("bcryptjs");
  return bcrypt.default.compare(password, hash);
}

const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

const changePassSchema = z.object({
  currentPass: z.string(),
  newPass: z.string().min(6, "New key must be at least 6 characters."),
});

const JWT_SECRET = process.env.JWT_SECRET;

// ─── AUTH MIDDLEWARE ──────────────────────────────────────────────────────────
export async function verifyAuth(token?: string) {
  if (!token || !JWT_SECRET || typeof window !== "undefined") return null;
  try {
    const jwt = await import("jsonwebtoken");
    const decoded = jwt.default.verify(token, JWT_SECRET) as { id: string; role: string };
    return decoded;
  } catch (err) {
    return null;
  }
}

// ─── 1. LOGIN ─────────────────────────────────────────────────────────────────
export const loginAdmin = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    try {
      const { password } = loginSchema.parse(data);
      const adminEmail = process.env.ADMIN_EMAIL || "admin@aqbeds.com";

      const admin = await db.adminUser.findUnique({ where: { email: adminEmail } });
      if (!admin) {
        return { success: false as const, error: "Admin account not initialized. Run seed first." };
      }

      const isMatch = await comparePassword(password, admin.password);
      if (!isMatch) return { success: false as const, error: "Incorrect security key." };

      const jwt = await import("jsonwebtoken");
      const token = jwt.default.sign(
        { id: admin.id, role: admin.role },
        JWT_SECRET || "fallback_only_for_dev",
        { expiresIn: "1d" },
      );
      return { success: true as const, token };
    } catch (err: any) {
      return { success: false as const, error: "Login failed." };
    }
  },
);

const changePassWithTokenSchema = changePassSchema.extend({
  token: z.string(),
});

// ─── 2. CHANGE PASSWORD ───────────────────────────────────────────────────────
export const changeAdminPassword = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    try {
      const { currentPass, newPass, token } = changePassWithTokenSchema.parse(data);

      // Verification
      const auth = await verifyAuth(token);
      if (!auth)
        return {
          success: false as const,
          error: "Unauthorized access. Your session may have expired.",
        };

      const admin = await db.adminUser.findUnique({ where: { id: auth.id } });
      if (!admin) return { success: false as const, error: "Admin account not found." };

      const isMatch = await comparePassword(currentPass, admin.password);
      if (!isMatch) return { success: false as const, error: "Current security key is incorrect." };

      const newHashed = await hashPassword(newPass);
      await db.adminUser.update({
        where: { id: admin.id },
        data: { password: newHashed },
      });

      return { success: true as const };
    } catch (err: any) {
      if (err instanceof z.ZodError)
        return { success: false as const, error: err.errors[0].message };
      return { success: false as const, error: "Failed to update security key." };
    }
  },
);

// ─── 3. FORCE-RESET PASSWORD (requires valid token) ──────────────────────────
export const resetAdminPassword = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    try {
      const { token, newPass } = z.object({ token: z.string(), newPass: z.string() }).parse(data);
      const auth = await verifyAuth(token);
      if (!auth)
        return { success: false as const, error: "Unauthorized. Session may have expired." };
      const admin = await db.adminUser.findUnique({ where: { id: auth.id } });
      if (!admin) return { success: false as const, error: "Admin not found." };
      const bcrypt = await import("bcryptjs");
      const salt = await bcrypt.default.genSalt(10);
      const hashed = await bcrypt.default.hash(newPass, salt);
      await db.adminUser.update({ where: { id: admin.id }, data: { password: hashed } });
      return { success: true as const };
    } catch {
      return { success: false as const, error: "Reset failed." };
    }
  },
);
