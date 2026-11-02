import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Link } from '@tanstack/react-router';
import { APPEARANCE } from '@/lib/boutique';
import type { Product } from '@/lib/shop';

export function PhotoStage({product,large=false}:{product:Product;large?:boolean}){
 const [zoom,setZoom]=useState(1),[detail,setDetail]=useState('Full piece');
 const stage=useRef<HTMLDivElement>(null),gesture=useRef<{distance:number;zoom:number}|null>(null);
 useEffect(()=>{setZoom(1);setDetail('Full piece');},[product.id]);
 useEffect(()=>{const el=stage.current;if(!el)return;
 const distance=(e:TouchEvent)=>Math.hypot(e.touches[0]!.clientX-e.touches[1]!.clientX,e.touches[0]!.clientY-e.touches[1]!.clientY);
 const start=(e:TouchEvent)=>{if(e.touches.length===2)gesture.current={distance:distance(e),zoom};};
 const move=(e:TouchEvent)=>{if(e.touches.length===2&&gesture.current){e.preventDefault();setZoom(Math.max(1,Math.min(2.4,gesture.current.zoom*distance(e)/gesture.current.distance)));}};
 const end=()=>{gesture.current=null;};el.addEventListener('touchstart',start,{passive:true});el.addEventListener('touchmove',move,{passive:false});el.addEventListener('touchend',end);return()=>{el.removeEventListener('touchstart',start);el.removeEventListener('touchmove',move);el.removeEventListener('touchend',end);};},[zoom]);
 return <div className={`photo-viewer ${large?'photo-large':''}`}><div ref={stage} className="photo-stage">
 <img src={product.image} alt={`${product.name} — ${detail.toLowerCase()} photographic view`} width={1024} height={1024} loading="eager" decoding="async" fetchPriority="high" style={{transform:`scale(${zoom})`,transition:gesture.current?'none':undefined,transformOrigin:detail==='Centre detail'?'50% 43%':detail==='Shoulder detail'?'25% 50%':'50% 50%'}}/>
 <span className="photo-caption">{detail==='Full piece'?'STUDIO PHOTOGRAPH':`${detail.toUpperCase()} · CROP OF STUDIO PHOTOGRAPH`}</span></div>
 <div className="photo-controls"><div className="detail-select" aria-label="Photographic detail views">{['Full piece','Centre detail','Shoulder detail'].map(d=><button key={d} aria-pressed={detail===d} onClick={()=>{setDetail(d);setZoom(d==='Full piece'?1:1.8);}}>{d}</button>)}</div><div className="zoom-buttons"><button aria-label="Zoom out" disabled={zoom<=1} onClick={()=>setZoom(v=>Math.max(1,v-.25))}>−</button><span>{Math.round(zoom*100)}%</span><button aria-label="Zoom in" disabled={zoom>=2.4} onClick={()=>setZoom(v=>Math.min(2.4,v+.25))}>+</button><button aria-label="Reset photograph view" onClick={()=>{setZoom(1);setDetail('Full piece');}}>Reset</button></div></div></div>;
}
export function PrivateShowroom({product,open,onClose}:{product:Product;open:boolean;onClose:()=>void}){
 return <Dialog open={open} onOpenChange={v=>!v&&onClose()}><DialogContent className="private-showroom-dialog"><div className="showroom-heading"><p className="eyebrow">A PRIVATE VIEWING / AUREN</p><DialogTitle>{product.name}</DialogTitle><DialogDescription>Explore the supplied product image at your own pace. No simulated rotation or material changes.</DialogDescription></div><PhotoStage product={product} large/><div className="showroom-bottom"><p>{APPEARANCE[product.id]?.shape}<br/><small>Additional viewing angles, verified 3D and alternate-lighting assets have not been supplied.</small></p><Link onClick={onClose} className="button button-dark" to="/pieces/$productId" params={{productId:product.id}}>Explore this piece ↗</Link></div></DialogContent></Dialog>;
}
