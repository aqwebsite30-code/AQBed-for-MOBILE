import { createServerFn } from "@tanstack/react-start";
import { Resend } from "resend";
import { formatGBP } from "../utils/format";
import { PRODUCTS } from "../features/products/data/products";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

interface OrderEmailData {
  customer: {
    name: string;
    email: string;
    phone: string;
    addr1: string;
    city: string;
    postcode: string;
    country: string;
    payment: string;
  };
  items: Array<{
    name: string;
    qty: number;
    price: number;
    options?: Record<string, string>;
  }>;
  total: string;
}

export const sendOrderEmail = createServerFn({ method: "POST" }).handler(async (ctx: any) => {
  try {
    const NOTIFICATION_EMAIL = "aqbeds2822@gmail.com";
    const data = ctx?.data || ctx;
    const { customer, items, total: clientTotal } = data;

    // Escape user input
    const safeCustomer = {
      name: escapeHtml(customer.name),
      email: escapeHtml(customer.email),
      phone: escapeHtml(customer.phone),
      addr1: escapeHtml(customer.addr1),
      city: escapeHtml(customer.city),
      postcode: escapeHtml(customer.postcode),
      country: escapeHtml(customer.country || "United Kingdom"),
      payment: escapeHtml(customer.payment || "Cash on delivery"),
    };

    // Process Items
    const itemsHtml = items
      .map((item: any) => {
        const itemOptions = item.options || {};
        const optionsHtml = Object.entries(itemOptions)
          .map(
            ([k, v]) => `
            <div style="font-size: 12px; color: #666; margin-top: 2px;">
              <span style="font-weight: 600; color: #444;">${escapeHtml(k)}:</span> ${escapeHtml(String(v))}
            </div>
          `,
          )
          .join("");

        return `
        <tr>
          <td style="padding: 16px 12px; border-bottom: 1px solid #eee; vertical-align: top;">
            <div style="font-weight: 700; color: #111; font-size: 15px; margin-bottom: 4px;">${escapeHtml(item.name)}</div>
            ${optionsHtml}
          </td>
          <td style="padding: 16px 12px; border-bottom: 1px solid #eee; text-align: center; vertical-align: top; font-weight: 600;">${item.qty}</td>
          <td style="padding: 16px 12px; border-bottom: 1px solid #eee; text-align: right; vertical-align: top; font-weight: 700; color: #2563eb;">${formatGBP(item.price)}</td>
        </tr>
      `;
      })
      .join("");

    // 1. Send Admin Notification Email
    const resend = getResend();
    const adminResponse = await resend.emails.send({
      from: "AQ Beds <onboarding@resend.dev>",
      to: [NOTIFICATION_EMAIL],
      subject: `New Order from ${safeCustomer.name}`,
      html: `
          <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #333; background-color: #f9fafb; padding: 20px;">
            <div style="background: #000; padding: 40px 20px; text-align: center; border-radius: 16px 16px 0 0; border-bottom: 4px solid #2563eb;">
              <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: 2px; text-transform: uppercase;">AQ BEDS</h1>
              <p style="color: #9ca3af; margin-top: 8px; font-size: 14px; font-weight: 500;">Premium Sleep Notification</p>
            </div>
            
            <div style="padding: 40px; background: #fff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px; shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              
              <div style="margin-bottom: 35px;">
                <h2 style="font-size: 20px; margin: 0 0 20px; color: #111; border-left: 4px solid #2563eb; padding-left: 15px;">Customer Information</h2>
                <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #f1f5f9;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 4px 0; color: #64748b; width: 120px; font-size: 14px;">Full Name:</td>
                      <td style="padding: 4px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${safeCustomer.name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; color: #64748b; font-size: 14px;">Email Address:</td>
                      <td style="padding: 4px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${safeCustomer.email}</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; color: #64748b; font-size: 14px;">Phone Number:</td>
                      <td style="padding: 4px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${safeCustomer.phone}</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; color: #64748b; vertical-align: top; font-size: 14px;">Shipping Address:</td>
                      <td style="padding: 4px 0; color: #1e293b; font-weight: 600; font-size: 14px;">
                        ${safeCustomer.addr1}<br>
                        ${safeCustomer.city}, ${safeCustomer.postcode}<br>
                        ${safeCustomer.country}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; color: #64748b; font-size: 14px;">Payment Method:</td>
                      <td style="padding: 4px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${safeCustomer.payment}</td>
                    </tr>
                  </table>
                </div>
              </div>
              
              <div style="margin-bottom: 30px;">
                <h2 style="font-size: 20px; margin: 0 0 20px; color: #111; border-left: 4px solid #2563eb; padding-left: 15px;">Product Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background: #f1f5f9;">
                      <th style="padding: 12px; text-align: left; color: #475569; font-size: 13px; text-transform: uppercase; font-weight: 700;">Item</th>
                      <th style="padding: 12px; text-align: center; color: #475569; font-size: 13px; text-transform: uppercase; font-weight: 700;">Qty</th>
                      <th style="padding: 12px; text-align: right; color: #475569; font-size: 13px; text-transform: uppercase; font-weight: 700;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="2" style="padding: 20px 12px; text-align: right; font-weight: 700; font-size: 16px; color: #111;">Order Total:</td>
                      <td style="padding: 20px 12px; text-align: right; font-weight: 800; font-size: 24px; color: #2563eb;">${clientTotal}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; margin-top: 40px;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">This order was placed securely via the AQ Beds E-commerce System.</p>
              </div>
            </div>
          </div>
        `,
    });

    // 2. Send Customer Confirmation Email
    if (customer.email) {
      await resend.emails.send({
        from: "AQ Beds <onboarding@resend.dev>",
        to: [safeCustomer.email],
        subject: `Your AQ Beds Order Confirmation — Thank You!`,
        html: `
            <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #333; background-color: #f9fafb; padding: 20px;">
              <div style="background: #000; padding: 40px 20px; text-align: center; border-radius: 16px 16px 0 0; border-bottom: 4px solid #2563eb;">
                <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: 2px; text-transform: uppercase;">AQ BEDS</h1>
                <p style="color: #9ca3af; margin-top: 8px; font-size: 14px; font-weight: 500;">Order Confirmation</p>
              </div>
              
              <div style="padding: 40px; background: #fff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px; shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center; margin-bottom: 35px;">
                  <h2 style="font-size: 24px; margin: 0 0 10px; color: #111;">Thank You!</h2>
                  <p style="color: #64748b; font-size: 16px; margin: 0;">We've received your order, <strong>${safeCustomer.name}</strong>.</p>
                  <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Your premium sleep journey begins today.</p>
                </div>

                <div style="background: #eff6ff; padding: 20px; border-radius: 12px; margin-bottom: 35px; border: 1px solid #dbeafe;">
                  <p style="margin: 0; color: #1e3a8a; font-size: 14px; line-height: 1.6; text-align: center;">
                    Our team is currently preparing your order. We will contact you via phone or WhatsApp shortly to arrange the most convenient delivery time.
                  </p>
                </div>

                <div style="margin-bottom: 35px;">
                  <h2 style="font-size: 18px; margin: 0 0 15px; color: #111; font-weight: 700;">Order Summary</h2>
                  <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                      <tr style="background: #f1f5f9;">
                        <th style="padding: 12px; text-align: left; color: #475569; font-size: 12px; text-transform: uppercase; font-weight: 700;">Item</th>
                        <th style="padding: 12px; text-align: center; color: #475569; font-size: 12px; text-transform: uppercase; font-weight: 700;">Qty</th>
                        <th style="padding: 12px; text-align: right; color: #475569; font-size: 12px; text-transform: uppercase; font-weight: 700;">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="2" style="padding: 20px 12px; text-align: right; font-weight: 700; font-size: 16px; color: #111;">Total Paid (COD):</td>
                        <td style="padding: 20px 12px; text-align: right; font-weight: 800; font-size: 24px; color: #2563eb;">${clientTotal}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div style="margin-bottom: 30px;">
                  <h2 style="font-size: 18px; margin: 0 0 15px; color: #111; font-weight: 700;">Delivery Details</h2>
                  <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #f1f5f9; font-size: 14px; color: #1e293b; font-weight: 500;">
                    ${safeCustomer.name}<br>
                    ${safeCustomer.addr1}<br>
                    ${safeCustomer.city}, ${safeCustomer.postcode}<br>
                    ${safeCustomer.country}
                  </div>
                </div>

                <div style="text-align: center; padding-top: 30px; border-top: 1px solid #f1f5f9; margin-top: 40px;">
                  <p style="color: #64748b; font-size: 14px; margin-bottom: 20px;">Questions? Simply reply to this email or contact us via WhatsApp.</p>
                  <p style="color: #9ca3af; font-size: 12px; margin: 0;">AQ BEDS — Luxury Handcrafted Sleep Solutions</p>
                </div>
              </div>
            </div>
          `,
      });
    }

    if (adminResponse.error) {
      console.error("Resend Admin Email Error:", adminResponse.error);
      return { success: false, error: adminResponse.error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Resend Error:", error);
    return { success: false, error: error.message };
  }
});

export async function sendChatNotification(sessionId: string, content: string) {
  try {
    const safeContent = escapeHtml(content.slice(0, 200));
    const shortId = sessionId.slice(-6).toUpperCase();

    const resend = getResend();
    await resend.emails.send({
      from: "AQ Beds <onboarding@resend.dev>",
      to: ["aqbeds2822@gmail.com"],
      subject: `New Chat Message — Session #${shortId}`,
      html: `
        <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #f9fafb; padding: 20px;">
          <div style="background: #000; padding: 30px 20px; text-align: center; border-radius: 16px 16px 0 0; border-bottom: 4px solid #10b981;">
            <h1 style="color: white; margin: 0; font-size: 22px; letter-spacing: 2px;">AQ BEDS</h1>
            <p style="color: #6ee7b7; margin-top: 6px; font-size: 13px;">Live Chat Notification</p>
          </div>
          <div style="padding: 30px; background: #fff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px;">
            <div style="background: #f0fdf4; padding: 16px; border-radius: 10px; border: 1px solid #bbf7d0; margin-bottom: 20px;">
              <p style="margin: 0; font-size: 14px; color: #166534; font-weight: 600;">
                A customer has sent a new message via Live Chat.
              </p>
            </div>

            <div style="margin-bottom: 20px;">
              <p style="font-size: 11px; color: #9ca3af; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; margin: 0 0 8px;">Session</p>
              <p style="font-size: 15px; color: #111; font-weight: 600; margin: 0;">#${shortId}</p>
            </div>

            <div style="margin-bottom: 24px;">
              <p style="font-size: 11px; color: #9ca3af; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; margin: 0 0 8px;">Message</p>
              <div style="background: #f8fafc; padding: 16px; border-radius: 10px; border: 1px solid #f1f5f9;">
                <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.6;">${safeContent}</p>
              </div>
            </div>

            <a href="https://aqbeds.co.uk/admin/chat" style="display: block; text-align: center; background: #10b981; color: white; text-decoration: none; padding: 14px 20px; border-radius: 10px; font-weight: 700; font-size: 14px; letter-spacing: 0.5px;">
              Reply in Admin Panel
            </a>

            <p style="text-align: center; color: #9ca3af; font-size: 11px; margin-top: 20px;">AQ BEDS — Live Chat System</p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("Chat notification email failed", err);
  }
}
