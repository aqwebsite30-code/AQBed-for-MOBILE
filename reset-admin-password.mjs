/**
 * One-time script to reset the admin password to "123"
 * Run with: node reset-admin-password.mjs
 */
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// Load env vars
import { readFileSync } from "fs";
const envContent = readFileSync(".env", "utf-8");
const env = {};
for (const line of envContent.split("\n")) {
  const [key, ...rest] = line.split("=");
  if (key && rest.length)
    env[key.trim()] = rest
      .join("=")
      .replace(/^"(.*)"$/, "$1")
      .trim();
}

const DATABASE_URL = env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not found in .env");
  process.exit(1);
}

const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient({ datasources: { db: { url: DATABASE_URL } } });

async function resetPassword() {
  try {
    console.log("Connecting to database...");
    const adminEmail = env.ADMIN_EMAIL || "admin@aqbeds.com";
    const newPassword = "123";

    const admin = await db.adminUser.findUnique({ where: { email: adminEmail } });
    if (!admin) {
      console.log('Admin user not found. Creating with password "123"...');
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(newPassword, salt);
      await db.adminUser.create({ data: { email: adminEmail, password: hashed, role: "admin" } });
    } else {
      console.log(`Found admin: ${adminEmail}. Resetting password...`);
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(newPassword, salt);
      await db.adminUser.update({ where: { email: adminEmail }, data: { password: hashed } });
    }

    console.log('✅ Admin password successfully reset to "123"');
    console.log(`   Email: ${adminEmail}`);
    console.log("   Password: 123");
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await db.$disconnect();
  }
}

resetPassword();
