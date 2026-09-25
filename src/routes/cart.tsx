import { createFileRoute, Link } from "@tanstack/react-router";
import { useCart } from "@/features/cart/store/cart";
import { formatGBP, buildWhatsAppUrl } from "@/lib/utils/format";
import { Trash2, Minus, Plus, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Basket — AQ Beds" },
      { name: "description", content: "Review your AQ Beds basket before checkout. Cash on delivery available across the UK." },
      { property: "og:title", content: "Your Basket — AQ Beds" },
      { property: "og:description", content: "Review your AQ Beds basket before checkout." },
      { property: "og:image", content: "https://www.aqbeds.com/Home%20page%20images/1000152185-clean.webp" },
      { property: "og:url", content: "https://www.aqbeds.com/cart" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Your Basket — AQ Beds" },
      { name: "twitter:image", content: "https://www.aqbeds.com/Home%20page%20images/1000152185-clean.webp" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, updateQty, remove, subtotal, total } = useCart();

  const waMessage = `Hello AQ Beds, I want to order:%0A%0A${items
    .map((i) => `• ${i.name} x${i.qty} - ${formatGBP(i.unitPrice * i.qty)}`)
    .join("%0A")}%0A%0ATotal: ${formatGBP(total())}`;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display font-bold text-3xl">Your basket is empty</h1>
        <p className="text-muted-foreground mt-3">Browse our beds and find your perfect match.</p>
        <Link
          to="/shop"
          className="inline-block mt-6 h-12 px-7 leading-[3rem] rounded-2xl bg-cta text-cta-foreground font-semibold"
        >
          Shop Beds
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 animate-fade-in">
      <h1 className="font-display font-bold text-3xl sm:text-4xl">Your Basket</h1>
      <div className="grid lg:grid-cols-[1fr_380px] gap-8 mt-8">
        <ul className="space-y-4">
          {items.map((i) => (
            <li key={i.lineId} className="flex gap-4 p-4 rounded-3xl border border-border bg-card">
              <img
                src={i.image}
                alt={i.name}
                className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3 className="font-display font-semibold">{i.name}</h3>
                  <button onClick={() => remove(i.lineId)} aria-label="Remove">
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Object.entries(i.options)
                    .map(([, v]) => v)
                    .join(" · ")}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex items-center rounded-xl border border-border">
                    <button className="p-2" onClick={() => updateQty(i.lineId, i.qty - 1)}>
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-3 text-sm tabular-nums">{i.qty}</span>
                    <button className="p-2" onClick={() => updateQty(i.lineId, i.qty + 1)}>
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-display font-bold">{formatGBP(i.unitPrice * i.qty)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="rounded-3xl border border-border bg-card p-6 h-fit space-y-4">
          <h2 className="font-display font-bold text-xl">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatGBP(subtotal())}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery</span>
              <span>Free</span>
            </div>
          </div>
          <div className="flex justify-between items-baseline pt-3 border-t border-border">
            <span className="font-display font-bold text-lg">Total</span>
            <span className="font-display font-bold text-2xl text-brand">{formatGBP(total())}</span>
          </div>
          <Link
            to="/checkout"
            className="block h-12 rounded-2xl bg-cta text-cta-foreground font-semibold text-sm grid place-items-center"
          >
            Proceed to Checkout
          </Link>
          <a
            href={`https://wa.me/447519791128?text=${waMessage}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 h-12 rounded-2xl bg-whatsapp text-whatsapp-foreground font-semibold text-sm"
          >
            <MessageCircle className="h-4 w-4" /> Order via WhatsApp
          </a>
        </aside>
      </div>
    </div>
  );
}
