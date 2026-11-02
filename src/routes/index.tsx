import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type RefObject } from "react";
import { ShoppingBag } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { BagDrawer, ProductDialog } from "@/components/auren/ShopPanels";
import { PRODUCTS, ShopProvider, formatNPR, useShop } from "@/lib/shop";
import heartRing from "@/assets/heart-ring.jpg";
import ringBox from "@/assets/ring-box.jpg";
import handRing from "@/assets/hand-ring.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AUREN — Fine Jewellery" },
      { name: "description", content: "Rare by nature. An editorial fine jewellery storefront concept by AUREN." },
      { property: "og:title", content: "AUREN — Fine Jewellery" },
      { property: "og:description", content: "Rare by nature. An editorial fine jewellery storefront concept by AUREN." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <ShopProvider>
      <Page />
      <ProductDialog />
      <BagDrawer />
      <Toaster position="bottom-center" />
    </ShopProvider>
  ),
});

/** 0 when the element's top hits viewport bottom, 1 when its bottom leaves viewport top. */
function useProgress(ref: RefObject<HTMLElement | null>) {
  const [p, setP] = useState(0.5);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      setP(Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ref]);
  return p;
}

const motionScale = () => (typeof window !== "undefined" && window.innerWidth < 768 ? 0.4 : 1);

function Header() {
  const { count, setBagOpen } = useShop();
  return (
    <header className="absolute inset-x-0 top-0 z-30 text-paper">
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-6 md:px-10" aria-label="Main">
        <a href="#top" className="font-display text-lg tracking-[0.3em]">AUREN</a>
        <ul className="hidden gap-10 md:flex">
          <li><a className="eyebrow link-line" href="#collection">Collection</a></li>
          <li><a className="eyebrow link-line" href="#story">Our Story</a></li>
          <li><a className="eyebrow link-line" href="#contact">Contact</a></li>
        </ul>
        <button type="button" onClick={() => setBagOpen(true)} className="eyebrow flex items-center gap-2" aria-label={`Open bag, ${count} items`}>
          <ShoppingBag className="h-4 w-4" strokeWidth={1.25} />
          <span className="tabular-nums">({count})</span>
        </button>
      </nav>
      <ul className="flex justify-center gap-6 pb-2 md:hidden">
        <li><a className="eyebrow" href="#collection">Collection</a></li>
        <li><a className="eyebrow" href="#story">Our Story</a></li>
        <li><a className="eyebrow" href="#contact">Contact</a></li>
      </ul>
    </header>
  );
}

function Opening() {
  const ref = useRef<HTMLElement>(null);
  const p = useProgress(ref);
  const m = motionScale();
  const shift = (p - 0.5) * 2; // -1..1
  return (
    <section ref={ref} id="top" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-ink text-paper">
      <div className="glow-pink pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2" />
      <div className="animate-rise relative w-[min(78vw,640px)]" style={{ transform: `translateY(${shift * 60 * m}px) scale(${1 + shift * 0.06 * m})` }}>
        <img
          src={heartRing}
          alt="Silver ring set with a heart-shaped pink stone"
          width={1024}
          height={1024}
          fetchPriority="high"
          className="aspect-square w-full object-cover [mask-image:radial-gradient(closest-side,black_70%,transparent)]"
        />
      </div>
      <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-4 px-5 text-center md:bottom-14">
        <h1 className="animate-rise font-display text-4xl italic md:text-6xl" style={{ animationDelay: ".3s" }}>Rare by nature.</h1>
        <a href="#collection" className="eyebrow link-line text-paper/80">Explore the collection</a>
      </div>
    </section>
  );
}

function Editorial() {
  const ref = useRef<HTMLElement>(null);
  const p = useProgress(ref);
  const m = motionScale();
  return (
    <section ref={ref} id="story" className="overflow-hidden bg-paper text-ink">
      <div className="mx-auto grid max-w-[1600px] items-center gap-12 px-5 py-24 md:grid-cols-12 md:px-10 md:py-40">
        <div className="relative z-10 md:col-span-7">
          <p className="eyebrow mb-8 text-muted-foreground">AUREN — Fine Jewellery</p>
          <h2 className="font-display text-[clamp(2.5rem,7vw,7.5rem)] font-normal uppercase leading-[0.92] tracking-tight">
            Extraordinary<br />Jewellery.<br /><em className="font-normal">For you.</em>
          </h2>
          <p className="mt-10 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Each piece begins with a single stone, chosen for its light — then set by hand so nothing stands between it and you.
          </p>
          <a href="#collection" className="eyebrow link-line mt-8 inline-block">Discover the collection</a>
        </div>
        <div className="md:col-span-5 md:mt-48">
          <img
            src={ringBox}
            alt="Open burgundy velvet box holding the pink heart ring"
            width={1024}
            height={1024}
            loading="lazy"
            className="w-full"
            style={{ transform: `translateY(${(0.5 - p) * 80 * m}px)` }}
          />
        </div>
      </div>
    </section>
  );
}

