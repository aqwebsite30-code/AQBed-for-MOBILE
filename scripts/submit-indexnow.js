const apiKey = "67893aa8cdc24e918a97e93a1f5c7256";
const host = "https://www.aqbeds.com";

const urls = [
  `${host}/`,
  `${host}/shop`,
  `${host}/about`,
  `${host}/contact`,
  `${host}/faqs`,
  `${host}/returns`,
  `${host}/delivery`,
  `${host}/search`,
  `${host}/wishlist`,
  `${host}/cart`,
  `${host}/category/ottoman-beds`,
  `${host}/category/divan-beds`,
  `${host}/category/storage-beds`,
  `${host}/category/single-beds`,
  `${host}/category/double-beds`,
  `${host}/category/kingsize-beds`,
  `${host}/category/superking-beds`,
  `${host}/category/sofas`,
  `${host}/category/mattresses`,
  `${host}/category/headboards`,
];

async function submitIndexNow() {
  const body = { host: host.replace("https://", ""), key: apiKey, keyLocation: `${host}/${apiKey}.txt`, urlList: urls };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    console.log(`IndexNow response: ${res.status} ${res.statusText}`);
    if (!res.ok) {
      const text = await res.text();
      console.error(`IndexNow error body: ${text}`);
    }
  } catch (err) {
    console.error("IndexNow submission failed:", err);
  }
}

submitIndexNow();
