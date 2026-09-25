import { createServerFn } from "@tanstack/react-start";
import { db } from "./db";
import { z } from "zod";
import { createHash } from "crypto";

const PIXEL_ID = process.env.META_PIXEL_ID || "1109711544904339";
const CAPI_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

/**
 * Fire Purchase CAPI directly from server — bypasses createServerFn entirely.
 * Uses Node.js crypto for hashing and direct fetch to Meta Graph API.
 */
async function firePurchaseCAPI(payload: {
  event_id?: string;
  value: number;
  content_ids: string[];
  order_id: string;
  customer_email: string;
  customer_phone: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_city?: string;
  customer_postcode?: string;
  external_id?: string;
  fbp?: string;
  fbc?: string;
  client_user_agent?: string;
}) {
  if (!CAPI_TOKEN) {
    console.error("[CAPI] META_CAPI_ACCESS_TOKEN not set — Purchase dropped");
    return;
  }

  const user_data: Record<string, string> = {};
  if (payload.customer_email) user_data.em = sha256(payload.customer_email);
  if (payload.customer_phone) user_data.ph = sha256(payload.customer_phone);
  if (payload.customer_first_name) user_data.fn = sha256(payload.customer_first_name);
  if (payload.customer_last_name) user_data.ln = sha256(payload.customer_last_name);
  if (payload.customer_city) user_data.ct = sha256(payload.customer_city);
  if (payload.customer_postcode) user_data.zp = sha256(payload.customer_postcode);
  if (payload.external_id) user_data.external_id = sha256(payload.external_id);
  if (payload.fbp) user_data.fbp = payload.fbp;
  if (payload.fbc) user_data.fbc = payload.fbc;
  if (payload.client_user_agent) user_data.client_user_agent = payload.client_user_agent;

  const body = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: payload.event_id || undefined,
        user_data,
        custom_data: {
          content_ids: payload.content_ids,
          content_type: "product",
          value: payload.value,
          currency: "GBP",
          order_id: payload.order_id,
        },
        action_source: "website",
      },
    ],
  };

  try {
    const url = `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${CAPI_TOKEN}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await res.json();
    if (!res.ok) {
      console.error("[CAPI] Purchase FAILED:", JSON.stringify(result));
    } else {
      console.log("[CAPI] Purchase sent OK, events_received:", result.events_received);
    }
  } catch (err: any) {
    console.error("[CAPI] Purchase fetch error:", err?.message || err);
  }
}

export const saveOrder = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    try {
      const schema = z.object({
        customerName: z.string().min(1),
        customerEmail: z.string().min(1),
        customerPhone: z.string().min(1),
        customerAddress: z.string().min(1),
        items: z.string().min(1),
        total: z.number(),
        instructions: z.string().optional().or(z.literal("")),
        trackingToken: z.string().optional().or(z.literal("")),
        event_id: z.string().optional().or(z.literal("")),
        client_user_agent: z.string().optional().or(z.literal("")),
        external_id: z.string().optional().or(z.literal("")),
        fbp: z.string().optional().or(z.literal("")),
        fbc: z.string().optional().or(z.literal("")),
      });

      const parsed = schema.parse(data);

      let salespersonId: string | null = null;
      if (parsed.trackingToken && parsed.trackingToken.trim().length > 0) {
        const sp = await db.salesperson.findFirst({
          where: { token: parsed.trackingToken, status: "active" },
          select: { id: true },
        });
        if (sp) salespersonId = sp.id;
      }

      const order = await db.order.create({
        data: {
          customerName: parsed.customerName,
          customerEmail: parsed.customerEmail,
          customerPhone: parsed.customerPhone,
          customerAddress: parsed.customerAddress,
          items: parsed.items,
          instructions: parsed.instructions || null,
          total: parsed.total,
          status: "pending",
          salespersonId,
          trackingToken: parsed.trackingToken || null,
        },
      });

      let orderItems: any[] = [];
      try {
        orderItems = JSON.parse(parsed.items);
      } catch {}

      const nameParts = parsed.customerName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Extract city from address: "123 Street, Leeds, LS1 1AA, UK" → "Leeds"
      const addressParts = parsed.customerAddress.split(",").map((s: string) => s.trim());
      // City is typically the second part (after street, before postcode)
      const city = addressParts.length >= 3 ? addressParts[1] : addressParts[1] || "";

      const postcodeMatch = parsed.customerAddress.match(/([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})/i);

      firePurchaseCAPI({
        event_id: parsed.event_id || undefined,
        value: parsed.total,
        content_ids: orderItems.map((i: any) => i.id).filter(Boolean),
        order_id: order.id,
        customer_email: parsed.customerEmail,
        customer_phone: parsed.customerPhone,
        customer_first_name: firstName,
        customer_last_name: lastName,
        customer_city: city || undefined,
        customer_postcode: postcodeMatch?.[1] || undefined,
        external_id: parsed.external_id || undefined,
        fbp: parsed.fbp || undefined,
        fbc: parsed.fbc || undefined,
        client_user_agent: parsed.client_user_agent || undefined,
      }).catch(() => {});

      return { success: true, orderId: order.id };
    } catch (err: any) {
      console.error("saveOrder error:", err?.message || err);
      return { success: false, error: err?.message || "unknown error" };
    }
  },
);

export const trackVisit = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    try {
      const schema = z.object({
        token: z.string().min(1),
        pageUrl: z.string().optional().or(z.literal("")),
        referrer: z.string().optional().or(z.literal("")),
      });

      const parsed = schema.parse(data);

      const sp = await db.salesperson.findFirst({
        where: { token: parsed.token, status: "active" },
        select: { id: true, token: true },
      });

      if (sp) {
        await db.siteVisit.create({
          data: {
            salespersonId: sp.id,
            token: sp.token,
            pageUrl: parsed.pageUrl || null,
            referrer: parsed.referrer || null,
            userAgent: null,
          },
        });
      }

      return { success: true, found: !!sp };
    } catch (err: any) {
      console.error("trackVisit error:", err?.message || err);
      return { success: false, error: err?.message || "unknown" };
    }
  },
);
