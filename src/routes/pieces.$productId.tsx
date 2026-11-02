import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { BagDrawer } from '@/components/auren/ShopPanels';
import { Toaster } from '@/components/ui/sonner';
import { PRODUCTS, getProduct, ShopProvider, useShop, SIZES, formatNPR } from '@/lib/shop';
import hand from '@/assets/try-on-hand.webp';

export const Route = createFileRoute('/pieces/$productId')({
  beforeLoad: ({params}) => { if(!getProduct(params.productId)) throw notFound(); },
  head: ({params}) => ({meta:[{title:`${getProduct(params.productId)?.name ?? 'Piece'} — AUREN`},{name:'description',content:getProduct(params.productId)?.description}]}),
  component: () => <ShopProvider><ProductPage/><BagDrawer/><Toaster position="bottom-center"/></ShopProvider>,
});

function ProductPage() {
  const {productId}=Route.useParams();
  const p=getProduct(productId)!;
  const {add,count,setBagOpen}=useShop();
  const [size,setSize]=useState('');
  const [quantity,setQuantity]=useState(1);
  const [onHand,setOnHand]=useState(false);
  const [finger,setFinger]=useState('Ring finger');
  const [position,setPosition]=useState(47);
  const [scale,setScale]=useState(16);
  const [notice,setNotice]=useState('');
  const [replay,setReplay]=useState(0);
  useEffect(() => {setSize('');setQuantity(1);setOnHand(false);setNotice('');setFinger('Ring finger');setPosition(47);setScale(16);}, [productId]);
  const related=Object.values(PRODUCTS).filter(x=>x.id!==p.id).slice(0,3);
  return <div className="piece-page" key={p.id}>
    <header className="piece-nav"><Link to="/" className="font-display">AUREN</Link><Link to="/" hash="collection">← The collection</Link><button onClick={()=>setBagOpen(true)}>Bag ({count})</button></header>
    <svg width="0" height="0" aria-hidden="true" style={{position:'absolute'}}><defs><filter id="jewel-cutout" colorInterpolationFilters="sRGB"><feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 8 8 8 0 -0.4" result="cutout"/><feComposite in="SourceGraphic" in2="cutout" operator="in"/></filter></defs></svg>
    <main>
      <div className="piece-breadcrumb"><Link to="/">Maison</Link><span>/</span><span>{p.name}</span></div>
      <section className="piece-layout">
        <div className="piece-visual"><p className="eyebrow">{onHand?'THE STYLING ROOM':'THE DETAILS, UP CLOSE'}</p>
          <div className={`tryon-stage ${onHand?'is-worn':''}`}>
            {onHand&&<img src={hand} alt="Unadorned hand used for an illustrative jewelry styling preview" className="tryon-hand"/>}
            <img key={`${p.id}-${replay}`} src={p.image} alt={onHand?`${p.name} positioned on the hand`:`${p.name} studio view`} className={`tryon-jewel ${onHand?'place-ring':''}`} style={onHand?{left: finger==='Middle finger'?'49%':finger==='Index finger'?'60%':'38%',top:`${position}%`,width:`${scale}%`}:undefined}/>
          </div>
          <div className="piece-view-switch"><button aria-pressed={!onHand} onClick={()=>setOnHand(false)}>Studio view</button><button aria-pressed={onHand} onClick={()=>{setOnHand(true);setReplay(n=>n+1);}}>Place on hand ↗</button></div>
          {onHand&&<div className="tryon-controls"><div className="finger-options">{['Ring finger','Middle finger','Index finger'].map(f=><button key={f} aria-pressed={finger===f} onClick={()=>setFinger(f)}>{f}</button>)}</div><label>Position <input type="range" min="36" max="65" value={position} onChange={e=>setPosition(+e.target.value)}/></label><label>Visual scale <input type="range" min="12" max="23" value={scale} onChange={e=>setScale(+e.target.value)}/></label><button className="eyebrow" onClick={()=>setReplay(n=>n+1)}>Replay placement ↻</button><p>Illustrative styling only. Image compositing does not predict fit, dimensions, or how a ring slides onto a finger.</p></div>}
        </div>
        <div className="piece-info"><p className="eyebrow">AUREN / THE SIGNATURE COLLECTION</p><h1>{p.name}</h1><p className="piece-price">{formatNPR(p.price)} <small>Demo price</small></p><p className="piece-description">{p.description}</p><div className="piece-divider"/>
          <fieldset><legend>Choose your size <span>US ring sizes</span></legend><div className="piece-sizes">{SIZES.map(s=><button key={s} aria-pressed={size===s} onClick={()=>{setSize(s);setNotice('');}}>{s}</button>)}</div></fieldset>
          <label className="piece-qty">Quantity <select value={quantity} onChange={e=>setQuantity(+e.target.value)}>{[1,2,3,4,5].map(n=><option key={n}>{n}</option>)}</select></label>
          <button className="piece-add" onClick={()=>{if(!size){setNotice('Choose a ring size to continue.');return;}add(p.id,size,quantity);setNotice(`${p.name} added to your bag.`);setBagOpen(true);}}>Add to bag <span>↗</span></button><p role="status" className="piece-notice">{notice}</p><p className="piece-demo">A curated storefront concept. No payments or orders are processed.</p>
          <details open><summary>The design</summary><p>{p.description} Explore the studio image for a closer look, or compose your own styling preview.</p></details><details><summary>Care & keeping</summary><p>Store jewellery separately in a soft pouch. Avoid knocks, abrasives, and harsh chemicals. Material-specific care depends on the final product specifications.</p></details><details><summary>About the styling room</summary><p>Choose a finger, adjust placement, and replay the animation. The preview is a creative image composition, not an AR fitting or a ring-size measurement.</p></details>
        </div>
      </section>
      <section className="piece-related"><p className="eyebrow">CONTINUE YOUR DISCOVERY</p><h2>A beautiful next chapter.</h2><div>{related.map(r=><Link key={r.id} to="/pieces/$productId" params={{productId:r.id}}><img src={r.image} alt={r.name} loading="lazy"/><h3>{r.name}</h3><p>{formatNPR(r.price)} · demo</p><span>Discover ↗</span></Link>)}</div></section>
    </main><footer className="piece-footer"><Link to="/">AUREN</Link><p>Objects of affection. Made for your extraordinary.</p><Link to="/" hash="collection">Return to collection ↗</Link></footer>
  </div>;
}
