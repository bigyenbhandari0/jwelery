import { describe, expect, it } from 'vitest';
import { Box3, Mesh, MeshPhysicalMaterial } from 'three';
import { createJewelry } from '@/components/auren/jewelryGeometry';

describe('shared product jewelry geometry', () => {
  it.each(['coeur','marquise','eternity','band','bordeaux'])('builds finite renderable geometry for %s', id => {
    const {root}=createJewelry(id);
    const bounds=new Box3().setFromObject(root);
    expect(bounds.isEmpty()).toBe(false);
    expect([bounds.min.x,bounds.min.y,bounds.min.z,bounds.max.x,bounds.max.y,bounds.max.z].every(Number.isFinite)).toBe(true);
    root.traverse(o=>{if(o instanceof Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});
  });
  it('uses a pink faceted central stone for the heart design',()=>{
    const {root}=createJewelry('coeur');
    const stones:Mesh[]=[];
    root.traverse(o=>{if(o instanceof Mesh && o.material instanceof MeshPhysicalMaterial && o.material.color.r>o.material.color.g*2)stones.push(o);});
    expect(stones).toHaveLength(1);
    expect(stones[0]!.geometry.getAttribute('position').count).toBeGreaterThan(500);
  });
});
