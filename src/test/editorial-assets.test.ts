import {readFileSync,existsSync} from 'node:fs';
import {describe,it,expect} from 'vitest';
import {PRODUCTS} from '@/lib/shop';
describe('consistent editorial image assets',()=>{
 it.each(Object.values(PRODUCTS))('provides a self-contained optimized photograph for $name',product=>{expect(product.image).toMatch(/^\/editorial\/[a-z]+-satin\.svg$/);const path=`public${product.image}`;expect(existsSync(path)).toBe(true);const svg=readFileSync(path,'utf8');expect(svg).toContain('viewBox="0 0 1050 1400"');expect(svg).not.toMatch(/<script|https?:\/\/(?!www\.w3\.org)/);const encoded=svg.match(/data:image\/webp;base64,([^"\s]+)/)?.[1];expect(encoded).toBeTruthy();const data=Buffer.from(encoded!,'base64');expect(data.subarray(0,4).toString()).toBe('RIFF');expect(data.subarray(8,12).toString()).toBe('WEBP');expect(data.length).toBeLessThan(200000);});
});
