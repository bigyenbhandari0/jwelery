import { RingExplorer } from "@/components/auren/RingExplorer";
import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { BagDrawer } from '@/components/auren/ShopPanels';
import { Toaster } from '@/components/ui/sonner';
import { PRODUCTS, getProduct, ShopProvider, useShop, SIZES, formatNPR } from '@/lib/shop';

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
  const [notice,setNotice]=useState('');
  useEffect(() => {setSize('');setQuantity(1);setOnHand(false);setNotice('');}, [productId]);
  const related=Object.values(PRODUCTS).filter(x=>x.id!==p.id).slice(0,3);
  return <div className="piece-page" key={p.id}>
    <header className="piece-nav"><Link to="/" className="font-display">AUREN</Link><Link to="/" hash="collection">← The collection</Link><button onClick={()=>setBagOpen(true)}>Bag ({count})</button></header>
    <main>
      <div className="piece-breadcrumb"><Link to="/">Maison</Link><span>/</span><span>{p.name}</span></div>
      <section className="piece-layout">
        <div className="piece-visual"><p className="eyebrow">{onHand?'THE STYLING ROOM':'THE DETAILS, UP CLOSE'}</p>
          <div className={`tryon-stage ${onHand?'is-worn actual-3d-hand':''}`}>
            {onHand?<RingExplorer key={p.id} productId={p.id} tryOn onClose={()=>setOnHand(false)}/>:<img src={p.image} alt={`${p.name} studio view`} className="tryon-jewel"/>}
          </div>
          <div className="piece-view-switch"><button aria-pressed={!onHand} onClick={()=>setOnHand(false)}>Studio view</button><button aria-pressed={onHand} onClick={()=>setOnHand(true)}>3D hand preview ↗</button></div>
          <p className="styling-note">Rotate the hand, choose a finger, and replay placement in 3D. This is an illustrative model, not a sizing or fit measurement.</p>
        </div>
        <div className="piece-info"><p className="eyebrow">AUREN / THE SIGNATURE COLLECTION</p><h1>{p.name}</h1><p className="piece-price">{formatNPR(p.price)} <small>Demo price</small></p><p className="piece-description">{p.description}</p><div className="piece-divider"/>
          <fieldset><legend>Choose your size <span>US ring sizes</span></legend><div className="piece-sizes">{SIZES.map(s=><button key={s} aria-pressed={size===s} onClick={()=>{setSize(s);setNotice('');}}>{s}</button>)}</div></fieldset>
          <label className="piece-qty">Quantity <select value={quantity} onChange={e=>setQuantity(+e.target.value)}>{[1,2,3,4,5].map(n=><option key={n}>{n}</option>)}</select></label>
          <button className="piece-add" onClick={()=>{if(!size){setNotice('Choose a ring size to continue.');return;}add(p.id,size,quantity);setNotice(`${p.name} added to your bag.`);setBagOpen(true);}}>Add to bag <span>↗</span></button><p role="status" className="piece-notice">{notice}</p><p className="piece-demo">A curated storefront concept. No payments or orders are processed.</p>
          <details open><summary>The design</summary><p>{p.description} Explore the studio image for a closer look, or compose your own styling preview.</p></details><details><summary>Care & keeping</summary><p>Store jewellery separately in a soft pouch. Avoid knocks, abrasives, and harsh chemicals. Material-specific care depends on the final product specifications.</p></details><details><summary>About the styling room</summary><p>Choose a finger and replay the 3D placement. The hand and ring rotate together. The reconstructed model is illustrative, not an AR fitting or a ring-size measurement.</p></details>
        </div>
      </section>
      <section className="piece-related"><p className="eyebrow">CONTINUE YOUR DISCOVERY</p><h2>A beautiful next chapter.</h2><div>{related.map(r=><Link key={r.id} to="/pieces/$productId" params={{productId:r.id}}><img src={r.image} alt={r.name} loading="lazy"/><h3>{r.name}</h3><p>{formatNPR(r.price)} · demo</p><span>Discover ↗</span></Link>)}</div></section>
    </main><footer className="piece-footer"><Link to="/">AUREN</Link><p>Objects of affection. Made for your extraordinary.</p><Link to="/" hash="collection">Return to collection ↗</Link></footer>
  </div>;
}
