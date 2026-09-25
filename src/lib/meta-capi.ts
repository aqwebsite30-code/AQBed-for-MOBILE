/**
 * Meta Conversions API (CAPI) — Client-side functions.
 * These POST to /api/meta-capi which is a standalone Vercel serverless function
 * that hashes PII and forwards to Meta Graph API v21.0.
 *
 * Why NOT createServerFn? TanStack Start's createServerFn uses internal RPC
 * which can fail silently in serverless environments. A direct POST to a
 * standard Vercel API route is 100% reliable.
 */

const CAPI_ENDPOINT = "/api/meta-capi";

let cachedClientIp = "";

async function getClientIp(): Promise<string> {
  if (cachedClientIp) return cachedClientIp;
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    if (data.ip) {
      cachedClientIp = data.ip;
      return data.ip;
    }
  } catch {}
  return "";
}

/**
 * Internal helper: POST event data to the server-side CAPI endpoint.
 * Uses keepalive: true so browser navigation (page unload) does not abort
 * in-flight CAPI requests (AddToCart, InitiateCheckout, etc.).
 */
async function postToCAPI(payload: {
  event_name: string;
  event_time: number;
  event_id?: string;
  user_data: Record<string, string>;
  custom_data?: Record<string, any>;
  action_source?: string;
  client_ip_address?: string;
  client_user_agent?: string;
  test_event_code?: string;
}): Promise<void> {
  try {
    const userAgent = payload.client_user_agent || (typeof navigator !== "undefined" ? navigator.userAgent : "");
    const ip = payload.client_ip_address || await getClientIp();

    const body: Record<string, any> = {
      event_name: payload.event_name,
      event_time: payload.event_time,
      event_id: payload.event_id,
      user_data: payload.user_data,
      custom_data: payload.custom_data,
      action_source: payload.action_source,
      client_ip_address: ip,
      client_user_agent: userAgent,
    };
    if (payload.test_event_code) {
      body.test_event_code = payload.test_event_code;
    }

    // keepalive: true ensures the request completes even if the user navigates away
    const res = await fetch(CAPI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
    const result = await res.json();
    if (!res.ok) {
      console.error(`[CAPI] ${payload.event_name} server error:`, result);
    } else {
      console.log(`[CAPI] ${payload.event_name} sent OK, events_received:`, result.events_received);
    }
  } catch (err: any) {
    console.error(`[CAPI] ${payload.event_name} fetch failed:`, err?.message || err);
  }
}

// ─── ViewContent ─────────────────────────────────────────────────────────────

export async function sendViewContentEvent(payload: {
  event_id?: string;
  content_ids: string[];
  content_name: string;
  content_type: string;
  value: number;
  currency: "GBP";
  client_user_agent?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_first_name?: string;
  customer_last_name?: string;
  customer_city?: string;
  customer_state?: string;
  customer_country?: string;
  customer_postcode?: string;
  external_id?: string;
  fbp?: string;
  fbc?: string;
  test_event_code?: string;
}): Promise<{ success: boolean }> {
  await postToCAPI({
    event_name: "ViewContent",
    event_time: Math.floor(Date.now() / 1000),
    event_id: payload.event_id,
    user_data: {
      em: payload.customer_email || "",
      ph: payload.customer_phone || "",
      fn: payload.customer_first_name || "",
      ln: payload.customer_last_name || "",
      ct: payload.customer_city || "",
      st: payload.customer_state || "",
      country: payload.customer_country || "",
      zp: payload.customer_postcode || "",
      external_id: payload.external_id || "",
      fbp: payload.fbp || "",
      fbc: payload.fbc || "",
    },
    custom_data: {
      content_ids: payload.content_ids,
      content_name: payload.content_name,
      content_type: payload.content_type,
      value: payload.value,
      currency: payload.currency,
    },
    action_source: "website",
    client_user_agent: payload.client_user_agent,
    test_event_code: payload.test_event_code,
  });
  return { success: true };
}

// ─── AddToCart ──────────────────────────────────────────────────────────────

export async function sendAddToCartEvent(payload: {
  event_id?: string;
  content_ids: string[];
  content_name: string;
  content_type: string;
  value: number;
  currency: "GBP";
  client_user_agent?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_first_name?: string;
  customer_last_name?: string;
  customer_city?: string;
  customer_state?: string;
  customer_country?: string;
  customer_postcode?: string;
  external_id?: string;
  fbp?: string;
  fbc?: string;
  test_event_code?: string;
}): Promise<{ success: boolean }> {
  await postToCAPI({
    event_name: "AddToCart",
    event_time: Math.floor(Date.now() / 1000),
    event_id: payload.event_id,
    user_data: {
      em: payload.customer_email || "",
      ph: payload.customer_phone || "",
      fn: payload.customer_first_name || "",
      ln: payload.customer_last_name || "",
      ct: payload.customer_city || "",
      st: payload.customer_state || "",
      country: payload.customer_country || "",
      zp: payload.customer_postcode || "",
      external_id: payload.external_id || "",
      fbp: payload.fbp || "",
      fbc: payload.fbc || "",
    },
    custom_data: {
      content_ids: payload.content_ids,
      content_name: payload.content_name,
      content_type: payload.content_type,
      value: payload.value,
      currency: payload.currency,
    },
    action_source: "website",
    client_user_agent: payload.client_user_agent,
    test_event_code: payload.test_event_code,
  });
  return { success: true };
}

// ─── InitiateCheckout ───────────────────────────────────────────────────────

export async function sendInitiateCheckoutEvent(payload: {
  event_id?: string;
  value: number;
  currency: "GBP";
  num_items: number;
  content_ids: string[];
  content_type?: string;
  client_user_agent?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_first_name?: string;
  customer_last_name?: string;
  customer_city?: string;
  customer_state?: string;
  customer_country?: string;
  customer_postcode?: string;
  external_id?: string;
  fbp?: string;
  fbc?: string;
  test_event_code?: string;
}): Promise<{ success: boolean }> {
  await postToCAPI({
    event_name: "InitiateCheckout",
    event_time: Math.floor(Date.now() / 1000),
    event_id: payload.event_id,
    user_data: {
      em: payload.customer_email || "",
      ph: payload.customer_phone || "",
      fn: payload.customer_first_name || "",
      ln: payload.customer_last_name || "",
      ct: payload.customer_city || "",
      st: payload.customer_state || "",
      country: payload.customer_country || "",
      zp: payload.customer_postcode || "",
      external_id: payload.external_id || "",
      fbp: payload.fbp || "",
      fbc: payload.fbc || "",
    },
    custom_data: {
      content_ids: payload.content_ids,
      content_type: payload.content_type || "product",
      value: payload.value,
      currency: payload.currency,
      num_items: payload.num_items,
    },
    action_source: "website",
    client_user_agent: payload.client_user_agent,
    test_event_code: payload.test_event_code,
  });
  return { success: true };
}

// ─── Purchase ───────────────────────────────────────────────────────────────

export async function sendPurchaseEvent(payload: {
  event_id?: string;
  value: number;
  currency: "GBP";
  content_ids: string[];
  content_type: string;
  order_id: string;
  client_user_agent?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_first_name?: string;
  customer_last_name?: string;
  customer_city?: string;
  customer_postcode?: string;
  external_id?: string;
  fbp?: string;
  fbc?: string;
  test_event_code?: string;
}): Promise<{ success: boolean }> {
  await postToCAPI({
    event_name: "Purchase",
    event_time: Math.floor(Date.now() / 1000),
    event_id: payload.event_id,
    user_data: {
      em: payload.customer_email || "",
      ph: payload.customer_phone || "",
      fn: payload.customer_first_name || "",
      ln: payload.customer_last_name || "",
      ct: payload.customer_city || "",
      zp: payload.customer_postcode || "",
      external_id: payload.external_id || "",
      fbp: payload.fbp || "",
      fbc: payload.fbc || "",
    },
    custom_data: {
      content_ids: payload.content_ids,
      content_type: payload.content_type,
      value: payload.value,
      currency: payload.currency,
      order_id: payload.order_id,
    },
    action_source: "website",
    client_user_agent: payload.client_user_agent,
    test_event_code: payload.test_event_code,
  });
  return { success: true };
}

// ─── PageView ───────────────────────────────────────────────────────────────

export async function sendPageViewEvent(payload: {
  event_id?: string;
  page_url?: string;
  external_id?: string;
  fbp?: string;
  fbc?: string;
  client_user_agent?: string;
  test_event_code?: string;
}): Promise<{ success: boolean }> {
  await postToCAPI({
    event_name: "PageView",
    event_time: Math.floor(Date.now() / 1000),
    event_id: payload.event_id,
    user_data: {
      external_id: payload.external_id || "",
      fbp: payload.fbp || "",
      fbc: payload.fbc || "",
    },
    custom_data: {
      page_url: payload.page_url || (typeof window !== "undefined" ? window.location.href : ""),
    },
    action_source: "website",
    client_user_agent: payload.client_user_agent,
    test_event_code: payload.test_event_code,
  });
  return { success: true };
}
