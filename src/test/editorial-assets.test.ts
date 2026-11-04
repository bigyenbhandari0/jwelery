import {readFileSync,existsSync} from 'node:fs';
import {describe,it,expect} from 'vitest';
import {PRODUCTS} from '@/lib/shop';
describe('consistent transparent jewelry assets',()=>{
 it.each(Object.values(PRODUCTS))('provides a optimized transparent cutout for $name',product=>{expect(product.image).toMatch(/^\/editorial\/[a-z]+-cutout\.svg$/);const path=`public${product.image}`;expect(existsSync(path)).toBe(true);const svg=readFileSync(path,'utf8');expect(svg).not.toMatch(/<script|https?:\/\/(?!www\.w3\.org)/);const encoded=svg.match(/data:image\/webp;base64,([^"\s]+)/)?.[1];expect(encoded).toBeTruthy();const data=Buffer.from(encoded!,'base64');expect(data.subarray(0,4).toString()).toBe('RIFF');expect(data.subarray(8,12).toString()).toBe('WEBP');expect(data.includes(Buffer.from('ALPH'))).toBe(true);expect(data.length).toBeLessThan(1500000);});
});
