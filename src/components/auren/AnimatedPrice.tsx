import {useEffect,useRef,useState} from 'react';
import {formatNPR} from '@/lib/shop';
/** One reveal per price/product. No timers or count-up changes to the quoted value. */
export function AnimatedPrice({value}:{value:number}){
 const host=useRef<HTMLSpanElement>(null);const [shown,setShown]=useState(false);
 useEffect(()=>{setShown(false);const el=host.current;if(!el)return;if(matchMedia('(prefers-reduced-motion: reduce)').matches){setShown(true);return;}const io=new IntersectionObserver(([entry])=>{if(entry?.isIntersecting){setShown(true);io.disconnect();}},{threshold:.25});io.observe(el);return()=>io.disconnect();},[value]);
 const label=formatNPR(value);
 return <span ref={host} className={`price-reveal ${shown?'is-visible':''}`} aria-label={label}><span aria-hidden="true">{Array.from(label).map((c,i)=><span className="price-character" key={i} style={{animationDelay:`${i*28}ms`}}>{c===' '?'\u00a0':c}</span>)}</span></span>;
}
