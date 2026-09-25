import { createHash } from "crypto";

function sha256(value) {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function jsonResponse(res, status, data) {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = status;
  res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    return res.end();
  }
  if (req.method !== "POST") {
    return jsonResponse(res, 405, { error: "Method not allowed" });
  }

  let parsed;
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString("utf-8");
    parsed = JSON.parse(raw);
  } catch {
    return jsonResponse(res, 400, { error: "Invalid JSON body" });
  }

  const { event_name, event_time, event_id, user_data, custom_data, action_source, client_ip_address, client_user_agent, test_event_code } = parsed;

  if (!event_name) {
    return jsonResponse(res, 400, { error: "event_name is required" });
  }

  const PIXEL_ID = process.env.META_PIXEL_ID || "1109711544904339";
  const CAPI_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;

  if (!CAPI_TOKEN) {
    console.error("[CAPI] META_CAPI_ACCESS_TOKEN is not set — event dropped:", event_name);
    return jsonResponse(res, 500, { error: "CAPI token not configured" });
  }

  const hashedUserData = {};
  if (user_data) {
    if (user_data.em) hashedUserData.em = sha256(user_data.em);
    if (user_data.ph) hashedUserData.ph = sha256(user_data.ph);
    if (user_data.fn) hashedUserData.fn = sha256(user_data.fn);
    if (user_data.ln) hashedUserData.ln = sha256(user_data.ln);
    if (user_data.ct) hashedUserData.ct = sha256(user_data.ct);
    if (user_data.st) hashedUserData.st = sha256(user_data.st);
    if (user_data.country) hashedUserData.country = sha256(user_data.country);
    if (user_data.zp) hashedUserData.zp = sha256(user_data.zp);
    if (user_data.external_id) hashedUserData.external_id = sha256(user_data.external_id);
    if (user_data.fbp) hashedUserData.fbp = user_data.fbp;
    if (user_data.fbc) hashedUserData.fbc = user_data.fbc;
  }

  if (client_ip_address) hashedUserData.client_ip_address = client_ip_address;
  if (client_user_agent) hashedUserData.client_user_agent = client_user_agent;

  const body = {
    data: [
      {
        event_name,
        event_time: event_time || Math.floor(Date.now() / 1000),
        event_id: event_id || undefined,
        user_data: hashedUserData,
        custom_data: custom_data || {},
        action_source: action_source || "website",
      },
    ],
  };

  if (test_event_code) {
    body.test_event_code = test_event_code;
  }

  try {
    const url = `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${CAPI_TOKEN}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json();

    if (!response.ok) {
      console.error(`[CAPI] ${event_name} FAILED (${response.status}):`, JSON.stringify(result));
      return jsonResponse(res, response.status, { error: result });
    }

    console.log(`[CAPI] ${event_name} sent OK — events_received: ${result.events_received}`);
    return jsonResponse(res, 200, { success: true, events_received: result.events_received });
  } catch (err) {
    console.error(`[CAPI] ${event_name} fetch error:`, err.message || err);
    return jsonResponse(res, 500, { error: err.message });
  }
}
