import { createRequire } from "module";
const require2 = createRequire(import.meta.url);
const { chromium } = require2(
  "C:/Users/abdulraheem bulbul/AppData/Roaming/npm/node_modules/omniroute/node_modules/playwright"
);

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const browserEvents = [];
const capiEvents = [];
const allFb = [];

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const context = await browser.newContext({
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  viewport: { width: 1366, height: 768 },
  locale: "en-GB",
});
const page = await context.newPage();

page.on("request", (req) => {
  const url = req.url();
  if (url.includes("/api/meta-capi") && req.method() === "POST") {
    try {
      const body = JSON.parse(req.postData() || "{}");
      capiEvents.push({
        event_name: body.event_name,
        event_id: body.event_id,
        content_ids: body.custom_data && body.custom_data.content_ids,
        content_type: body.custom_data && body.custom_data.content_type,
      });
    } catch {}
  }
  if (/facebook\.com\/tr/i.test(url) || /facebook\.com\/tr\//i.test(url)) {
    try {
      const u = new URL(url);
      browserEvents.push({
        ev: u.searchParams.get("ev"),
        eid: u.searchParams.get("eid"),
        id: u.searchParams.get("id"),
        noscript: u.searchParams.get("noscript"),
        url: url.slice(0, 700),
      });
    } catch {
      browserEvents.push({ url });
    }
  }
  if (/facebook|fbcdn/i.test(url) && !/\.(png|jpg|jpeg|webp|gif|css|woff)/i.test(url)) {
    allFb.push({ m: req.method(), u: url.slice(0, 400) });
  }
});

const BASE = process.env.AQ_BASE || "https://www.aqbeds.com";
await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
await page.waitForTimeout(5000);

// SPA nav via real link
await page.evaluate(() => {
  const a = document.querySelector('a[href="/shop"]');
  if (a) a.click();
  else {
    window.history.pushState({}, "", "/shop");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
});
await page.waitForTimeout(6000);

// Product page ViewContent via real link if present
await page.evaluate(() => {
  const a = document.querySelector('a[href*="/product/"]');
  if (a) a.click();
  else {
    window.history.pushState({}, "", "/product/ambessador");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
});
await page.waitForTimeout(8000);

console.log("PATH:", await page.evaluate(() => window.location.pathname));

console.log("=== BROWSER PageView/tr EVENTS ===");
for (const e of browserEvents) console.log(JSON.stringify(e));

console.log("\n=== CAPI EVENTS ===");
for (const e of capiEvents) console.log(JSON.stringify(e));

console.log("\n=== MATCH CHECK ===");
const browserPV = browserEvents.filter((e) => e.ev === "PageView" && e.eid);
const capiPV = capiEvents.filter((e) => e.event_name === "PageView");
for (const b of browserPV) {
  const match = capiPV.find((c) => c.event_id === b.eid);
  console.log(
    JSON.stringify({
      browser_eid: b.eid,
      is_ob3: String(b.eid).startsWith("ob3"),
      capi_match: match ? match.event_id : null,
      dedup_ok: !!match,
    })
  );
}

console.log("\n=== ALL FB REQUESTS ===");
for (const r of allFb) console.log(JSON.stringify(r));

const ob3 = browserEvents.filter((e) => String(e.eid || "").includes("ob3"));
console.log("\n=== OB3 COUNT ===", ob3.length);
for (const o of ob3) console.log(JSON.stringify(o));

await browser.close();
