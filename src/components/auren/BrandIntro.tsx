import { useEffect,useRef,useState } from 'react';
const KEY='auren-ivory-welcome-v2';

/** A brief brand moment, independent of page and image loading. */
export function BrandIntro(){
 const [phase,setPhase]=useState<'playing'|'leaving'|'hidden'>('playing');
 const enter=useRef<HTMLButtonElement>(null);
 const release=useRef<()=>void>(()=>{});
 const finishIntro=()=>{document.documentElement.setAttribute('data-auren-intro','skip');release.current();setPhase('hidden');};
 const remember=()=>{try{sessionStorage.setItem(KEY,'seen');}catch{/* Optional persistence. */}};
 const skip=()=>{remember();finishIntro();};
 useEffect(()=>{
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  let seen=false;try{seen=sessionStorage.getItem(KEY)==='seen';}catch{/* Show once if storage is blocked. */}
  if(preference.matches||seen||location.hash){setPhase('hidden');return;}
  const previous=document.activeElement instanceof HTMLElement?document.activeElement:null;
  const overflow=document.body.style.overflow;document.body.style.overflow='hidden';
  release.current=()=>{document.body.style.overflow=overflow;};
  enter.current?.focus({preventScroll:true});
  const leave=setTimeout(()=>{remember();setPhase('leaving');},1600);
  const finish=setTimeout(finishIntro,2200);
  const changed=()=>{if(preference.matches){remember();finishIntro();}};
  preference.addEventListener('change',changed);
  return()=>{clearTimeout(leave);clearTimeout(finish);preference.removeEventListener('change',changed);document.body.style.overflow=overflow;if(previous&&previous!==document.body)previous.focus({preventScroll:true});};
 },[]);
 if(phase==='hidden')return null;
 return <div className={`brand-intro ${phase}`} role="dialog" aria-modal="true" aria-label="Welcome to AUREN" onKeyDown={e=>{if(e.key==='Escape')skip();if(e.key==='Tab'){e.preventDefault();enter.current?.focus();}}}>
  <div className="intro-composition"><p className="intro-wordmark">{'AUREN'.split('').map((letter,i)=><span key={i} style={{animationDelay:`${120+i*80}ms`}}>{letter}</span>)}</p><p className="intro-identity">FINE JEWELLERY</p><p className="intro-promise">The Art of Being Remembered.</p></div>
  <span className="intro-edition">THE PRIVATE COLLECTION / VOL. I</span><button ref={enter} className="intro-enter" onClick={skip}>Enter the maison <span aria-hidden="true">↗</span></button>
 </div>;
}
