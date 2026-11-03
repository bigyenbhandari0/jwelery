import { useEffect,useRef,useState } from 'react';
const KEY='auren-ivory-welcome-v4';

/** The wordmark itself travels into the hero's background typography. */
export function BrandIntro({replay=false}:{replay?:boolean}){
 const [phase,setPhase]=useState<'playing'|'leaving'|'hidden'>('playing');
 const enter=useRef<HTMLButtonElement>(null),wordmark=useRef<HTMLParagraphElement>(null),cover=useRef<HTMLDivElement>(null);
 const release=useRef<()=>void>(()=>{}),timers=useRef<ReturnType<typeof setTimeout>[]>([]);
 const finishIntro=()=>{timers.current.forEach(clearTimeout);timers.current=[];document.documentElement.setAttribute('data-auren-intro','skip');release.current();setPhase('hidden');window.dispatchEvent(new Event('auren-intro-complete'));};
 const remember=()=>{try{sessionStorage.setItem(KEY,'seen');}catch{}};
 const skip=()=>{remember();finishIntro();};
 useEffect(()=>{
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  let seen=false;try{seen=sessionStorage.getItem(KEY)==='seen';}catch{}
  if(preference.matches||(!replay&&(seen||location.hash))){finishIntro();return;}
  window.dispatchEvent(new Event('auren-intro-start'));
  const previous=document.activeElement instanceof HTMLElement?document.activeElement:null;
  const overflow=document.body.style.overflow;document.body.style.overflow='hidden';
  release.current=()=>{document.body.style.overflow=overflow;};
  enter.current?.focus({preventScroll:true});
  const measure=()=>{
   const target=document.querySelector('.maison-watermark'),source=wordmark.current;
   if(!target||!source||!cover.current)return;
   const end=target.getBoundingClientRect(),start=source.getBoundingClientRect();
   // Both layers use the same font and spacing. The target is measured, not guessed.
   cover.current.style.setProperty('--intro-x',`${end.left+end.width/2-(start.left+start.width/2)}px`);
   cover.current.style.setProperty('--intro-y',`${end.top+end.height/2-(start.top+start.height/2)}px`);
   cover.current.style.setProperty('--intro-scale',String(end.width/Math.max(1,start.width)));
  };
  measure();let live=true;document.fonts?.ready.then(()=>{if(live)measure();});
  const resize=()=>{if(cover.current?.classList.contains('playing'))measure();};window.addEventListener('resize',resize);
  const leave=setTimeout(()=>{remember();setPhase('leaving');},1600);
  const finish=setTimeout(finishIntro,2600);timers.current=[leave,finish];
  const changed=()=>{if(preference.matches){remember();finishIntro();}};
  preference.addEventListener('change',changed);
  return()=>{live=false;clearTimeout(leave);clearTimeout(finish);window.removeEventListener('resize',resize);preference.removeEventListener('change',changed);document.body.style.overflow=overflow;if(previous&&previous!==document.body)previous.focus({preventScroll:true});};
 },[]);
 if(phase==='hidden')return null;
 return <div ref={cover} className={`brand-intro brand-morph ${phase}`} role="dialog" aria-modal="true" aria-label="Welcome to AUREN" onKeyDown={e=>{if(e.key==='Escape')skip();if(e.key==='Tab'){e.preventDefault();enter.current?.focus();}}}>
  <div className="intro-composition"><p ref={wordmark} className="intro-wordmark" aria-label="AUREN"><span>AUREN</span></p><p className="sr-only">The Art of Being Remembered.</p></div>
  <button ref={enter} className="intro-enter" onClick={skip}>Enter the maison <span aria-hidden="true">↗</span></button>
 </div>;
}
