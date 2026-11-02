import { getProduct, type Product } from './shop';
import type { TrayPiece } from './tray';

// Populate only with owner-verified details. Empty channels never create fake links.
export const BUSINESS_CONTACT: {whatsapp:string|null;instagram:string|null}={whatsapp:null,instagram:null};
export const APPEARANCE:Record<string,{shape:string;style:string;why:string}>={
 coeur:{shape:'Pink heart-shaped centre',style:'Colourful',why:'A romantic heart silhouette with an expressive pink centre.'},
 bordeaux:{shape:'Deep-red oval centre',style:'Colourful',why:'A rich colour accent framed by a delicate halo silhouette.'},
 band:{shape:'Continuous stone-set band',style:'Minimal',why:'A restrained, repeating silhouette for a quieter jewellery style.'},
 marquise:{shape:'Elongated pointed centre',style:'Statement',why:'An elongated silhouette and ornate details for a statement look.'},
 eternity:{shape:'Square dark face',style:'Statement',why:'A bold geometric face and sculptural shoulders.'},
};
export function inquiryFor(items:TrayPiece[],note=''){
 return `AUREN — private jewellery inquiry\n\n${items.map((i,n)=>{const p=getProduct(i.id)!;return `${n+1}. ${p.name}\nQuantity: ${i.qty||1}\nSize preference: ${i.size||'To confirm'}\nMetal/design request (unconfirmed): ${i.metal||'As pictured — material to confirm'}\nGemstone request (unconfirmed): ${i.stone||'As pictured — identity to confirm'}\nPersonal request: ${i.engraving||'None'}\nDemo reference price: NPR ${p.price.toLocaleString('en-IN')}`;}).join('\n\n')}${note?`\n\nAdditional details: ${note}`:''}\n\nPlease confirm materials, stone identity, dimensions, availability, final pricing, sizing and lead time. This is an inquiry, not an order.`;
}
export function recommendProducts(products:Product[],budget:number,style:string){return products.filter(p=>p.price<=budget).sort((a,b)=>Number(APPEARANCE[b.id]?.style===style)-Number(APPEARANCE[a.id]?.style===style)).slice(0,3);}
