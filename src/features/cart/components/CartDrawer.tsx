import { Link } from "@tanstack/react-router";
import { X, Trash2, Minus, Plus } from "lucide-react";
import { useCart, useUI } from "@/features/cart/store/cart";
import { formatGBP, buildWhatsAppUrl } from "@/lib/utils/format";

export function CartDrawer() {
  const open = useUI((s) => s.cartOpen);
  const setOpen = useUI((s) => s.setCartOpen);
  const { items, updateQty, remove, subtotal, total } = useCart();

  const waMessage = `Hello AQ Beds, I'd like to order:%0A%0A${items
    .map(
      (i) =>
        `• ${i.name} (${Object.values(i.options).join(", ")}) x${i.qty} - ${formatGBP(
          i.unitPrice * i.qty,
        )}`,
    )
    .join("%0A")}%0A%0ATotal: ${formatGBP(total())}`;

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      <div
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-black/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping basket"
        className={`absolute right-0 top-0 bottom-0 w-full sm:w-[440px] bg-background flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="font-display font-bold text-xl">Your Basket</h2>
          <button onClick={() => setOpen(false)} aria-label="Close cart" className="min-h-[44px] min-w-[44px] grid place-items-center">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Your basket is empty.</p>
              <Link
                to="/shop"
                onClick={() => setOpen(false)}
                className="inline-block mt-4 px-5 h-11 leading-[2.75rem] rounded-2xl bg-cta text-cta-foreground font-semibold text-sm"
              >
                Shop Beds
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((i) => (
                <li
                  key={i.lineId}
                  className="flex gap-4 p-3 rounded-2xl border border-border bg-card"
                >
                  <img src={i.image} alt={i.name} className="h-20 w-20 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-sm leading-tight">{i.name}</h3>
                      <button onClick={() => remove(i.lineId)} aria-label="Remove item" className="min-h-[44px] min-w-[44px] grid place-items-center">
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {Object.entries(i.options)
                        .map(([k, v]) => `${v}`)
                        .join(" · ")}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-xl border border-border">
                        <button
                          className="p-2.5"
                          onClick={() => updateQty(i.lineId, i.qty - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-2 text-sm tabular-nums">{i.qty}</span>
                        <button
                          className="p-2.5"
                          onClick={() => updateQty(i.lineId, i.qty + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="font-display font-bold">
                        {formatGBP(i.unitPrice * i.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-border px-6 py-5 space-y-3 bg-card">
            <div className="text-sm flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatGBP(subtotal())}</span>
            </div>
            <div className="text-sm flex justify-between text-muted-foreground">
              <span>Delivery</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between items-baseline pt-1">
              <span className="font-display font-bold text-lg">Total</span>
              <span className="font-display font-bold text-2xl text-brand">
                {formatGBP(total())}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                to="/checkout"
                onClick={() => setOpen(false)}
                className="h-12 rounded-2xl bg-cta text-cta-foreground font-semibold text-sm grid place-items-center hover:opacity-90 transition"
              >
                Checkout
              </Link>
              <a
                href={`https://wa.me/447519791128?text=${waMessage}`}
                target="_blank"
                rel="noreferrer"
                className="h-12 rounded-2xl bg-whatsapp text-whatsapp-foreground font-semibold text-sm grid place-items-center hover:opacity-90 transition"
              >
                Order on WhatsApp
              </a>
            </div>
          </footer>
        )}
      </aside>
    </div>
  );
}
