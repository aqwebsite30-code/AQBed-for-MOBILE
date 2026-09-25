import { createRequire } from "module";
const require2 = createRequire(import.meta.url);
const { chromium } = require2(
  "C:/Users/abdulraheem bulbul/AppData/Roaming/npm/node_modules/omniroute/node_modules/playwright"
);

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const browserEvents = [];
const capiEvents = [];
const errors = [];

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const context = await browser.newContext({
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  viewport: { width: 1366, height: 768 },
  locale: "en-GB",
});
const page = await context.newPage();
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text().slice(0, 300));
});
page.on("pageerror", (err) => errors.push(String(err).slice(0, 300)));

page.on("request", (req) => {
  const url = req.url();
  if (url.includes("/api/meta-capi") && req.method() === "POST") {
    try {
      const body = JSON.parse(req.postData() || "{}");
      capiEvents.push({
        event_name: body.event_name,
        event_id: body.event_id,
        content_ids: body.custom_data && body.custom_data.content_ids,
      });
    } catch {}
  }
  if (/facebook\.com\/tr/i.test(url)) {
    try {
      const u = new URL(url);
      browserEvents.push({ ev: u.searchParams.get("ev"), eid: u.searchParams.get("eid") });
    } catch {}
  }
});

const BASE = process.env.AQ_BASE || "https://www.aqbeds.com";
console.log("Loading", BASE + "/product/divan");
await page.goto(BASE + "/product/divan", { waitUntil: "networkidle", timeout: 60000 }).catch((e) => console.log("goto err", e.message));
await page.waitForTimeout(8000);

console.log("PATH:", await page.evaluate(() => window.location.pathname));
console.log("H1:", await page.evaluate(() => document.querySelector("h1")?.textContent || "(none)"));
console.log("fbq type:", await page.evaluate(() => typeof window.fbq));
console.log("lastPageView debug - PageView events below");

console.log("=== BROWSER ===");
for (const e of browserEvents) console.log(JSON.stringify(e));
console.log("=== CAPI ===");
for (const e of capiEvents) console.log(JSON.stringify(e));
console.log("=== ERRORS ===");
for (const e of errors) console.log(JSON.stringify(e));

await browser.close();
