import { useEffect,useState } from 'react';
import { getProduct } from './shop';
export type TrayPiece={id:string;metal?:string;stone?:string;size?:string;engraving?:string;qty?:number};
const KEY='auren-private-tray';let memory:TrayPiece[]=[];
export function parseTray(value:unknown):TrayPiece[]{
 if(!Array.isArray(value))return [];
 const result=new Map<string,TrayPiece>();
 for(const valueItem of value){if(!valueItem||typeof valueItem!=='object')continue;const item=valueItem as Record<string,unknown>;if(typeof item['id']!=='string'||!getProduct(item['id']))continue;const safe:TrayPiece={id:item['id']};for(const key of ['metal','stone','size','engraving'] as const){if(typeof item[key]==='string')safe[key]=item[key].slice(0,key==='engraving'?500:80);}if(Number.isInteger(item['qty'])&&Number(item['qty'])>0)safe.qty=Math.min(9,Number(item['qty']));result.set(safe.id,safe);}
 return [...result.values()].slice(0,5);
}
export function readTray():TrayPiece[]{try{memory=parseTray(JSON.parse(localStorage.getItem(KEY)||'[]'));}catch{/* Keep the current session usable if storage is unavailable. */}return memory;}
export function writeTray(items:TrayPiece[]){memory=parseTray(items);try{localStorage.setItem(KEY,JSON.stringify(memory));}catch{/* In-memory selection remains usable. */}window.dispatchEvent(new CustomEvent('auren-tray',{detail:memory}));}
export function useTray(){const [items,setItems]=useState<TrayPiece[]>([]);useEffect(()=>{setItems(readTray());const update=(event:Event)=>setItems(parseTray((event as CustomEvent).detail??readTray()));const storage=()=>setItems(readTray());window.addEventListener('auren-tray',update);window.addEventListener('storage',storage);return()=>{window.removeEventListener('auren-tray',update);window.removeEventListener('storage',storage);};},[]);return {items,save:writeTray,add:(piece:TrayPiece)=>writeTray([...readTray().filter(x=>x.id!==piece.id),piece]),remove:(id:string)=>writeTray(readTray().filter(x=>x.id!==id))};}
