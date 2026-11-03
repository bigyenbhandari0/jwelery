import { AtelierFilm } from './AtelierFilm';
import { useEffect, useRef, lazy, Suspense } from 'react';
const SignatureScene=lazy(()=>import('./SignatureScene').then(m=>({default:m.SignatureScene})));
import { PRODUCTS } from '@/lib/shop';

/** Scroll choreography uses the actual product photograph, without pretending it is a 3D model. */
export function MaisonOpening({onView,onReplay}:{onView:()=>void;onReplay:()=>void}) {
 const section=useRef<HTMLElement>(null),progress=useRef(0);
 useEffect(()=>{
  const reveal=()=>{section.current?.classList.remove('ring-arriving');requestAnimationFrame(()=>section.current?.classList.add('ring-arriving'));};const conceal=()=>section.current?.classList.remove('ring-arriving');window.addEventListener('auren-intro-start',conceal);window.addEventListener('auren-intro-complete',reveal);
  const media=matchMedia('(prefers-reduced-motion: reduce)');let frame=0;
  const update=()=>{frame=0;const el=section.current;if(!el)return;const rect=el.getBoundingClientRect();const distance=Math.max(1,el.offsetHeight-innerHeight);progress.current=media.matches?1:Math.max(0,Math.min(1,-rect.top/distance));el.style.setProperty('--journey',String(progress.current));};
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};update();addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);media.addEventListener('change',schedule);
  return()=>{window.removeEventListener('auren-intro-start',conceal);window.removeEventListener('auren-intro-complete',reveal);removeEventListener('scroll',schedule);removeEventListener('resize',schedule);media.removeEventListener('change',schedule);cancelAnimationFrame(frame);};
 },[]);
 return <section id="top" className="maison-opening" ref={section} aria-label="The AUREN signature collection"><div className="maison-stage spatial-stage">
  <span className="maison-watermark" aria-hidden="true">AUREN</span>
  <div className="maison-opening-copy"><p className="eyebrow">THE PRIVATE COLLECTION / VOL. I</p><h1>The Art of<br/>Being <em>Remembered.</em></h1><p>Exceptional pieces. Intimate stories.<br/>Timeless expressions.</p><a className="button button-dark" href="#signature-edit">Explore the Collection <span>↗</span></a><AtelierFilm/></div>
  <Suspense fallback={<div className="spatial-loading"><img src={PRODUCTS.coeur.image} alt="Rosé Cœur" width={960} height={960}/></div>}><SignatureScene progress={progress} onView={onView}/></Suspense>
  <div className="spatial-specs"><p className="eyebrow">ROSÉ CŒUR</p><p>Pink heart centre<br/>Pear-shaped side accents</p><p>Demo reference · NPR 4,85,000</p></div>
  <div className="maison-stage-footer"><span>AN EXPRESSION OF ETERNITY</span><a href="#signature-edit">Scroll to discover <span>↓</span></a><button className="replay-opening" onClick={onReplay}>Replay introduction ↻</button></div>
 </div></section>;
}
