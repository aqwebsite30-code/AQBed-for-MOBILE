import { createFileRoute } from "@tanstack/react-router";
import { buildWhatsAppUrl } from "@/lib/utils/format";
import { Mail, MessageCircle, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — AQ Beds" },
      { name: "description", content: "Get in touch with AQ Beds via email, phone, or WhatsApp." },
      { property: "og:title", content: "Contact — AQ Beds" },
      { property: "og:description", content: "Get in touch with AQ Beds via email, phone, or WhatsApp. We respond within a few hours." },
      { property: "og:image", content: "https://www.aqbeds.com/Home%20page%20images/1000152185-clean.webp" },
      { property: "og:url", content: "https://www.aqbeds.com/contact" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Contact — AQ Beds" },
      { name: "twitter:image", content: "https://www.aqbeds.com/Home%20page%20images/1000152185-clean.webp" },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 animate-fade-in">
      <h1 className="font-display font-bold text-4xl">Contact us</h1>
      <p className="mt-3 text-muted-foreground">We respond within a few hours, 7 days a week.</p>
      <div className="mt-10 grid sm:grid-cols-3 gap-4">
        <a
          href={buildWhatsAppUrl("Hello AQ Beds")}
          target="_blank"
          rel="noreferrer"
          className="p-6 rounded-3xl border border-border bg-card hover-lift"
        >
          <MessageCircle className="h-6 w-6 text-whatsapp" />
          <h2 className="font-display font-semibold mt-3">WhatsApp</h2>
          <p className="text-sm text-muted-foreground mt-1">Fastest response</p>
        </a>
        <a
          href="mailto:aqbeds2822@gmail.com"
          className="p-6 rounded-3xl border border-border bg-card hover-lift"
        >
          <Mail className="h-6 w-6 text-brand" />
          <h2 className="font-display font-semibold mt-3">Email</h2>
          <p className="text-sm text-muted-foreground mt-1">aqbeds2822@gmail.com</p>
        </a>
        <a
          href="tel:+447519791128"
          className="p-6 rounded-3xl border border-border bg-card hover-lift"
        >
          <Phone className="h-6 w-6 text-brand" />
          <h2 className="font-display font-semibold mt-3">Phone</h2>
          <p className="text-sm text-muted-foreground mt-1">+44 7519 791128</p>
        </a>
      </div>
    </div>
  );
}
