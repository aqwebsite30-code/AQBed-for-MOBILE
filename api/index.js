import { Readable } from "stream";

// Import the dynamically built Server SSR entry point
const serverPromise = import("../dist/server/server.js").then((m) => m.default || m);

export default async function (req, res) {
  try {
    const server = await serverPromise;

    // Construct the full URL
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const url = `${protocol}://${host}${req.url}`;

    // Build Web Request Init
    const init = {
      method: req.method,
      headers: req.headers,
    };

    // If request has a body, forward it as a Node stream
    if (req.method !== "GET" && req.method !== "HEAD") {
      init.body = req;
      init.duplex = "half";
    }

    const webReq = new Request(url, init);

    // Mock Cloudflare context to satisfy the handler if needed
    const env = process.env;
    const ctx = {
      waitUntil: () => {},
      passThroughOnException: () => {},
    };

    // Call the original Cloudflare-style fetch handler natively
    let webRes;
    if (typeof server.fetch === "function") {
      webRes = await server.fetch(webReq, env, ctx);
    } else if (typeof server === "function") {
      webRes = await server(webReq, env, ctx);
    } else {
      throw new Error(`Server handler not found in dist/server/server.js`);
    }

    // Proxy the Web Response back to Vercel Node Response
    webRes.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    res.statusCode = webRes.status;

    if (webRes.body) {
      if (webRes.body instanceof Uint8Array || typeof webRes.body === "string") {
        res.end(webRes.body);
      } else {
        const nodeStream = Readable.fromWeb(webRes.body);
        nodeStream.pipe(res);
      }
    } else {
      res.end();
    }
  } catch (err) {
    console.error("Vercel API SSR Error:", err);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}
