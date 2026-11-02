import { useEffect, useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { getProduct, SIZES, formatNPR, useShop } from "@/lib/shop";
import { toast } from "sonner";

function Qty({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  return (
    <div className="inline-flex items-center border border-border" role="group" aria-label={label}>
      <button type="button" className="p-2 hover:bg-muted" onClick={() => onChange(value - 1)} aria-label="Decrease quantity">
        <Minus className="h-3 w-3" />
      </button>
      <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">{value}</span>
      <button type="button" className="p-2 hover:bg-muted" onClick={() => onChange(value + 1)} aria-label="Increase quantity">
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}

export function ProductDialog() {
  const { quickView: p, closeProduct, add, setBagOpen } = useShop();
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState(false);

  useEffect(() => {
    setSize(null);
    setQty(1);
    setErr(false);
  }, [p?.id]);

  return (
    <Dialog open={!!p} onOpenChange={(o) => !o && closeProduct()}>
      <DialogContent className="max-h-[92vh] max-w-4xl gap-0 overflow-y-auto border-0 bg-paper p-0 sm:rounded-none">
        {p && (
          <div className="grid md:grid-cols-2">
            <div className="bg-ink">
              <img src={p.image} alt={p.name} width={1024} height={1024} className="aspect-square w-full object-cover" />
            </div>
            <div className="flex flex-col p-6 md:p-10">
              <p className="eyebrow text-muted-foreground">AUREN — Fine Jewellery</p>
              <DialogTitle className="mt-3 font-display text-4xl font-normal">{p.name}</DialogTitle>
              <p className="mt-2 text-sm">
                {formatNPR(p.price)} <span className="text-muted-foreground">· demo price</span>
              </p>
              <DialogDescription className="mt-5 text-sm leading-relaxed text-muted-foreground">
                {p.description}
              </DialogDescription>

              <fieldset className="mt-8">
                <legend className="eyebrow mb-3">Ring size</legend>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={size === s}
                      onClick={() => {
                        setSize(s);
                        setErr(false);
                      }}
                      className={`h-10 w-10 border text-sm transition-colors ${
                        size === s ? "border-ink bg-ink text-paper" : "border-border hover:border-ink"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {err && <p className="mt-2 text-xs text-destructive" role="alert">Please choose a ring size.</p>}
              </fieldset>

              <div className="mt-6">
                <p className="eyebrow mb-3">Quantity</p>
                <Qty value={qty} onChange={(n) => setQty(Math.max(1, Math.min(9, n)))} label="Quantity" />
              </div>

              <button
                type="button"
                className="eyebrow mt-8 bg-ink px-6 py-4 text-paper transition-colors hover:bg-burgundy"
                onClick={() => {
                  if (!size) return setErr(true);
                  add(p.id, size, qty);
                  closeProduct();
                  toast(`${p.name} added to bag`, { action: { label: "View bag", onClick: () => setBagOpen(true) } });
                }}
              >
                Add to Bag
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function BagDrawer() {
  const { items, subtotal, setQty, remove, bagOpen, setBagOpen } = useShop();
  return (
    <Sheet open={bagOpen} onOpenChange={setBagOpen}>
      <SheetContent className="flex w-full flex-col border-l-0 bg-paper p-0 sm:max-w-md">
        <div className="border-b border-border p-6">
          <SheetTitle className="font-display text-3xl font-normal">Your Bag</SheetTitle>
          <SheetDescription className="eyebrow mt-1 text-muted-foreground">Demo storefront</SheetDescription>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Your bag is empty.</p>
          ) : (
            <ul className="space-y-6">
              {items.map((i) => {
                const p = getProduct(i.id);
                if (!p) return null;
                return (
                  <li key={i.id + i.size} className="flex gap-4">
                    <img src={p.image} alt="" width={88} height={88} loading="lazy" className="h-22 w-22 bg-ink object-cover" />
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <p className="font-display text-lg">{p.name}</p>
                        <button type="button" onClick={() => remove(i.id, i.size)} aria-label={`Remove ${p.name}`} className="text-muted-foreground hover:text-foreground">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">Size {i.size}</p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <Qty value={i.qty} onChange={(n) => setQty(i.id, i.size, n)} label={`Quantity of ${p.name}`} />
                        <p className="text-sm tabular-nums">{formatNPR(p.price * i.qty)}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="border-t border-border p-6">
          <div className="flex justify-between text-sm">
            <span className="eyebrow">Subtotal</span>
            <span className="tabular-nums">{formatNPR(subtotal)}</span>
          </div>
          <button
            type="button"
            disabled={!items.length}
            onClick={async () => {
              const details = `AUREN — selection inquiry\n${items.map(i => `${getProduct(i.id)?.name} · US size ${i.size} · quantity ${i.qty}`).join('\n')}\nDemo reference total: ${formatNPR(subtotal)}\nPlease confirm final specifications, availability and pricing.`;
              try { await navigator.clipboard.writeText(details); toast("Selection copied. Paste it into your preferred messaging app."); }
              catch { toast("Copy is unavailable in this browser. Your selection remains in the bag."); }
            }}
            className="eyebrow mt-5 w-full bg-ink px-6 py-4 text-paper transition-colors hover:bg-burgundy disabled:opacity-40"
          >
            Copy selection inquiry ↗
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Inquiry draft only. Nothing is sent and no payment is collected.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
