import presentation from '@/assets/auren-presentation.webp';
import { useEffect, useRef } from 'react';
import { PRODUCTS } from '@/lib/shop';

/** Scroll choreography uses the actual product photograph, without pretending it is a 3D model. */
export function MaisonOpening({onView,onReplay}:{onView:()=>void;onReplay:()=>void}) {
 const section=useRef<HTMLElement>(null);
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)');let frame=0;
  const update=()=>{frame=0;const el=section.current;if(!el)return;const rect=el.getBoundingClientRect();const distance=Math.max(1,el.offsetHeight-innerHeight);el.style.setProperty('--journey',String(media.matches?1:Math.max(0,Math.min(1,-rect.top/distance))));};
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};update();addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);media.addEventListener('change',schedule);
  return()=>{removeEventListener('scroll',schedule);removeEventListener('resize',schedule);media.removeEventListener('change',schedule);cancelAnimationFrame(frame);};
 },[]);
 return <section id="top" className="maison-opening" ref={section} aria-label="The AUREN signature collection"><div className="maison-stage">
  <span className="maison-watermark" aria-hidden="true">AUREN</span>
  <div className="maison-opening-copy"><p className="eyebrow">THE PRIVATE COLLECTION / VOL. I</p><h1>The Art of<br/>Being <em>Remembered.</em></h1><p>Exceptional pieces. Intimate stories.<br/>Timeless expressions.</p><a className="button button-dark" href="#collection">Explore the Collection <span>↗</span></a></div>
  <div className="maison-object"><img className="presentation-photo" src={presentation} alt="Editorial rendering of Rosé Cœur in an ivory AUREN presentation box" width="1000" height="1000" decoding="async"/><button className="maison-ring" onClick={onView} aria-label="Discover Rosé Cœur in the private showroom"><img src={PRODUCTS.coeur.image} alt="Rosé Cœur pink heart-shaped ring" width="960" height="960" fetchPriority="high" decoding="async"/></button><span className="maison-object-caption">ROSÉ CŒUR <i>—</i> THE PRESENTATION STUDY</span></div>
  <div className="maison-stage-footer"><span>AN EXPRESSION OF ETERNITY</span><a href="#collection">Scroll to discover <span>↓</span></a><button className="replay-opening" onClick={onReplay}>Replay introduction ↻</button></div>
 </div></section>;
}
