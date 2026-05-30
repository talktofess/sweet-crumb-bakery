"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PRODUCTS, getProduct, type Product } from "@/lib/products";

export interface CartLine {
  id: string;
  qty: number;
}

interface CartContextValue {
  lines: CartLine[];
  detailed: { product: Product; qty: number }[];
  count: number;
  subtotal: number; // cents
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const STORAGE_KEY = "sweet-crumb-cart";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load once on mount (client only).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: CartLine[] = JSON.parse(raw);
        // drop anything no longer in the catalog
        setLines(parsed.filter((l) => getProduct(l.id) && l.qty > 0));
      }
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  // Persist on change (after hydration so we don't clobber stored state).
  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const add = useCallback((id: string, qty = 1) => {
    if (!getProduct(id)) return;
    setLines((prev) => {
      const found = prev.find((l) => l.id === id);
      if (found) {
        return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l));
      }
      return [...prev, { id, qty }];
    });
    setOpen(true);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, qty } : l))
    );
  }, []);

  const remove = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const detailed = useMemo(
    () =>
      lines
        .map((l) => {
          const product = getProduct(l.id);
          return product ? { product, qty: l.qty } : null;
        })
        .filter((x): x is { product: Product; qty: number } => x !== null),
    [lines]
  );

  const count = useMemo(() => lines.reduce((n, l) => n + l.qty, 0), [lines]);
  const subtotal = useMemo(
    () => detailed.reduce((sum, d) => sum + d.product.price * d.qty, 0),
    [detailed]
  );

  const value: CartContextValue = {
    lines,
    detailed,
    count,
    subtotal,
    add,
    setQty,
    remove,
    clear,
    open,
    setOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

// re-export so client components can map the catalog without a server import
export { PRODUCTS };
