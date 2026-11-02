import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import heartRing from "@/assets/heart-ring.jpg";
import ornateRing from "@/assets/ornate-ring.jpg";
import squareRing from "@/assets/square-ring.jpg";
import bandRing from "@/assets/band-ring.jpg";
import rubyRing from "@/assets/ruby-ring.jpg";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
};

export const PRODUCTS = {
  coeur: {
    id: "coeur",
    name: "Rosé Cœur",
    price: 485000,
    image: heartRing,
    description:
      "A heart-cut pink stone held in four polished claws, flanked by pear-cut accents and a pavé-set shoulder.",
  },
  marquise: {
    id: "marquise",
    name: "Marquise Noble",
    price: 362000,
    image: ornateRing,
    description:
      "A pointed marquise stone framed by hand-pierced filigree scrolls — an heirloom silhouette, finely detailed.",
  },
  eternity: {
    id: "eternity",
    name: "Eternity",
    price: 298000,
    image: squareRing,
    description:
      "A substantial silver ring with a deep black square face and a single clear stone set at its centre. Engraved shoulders, weighty and precise.",
  },
  band: {
    id: "band",
    name: "Infinite Band",
    price: 215000,
    image: bandRing,
    description: "A continuous circle of round brilliant stones in a fine shared-claw setting.",
  },
  bordeaux: {
    id: "bordeaux",
    name: "Bordeaux Halo",
    price: 412000,
    image: rubyRing,
    description: "A deep red oval stone encircled by a halo of brilliants on a pavé band.",
  },
} satisfies Record<string, Product>;

export const getProduct = (id: string): Product | undefined =>
  (PRODUCTS as Record<string, Product>)[id];

export const SIZES = ["5", "6", "7", "8", "9", "10"];

export const formatNPR = (n: number) => `NPR ${n.toLocaleString("en-IN")}`;

export type BagItem = { id: string; size: string; qty: number };

type ShopCtx = {
  items: BagItem[];
  count: number;
  subtotal: number;
  add: (id: string, size: string, qty: number) => void;
  setQty: (id: string, size: string, qty: number) => void;
  remove: (id: string, size: string) => void;
  quickView: Product | null;
  openProduct: (id: string) => void;
  closeProduct: () => void;
  bagOpen: boolean;
  setBagOpen: (v: boolean) => void;
};

const Ctx = createContext<ShopCtx | null>(null);
const KEY = "auren-bag";

export function ShopProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BagItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [bagOpen, setBagOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems((JSON.parse(raw) as BagItem[]).filter((i) => getProduct(i.id)));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, loaded]);

  const add = (id: string, size: string, qty: number) =>
    setItems((prev) => {
      const ex = prev.find((i) => i.id === id && i.size === size);
      if (ex) return prev.map((i) => (i === ex ? { ...i, qty: Math.min(9, i.qty + qty) } : i));
      return [...prev, { id, size, qty }];
    });
  const setQty = (id: string, size: string, qty: number) =>
    setItems((prev) =>
      qty < 1
        ? prev.filter((i) => !(i.id === id && i.size === size))
        : prev.map((i) => (i.id === id && i.size === size ? { ...i, qty: Math.min(9, qty) } : i)),
    );
  const remove = (id: string, size: string) =>
    setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)));

  const count = items.reduce((a, i) => a + i.qty, 0);
  const subtotal = items.reduce((a, i) => a + i.qty * (getProduct(i.id)?.price ?? 0), 0);

  return (
    <Ctx.Provider
      value={{
        items,
        count,
        subtotal,
        add,
        setQty,
        remove,
        quickView,
        openProduct: (id) => setQuickView(getProduct(id) ?? null),
        closeProduct: () => setQuickView(null),
        bagOpen,
        setBagOpen,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useShop() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useShop outside ShopProvider");
  return c;
}
