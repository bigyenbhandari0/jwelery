import {useEffect,useRef,useState} from 'react';
const KEY='auren-runway-welcome-v1';
/** Font-ready, compositor-driven handoff. Geometry is measured once before motion. */
export function BrandIntro({replay=false}:{replay?:boolean}){
 const [phase,setPhase]=useState<'playing'|'leaving'|'revealing'|'hidden'>('playing');
 const enter=useRef<HTMLButtonElement>(null),wordmark=useRef<HTMLParagraphElement>(null),cover=useRef<HTMLDivElement>(null);
 const release=useRef<()=>void>(()=>{}),timers=useRef<ReturnType<typeof setTimeout>[]>([]),animations=useRef<Animation[]>([]);
 const finishIntro=()=>{timers.current.forEach(clearTimeout);timers.current=[];animations.current.forEach(a=>a.cancel());animations.current=[];document.documentElement.setAttribute('data-auren-intro','skip');release.current();setPhase('hidden');window.dispatchEvent(new Event('auren-intro-complete'));};
 const remember=()=>{try{sessionStorage.setItem(KEY,'seen');}catch{}};
 const skip=()=>{remember();finishIntro();};
 useEffect(()=>{
  const preference=matchMedia('(prefers-reduced-motion: reduce)');let seen=false;try{seen=sessionStorage.getItem(KEY)==='seen';}catch{}
  if(preference.matches||(!replay&&(seen||location.hash))){finishIntro();return;}
  document.documentElement.setAttribute('data-auren-intro','playing');window.dispatchEvent(new Event('auren-intro-start'));const overflow=document.body.style.overflow;document.body.style.overflow='hidden';release.current=()=>{document.body.style.overflow=overflow;};enter.current?.focus({preventScroll:true});
  let live=true,started=false;const fonts=document.fonts;
  const begin=()=>{
   if(!live||started||!cover.current||!wordmark.current)return;started=true;
   // A slow remote font never swaps halfway through the logo's trajectory.
   const family=fonts?.check&&!fonts.check('400 48px "Cormorant Garamond"')?'Georgia, serif':'"Cormorant Garamond", Georgia, serif';document.documentElement.style.setProperty('--brand-font',family);
   const target=document.querySelector('[data-intro-target]'),source=wordmark.current,layer=cover.current;
   const end=target?.getBoundingClientRect(),start=source.getBoundingClientRect();
   const x=end?end.left+end.width/2-(start.left+start.width/2):0,y=end?end.top+end.height/2-(start.top+start.height/2):-innerHeight*.4,scale=end?end.width/Math.max(1,start.width):.4;
   layer.style.setProperty('--intro-x',`${x}px`);layer.style.setProperty('--intro-y',`${y}px`);layer.style.setProperty('--intro-scale',String(scale));layer.setAttribute('data-ready','true');
   const native=typeof source.animate==='function';if(native){layer.setAttribute('data-native','true');animations.current.push(source.animate([{opacity:0,transform:'translate3d(0,6px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{duration:550,easing:'cubic-bezier(.22,.61,.36,1)',fill:'forwards'}));}
   timers.current.push(setTimeout(()=>{if(!live)return;remember();setPhase('leaving');if(native)animations.current.push(source.animate([{transform:'translate3d(0,0,0) scale(1)'},{transform:`translate3d(${x}px,${y}px,0) scale(${scale})`}],{duration:800,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'}));},1100));
   timers.current.push(setTimeout(()=>{if(!live)return;document.documentElement.setAttribute('data-auren-intro','handoff');setPhase('revealing');},1900));
   timers.current.push(setTimeout(finishIntro,2350));
  };
  if(fonts?.ready){timers.current.push(setTimeout(begin,500));void fonts.ready.then(begin).catch(begin);}else begin();
  const changed=()=>{if(preference.matches){remember();finishIntro();}};const resized=()=>{remember();finishIntro();};preference.addEventListener('change',changed);window.addEventListener('resize',resized,{once:true});
  return()=>{live=false;timers.current.forEach(clearTimeout);animations.current.forEach(a=>a.cancel());preference.removeEventListener('change',changed);window.removeEventListener('resize',resized);document.body.style.overflow=overflow;};
 },[]);
 if(phase==='hidden')return null;
 return <div ref={cover} className={`brand-intro brand-morph playing-polished ${phase}`} role="dialog" aria-modal="true" aria-label="Welcome to AUREN" onKeyDown={e=>{if(e.key==='Escape')skip();if(e.key==='Tab'){e.preventDefault();enter.current?.focus();}}}><div className="intro-composition"><p ref={wordmark} className="intro-wordmark" aria-label="AUREN"><span>AUREN</span></p><p className="sr-only">For every version of you.</p></div><button ref={enter} className="intro-enter" onClick={skip}>Enter the maison <span aria-hidden="true">↗</span></button></div>;
}
