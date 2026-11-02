import { BrandIntro } from "@/components/auren/BrandIntro";
import { CinematicScene } from "@/components/auren/CinematicScene";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type RefObject } from "react";
import { ShoppingBag } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { BagDrawer, ProductDialog } from "@/components/auren/ShopPanels";
import { PRODUCTS, ShopProvider, formatNPR, useShop } from "@/lib/shop";
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
  const [motion, setMotion] = useState(0);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setMotion(preference.matches ? 0 : window.innerWidth < 768 ? 0.4 : 1);
    updateMotion();
    preference.addEventListener("change", updateMotion);
    window.addEventListener("resize", updateMotion);
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
      preference.removeEventListener("change", updateMotion);
      window.removeEventListener("resize", updateMotion);
    };
  }, [ref]);
  return { p, m: motion };
}


function Header() {
  const { count, setBagOpen } = useShop();
  return (
    <header className="fixed inset-x-0 top-0 z-30 text-paper maison-header">
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

function Editorial() {
  const ref = useRef<HTMLElement>(null);
  const { p, m } = useProgress(ref);
  return (
    <section ref={ref} id="story" className="overflow-hidden bg-paper text-ink">
      <div className="mx-auto grid max-w-[1600px] items-center gap-12 px-5 py-24 md:grid-cols-12 md:px-10 md:py-40">
        <div className="relative z-10 md:col-span-7 scene-reveal">
          <p className="eyebrow mb-8 text-muted-foreground">01 / THE ART OF GIVING</p>
          <h2 className="font-display text-[clamp(2.25rem,6vw,6.75rem)] font-normal uppercase leading-[0.92] tracking-tight">
            A little rarer.<br /><em className="font-normal">A little more you.</em>
          </h2>
          <p className="mt-10 max-w-sm text-sm leading-relaxed text-muted-foreground">
            A study in light, form, and the pieces we hold close. Discover expressive stones and sculptural silhouettes, imagined for your everyday and your extraordinary.
          </p>
          <a href="#collection" className="eyebrow link-line mt-8 inline-block">Discover the collection</a>
        </div>
        <div className="md:col-span-5 scene-reveal">
          <img
            src={ringBox}
            alt="Open burgundy velvet box holding the pink heart ring"
            width={1024}
            height={1024}
            loading="lazy"
            className="w-full"
            style={{ transform: `translateY(${(0.5 - p) * 240 * m}px) rotate(${(0.5 - p) * -12 * m}deg) scale(${1 + (p - 0.5) * 0.2 * m})` }}
          />
        </div>
      </div>
    </section>
  );
}

function Collection() {
  const openProduct = (id: string) => { window.location.assign(`/pieces/${id}`); };
  const pair = [PRODUCTS.marquise, PRODUCTS.eternity];
  return (
    <section id="collection" className="overflow-hidden bg-ink text-paper">
      <div className="mx-auto max-w-[1600px] px-5 pt-24 md:px-10 md:pt-36">
        <div className="mb-14 flex items-end justify-between">
          <h2 className="font-display text-5xl font-normal md:text-7xl">Objects of affection</h2>
          <p className="eyebrow hidden text-paper/60 md:block">THE PRIVATE EDIT / VOL. I</p>
        </div>
        <div className="collection-gallery grid gap-12 md:grid-cols-2 md:gap-12">
          {pair.map((prod, i) => (
            <article key={prod.id} className="scene-reveal collection-piece">
              <button type="button" onClick={() => openProduct(prod.id)} className="collection-image group block w-full overflow-hidden" aria-label={`View ${prod.name}`}>
                <img src={prod.image} alt={prod.name} width={1024} height={1024} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
              </button>
              <div className="mt-6 flex items-baseline justify-between gap-4">
                <div>
                  <p className="eyebrow mb-2 text-paper/40">0{i + 1} / THE SIGNATURES</p><h3 className="font-display text-2xl">{prod.name}</h3>
                  <p className="mt-1 text-xs text-paper/60">{formatNPR(prod.price)} · demo</p>
                </div>
                <button type="button" onClick={() => openProduct(prod.id)} className="eyebrow link-line">View piece</button>
              </div>
            </article>
          ))}
        </div>
      </div>

    </section>
  );
}

function EternityFeature() {
  const openProduct = (id: string) => { window.location.assign(`/pieces/${id}`); };
  const e = PRODUCTS.eternity;
  return (
    <section className="eternity-section bg-paper text-ink">
      <div className="mx-auto grid max-w-[1600px] items-center gap-12 px-5 py-24 md:grid-cols-12 md:px-10 md:py-36">
        <div className="scene-reveal order-2 md:order-1 md:col-span-5 md:pr-10">
          <p className="eyebrow text-muted-foreground">THE ETERNITY EDIT</p>
          <h2 className="mt-4 font-display text-6xl font-normal italic md:text-8xl">Eternity</h2>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
            A bold square silhouette. A luminous central stone. Eternity brings sculptural presence to a simple gesture — a signature piece designed to hold your attention.
          </p>
          <p className="mt-8 text-sm">{formatNPR(e.price)} <span className="text-muted-foreground">· demo price</span></p>
          <button type="button" onClick={() => openProduct(e.id)} className="eyebrow mt-8 bg-champagne px-8 py-4 text-champagne-foreground transition-colors hover:bg-ink hover:text-paper">
            View piece
          </button>
        </div>
        <div className="scene-reveal hand-reveal order-1 md:order-2 md:col-span-6 md:col-start-7">
          <img src={handRing} alt="Hand wearing the Eternity ring" width={896} height={1152} loading="lazy" className="w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

function Shop() {
  const openProduct = (id: string) => { window.location.assign(`/pieces/${id}`); };
  const [filter, setFilter] = useState('All pieces');
  const catalogue = [PRODUCTS.coeur, PRODUCTS.bordeaux, PRODUCTS.band, PRODUCTS.marquise, PRODUCTS.eternity];
  const list = catalogue.filter(p => filter === 'All pieces' || (filter === 'Colour stories' ? ['coeur','bordeaux'].includes(p.id) : filter === 'Statement rings' ? ['marquise','eternity'].includes(p.id) : p.id === 'band'));

  return (
    <section className="bg-paper pb-24 text-ink md:pb-36" aria-labelledby="shop-title">
      <div className="mx-auto max-w-[1600px] border-t border-border px-5 pt-20 md:px-10">
        <div className="shop-heading"><div><p className="eyebrow mb-5 text-muted-foreground">YOUR NEXT SIGNATURE</p><h2 id="shop-title" className="font-display text-4xl font-normal md:text-5xl">Find your forever</h2></div><p>Discover the piece that feels like you.<br/>Explore colour, character, and quiet brilliance.</p></div>
        <div className="collection-filters" aria-label="Filter jewelry">{['All pieces','Colour stories','Statement rings','Everyday brilliance'].map(label=><button key={label} type="button" aria-pressed={filter===label} onClick={()=>setFilter(label)}>{label}</button>)}</div>
        <p className="eyebrow result-count" role="status">{list.length} {list.length===1?'piece':'pieces'} to discover</p>
        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-8">
          {list.map((p) => (
            <li key={p.id} className="shop-product">
              <button type="button" onClick={() => openProduct(p.id)} className="group block w-full overflow-hidden bg-ink" aria-label={`Quick view ${p.name}`}>
                <img src={p.image} alt={p.name} width={1024} height={1024} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </button>
              <h3 className="mt-4 font-display text-xl">{p.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{formatNPR(p.price)} · demo</p>
              <p className="product-character">{p.id === "band" ? "Quiet brilliance, every day" : p.id === "coeur" || p.id === "bordeaux" ? "A vivid expression of you" : "A silhouette to remember"}</p><button type="button" onClick={() => openProduct(p.id)} className="eyebrow link-line mt-3">Discover piece ↗</button>
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
          <p className="mt-4 text-xs text-paper/60">Fine jewellery. Extraordinary possibilities.</p>
          <p className="mt-2 text-xs text-paper/40">Concept imagery and illustrative prices. No orders are processed.</p>
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
  useEffect(() => {
    const elements = document.querySelectorAll(".scene-reveal");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elements.forEach((el) => { el.classList.add("reveal-ready"); observer.observe(el); });
    return () => { observer.disconnect(); elements.forEach((el) => el.classList.remove("reveal-ready")); };
  }, []);
  return (
    <>
      <BrandIntro />
      <Header />
      <a href="#main-content" className="skip-link">Skip to content</a>
      <main id="main-content">
        <CinematicScene />
        <div className="maison-ribbon" aria-label="AUREN: A study in light, made for your extraordinary">
          <div aria-hidden="true">{Array.from({length:4},(_,i)=><span key={i}>A STUDY IN LIGHT <i>✧</i> OBJECTS OF AFFECTION <i>✧</i> YOUR EXTRAORDINARY <i>✧</i></span>)}</div>
        </div>
        <Editorial />
        <Collection />
        <EternityFeature />
        <section className="maison-manifesto scene-reveal" aria-label="The AUREN philosophy"><p className="eyebrow">THE AUREN POINT OF VIEW</p><h2>Less ordinary.<br/><em>More meaningful.</em></h2><p>A glint of light. A feeling you keep.<br/>Pieces that become part of your story.</p><a className="eyebrow link-line" href="#collection">Explore your next chapter ↗</a><span className="manifesto-seal" aria-hidden="true">A</span></section>
        <Shop />
      </main>
      <Footer />
    </>
  );
}
