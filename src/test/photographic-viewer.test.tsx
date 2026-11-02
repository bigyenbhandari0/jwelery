import { renderToString } from 'react-dom/server';
import { describe,expect,it } from 'vitest';
import { PhotoStage } from '@/components/auren/PhotoViewer';
import { PRODUCTS } from '@/lib/shop';
describe('honest photographic fallback',()=>{
 it.each(Object.values(PRODUCTS))('uses the same product asset for $name close-ups',product=>{
   const markup=renderToString(<PhotoStage product={product}/>);
   expect(markup).toContain(product.image);expect(markup).toContain('STUDIO PHOTOGRAPH');expect(markup.replace(/<!--.*?-->/g,'')).toContain('100%');expect(markup).toContain('Zoom in');expect(markup).not.toContain('<canvas');expect(markup).not.toContain('Drag to rotate');
 });
});