function Collection() {
  const { openProduct } = useShop();
  const ref = useRef<HTMLDivElement>(null);
  const p = useProgress(ref);
  const m = motionScale();
  const pair = [PRODUCTS.marquise, PRODUCTS.eternity];
  return (
    <section id="collection" className="overflow-hidden bg-ink text-paper">
      <div className="mx-auto max-w-[1600px] px-5 pt-24 md:px-10 md:pt-36">
        <div className="mb-14 flex items-end justify-between">
          <h2 className="font-display text-5xl font-normal md:text-7xl">The Collection</h2>
          <p className="eyebrow hidden text-paper/60 md:block">Vol. I</p>
        </div>
        <div className="grid gap-16 md:grid-cols-2 md:gap-10">
          {pair.map((prod, i) => (
            <article key={prod.id} className={i === 1 ? "md:mt-32" : ""}>
              <button type="button" onClick={() => openProduct(prod.id)} className="group block w-full overflow-hidden" aria-label={`View ${prod.name}`}>
                <img src={prod.image} alt={prod.name} width={1024} height={1024} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
              </button>
              <div className="mt-6 flex items-baseline justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl">{prod.name}</h3>
                  <p className="mt-1 text-xs text-paper/60">{formatNPR(prod.price)} · demo</p>
                </div>
                <button type="button" onClick={() => openProduct(prod.id)} className="eyebrow link-line">View piece</button>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div ref={ref} className="flex min-h-[90svh] items-center justify-center py-24">
        <img
          src={PRODUCTS.eternity.image}
          alt="Close-up of the square-faced Eternity ring"
          width={1024}
          height={1024}
          loading="lazy"
          className="w-[min(86vw,760px)] [mask-image:radial-gradient(closest-side,black_75%,transparent)]"
          style={{ transform: `scale(${0.85 + Math.min(p, 0.6) * 0.35 * m + (1 - m) * 0.15})` }}
        />
      </div>
    </section>
  );
}

function EternityFeature() {
  const { openProduct } = useShop();
  const e = PRODUCTS.eternity;
  return (
    <section className="bg-paper text-ink">
      <div className="mx-auto grid max-w-[1600px] items-center gap-12 px-5 py-24 md:grid-cols-12 md:px-10 md:py-36">
        <div className="order-2 md:order-1 md:col-span-5 md:pr-10">
          <p className="eyebrow text-muted-foreground">Signature piece</p>
          <h2 className="mt-4 font-display text-6xl font-normal italic md:text-8xl">Eternity</h2>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
            Cut from a single block of silver, its square face is polished to a deep black so the central stone appears to float. The shoulders are engraved by hand and finished slowly.
          </p>
          <p className="mt-8 text-sm">{formatNPR(e.price)} <span className="text-muted-foreground">· demo price</span></p>
          <button type="button" onClick={() => openProduct(e.id)} className="eyebrow mt-8 bg-champagne px-8 py-4 text-champagne-foreground transition-colors hover:bg-ink hover:text-paper">
            View piece
          </button>
        </div>
        <div className="order-1 md:order-2 md:col-span-6 md:col-start-7">
          <img src={handRing} alt="Hand wearing the Eternity ring" width={896} height={1152} loading="lazy" className="w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

function Shop() {
  const { openProduct } = useShop();
  const list = [PRODUCTS.coeur, PRODUCTS.bordeaux, PRODUCTS.band, PRODUCTS.marquise];
  return (
    <section className="bg-paper pb-24 text-ink md:pb-36" aria-labelledby="shop-title">
      <div className="mx-auto max-w-[1600px] border-t border-border px-5 pt-20 md:px-10">
        <h2 id="shop-title" className="font-display text-4xl font-normal md:text-5xl">Curated pieces</h2>
        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-8">
          {list.map((p) => (
            <li key={p.id}>
              <button type="button" onClick={() => openProduct(p.id)} className="group block w-full overflow-hidden bg-ink" aria-label={`Quick view ${p.name}`}>
                <img src={p.image} alt={p.name} width={1024} height={1024} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </button>
              <h3 className="mt-4 font-display text-xl">{p.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{formatNPR(p.price)} · demo</p>
              <button type="button" onClick={() => openProduct(p.id)} className="eyebrow link-line mt-3">Quick view</button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="bg-ink text-paper">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-10 px-5 py-16 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <p className="font-display text-5xl tracking-[0.2em] md:text-7xl">AUREN</p>
          <p className="mt-4 text-xs text-paper/60">A jewelry storefront concept by AUREN.</p>
        </div>
        <ul className="flex gap-8">
          <li><a className="eyebrow link-line" href="#collection">Collection</a></li>
          <li><a className="eyebrow link-line" href="#story">Our Story</a></li>
          <li><a className="eyebrow link-line" href="#top">Back to top</a></li>
        </ul>
      </div>
    </footer>
  );
}

function Page() {
  return (
    <>
      <Header />
      <main>
        <Opening />
        <Editorial />
        <Collection />
        <EternityFeature />
        <Shop />
      </main>
      <Footer />
    </>
  );
}
