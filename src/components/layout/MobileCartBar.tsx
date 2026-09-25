import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useCart, useUI } from "@/features/cart/store/cart";
import { formatGBP } from "@/lib/utils/format";

export function MobileCartBar() {
  const count = useCart((s) => s.count());
  const total = useCart((s) => s.total());
  const setCartOpen = useUI((s) => s.setCartOpen);

  if (count === 0) return null;
  return (
    <div className="fixed bottom-0 inset-x-0 z-30 sm:hidden bg-card/98 border-t border-border px-4 pt-3 pb-4 flex items-center justify-between shadow-2xl">
      <div>
        <div className="text-xs text-muted-foreground font-medium">
          {count} item{count > 1 ? "s" : ""} in basket
        </div>
        <div className="font-display font-bold text-lg text-brand">{formatGBP(total)}</div>
      </div>
      <button
        onClick={() => setCartOpen(true)}
        className="inline-flex items-center gap-2 px-5 h-11 rounded-2xl bg-brand text-brand-foreground font-bold text-sm shadow-lg active:scale-95 transition-all"
        aria-label={`View basket (${count} item${count > 1 ? "s" : ""})`}
      >
        <ShoppingBag className="h-4 w-4" /> View Basket
      </button>
    </div>
  );
}
