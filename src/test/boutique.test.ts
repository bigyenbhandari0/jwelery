import { describe,expect,it } from 'vitest';
import { PRODUCTS } from '@/lib/shop';
import { parseTray } from '@/lib/tray';
import { inquiryFor,recommendProducts,BUSINESS_CONTACT } from '@/lib/boutique';
describe('private boutique',()=>{
 it('restores only valid pieces and deduplicates saved entries',()=>{
   expect(parseTray([null,{id:'missing'},{id:'constructor'},{id:'coeur',size:7},{id:'coeur',size:'US 6',engraving:'A & B'}])).toEqual([{id:'coeur',size:'US 6',engraving:'A & B'}]);
   expect(parseTray({id:'coeur'})).toEqual([]);
 });
 it('retains personal requests without treating them as verified options',()=>{
   const text=inquiryFor([{id:'coeur',metal:'Gold',size:'US 6',engraving:'A & B'}],'Birthday gift');
   expect(text).toContain('Rosé Cœur');expect(text).toContain('US 6');expect(text).toContain('A & B');expect(text).toContain('Birthday gift');expect(text).toContain('unconfirmed');expect(text).toContain('not an order');
 });
 it('keeps gift suggestions within budget and prioritizes the chosen visible style',()=>{
   const products=Object.values(PRODUCTS);expect(recommendProducts(products,250000,'Colourful').map(p=>p.id)).toEqual(['band']);
   const picks=recommendProducts(products,500000,'Colourful');expect(picks.slice(0,2).map(p=>p.id).sort()).toEqual(['bordeaux','coeur']);expect(picks.every(p=>p.price<=500000)).toBe(true);
 });
 it('has no invented contact destinations',()=>{expect(BUSINESS_CONTACT).toEqual({whatsapp:null,instagram:null});});
});
