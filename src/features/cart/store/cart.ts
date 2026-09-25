import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  lineId: string;
  productId: string;
  name: string;
  image: string;
  unitPrice: number;
  qty: number;
  options: Record<string, string>;
}

interface CartState {
  items: CartLine[];
  add: (line: Omit<CartLine, "lineId">) => void;
  updateQty: (lineId: string, qty: number) => void;
  remove: (lineId: string) => void;
  clear: () => void;
  subtotal: () => number;
  total: () => number;
  count: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (line) => {
        const lineId = `${line.productId}-${JSON.stringify(line.options)}`;
        set((s) => {
          const existing = s.items.find((i) => i.lineId === lineId);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.lineId === lineId ? { ...i, qty: i.qty + line.qty } : i,
              ),
            };
          }
          return { items: [...s.items, { ...line, lineId }] };
        });
      },
      updateQty: (lineId, qty) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.lineId === lineId ? { ...i, qty: Math.max(1, qty) } : i))
            .filter((i) => i.qty > 0),
        })),
      remove: (lineId) => set((s) => ({ items: s.items.filter((i) => i.lineId !== lineId) })),
      clear: () => set({ items: [] }),
      subtotal: () => get().items.reduce((s, i) => s + i.unitPrice * i.qty, 0),
      total: () => get().subtotal(),
      count: () => get().items.reduce((s, i) => s + i.qty, 0),
    }),
    { name: "aq-beds-cart" },
  ),
);

interface UIState {
  cartOpen: boolean;
  menuOpen: boolean;
  setCartOpen: (v: boolean) => void;
  setMenuOpen: (v: boolean) => void;
}

export const useUI = create<UIState>((set) => ({
  cartOpen: false,
  menuOpen: false,
  setCartOpen: (cartOpen) => set({ cartOpen }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
}));

interface WishlistState {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id] })),
      has: (id) => get().ids.includes(id),
    }),
    { name: "aq-beds-wishlist" },
  ),
);
