import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

/** Rosé Cœur reconstruction: heart centre, three claws, pear sides, split pavé shoulders.
 * Hidden construction is interpretive, not manufacturer CAD. Units are normalized. */
export function createSignatureRing(){
 const root=new T.Group();root.name='rose-coeur-reconstruction';
 const metal=new T.MeshStandardMaterial({color:0xe6e3df,metalness:1,roughness:.13,envMapIntensity:1.35});
 const white=new T.MeshPhysicalMaterial({color:0xffffff,roughness:.025,metalness:0,transmission:.9,thickness:.12,ior:2.42,dispersion:.035,envMapIntensity:1.4});
 const pink=new T.MeshPhysicalMaterial({color:0xffa8cd,roughness:.018,transmission:.94,thickness:.48,ior:2.42,dispersion:.04,attenuationColor:0xd9277c,attenuationDistance:.55,envMapIntensity:1.5,side:T.DoubleSide});
 const mesh=(geometry:T.BufferGeometry,material:T.Material,name:string,parent:T.Object3D=root)=>{const m=new T.Mesh(geometry,material);m.name=name;parent.add(m);return m;};
 // A faceted closed gemstone with a table, crown, girdle and pavilion.
 function cut(outline:T.Vector2[],height=.26){
  const n=outline.length,positions:number[]=[],indices:number[]=[];
  const rings=[[.5,height],[.8,height*.55],[1,0],[1,-.025],[.58,-height*.7],[.035,-height*1.6]];
  rings.forEach(([s,y])=>outline.forEach(v=>positions.push(v.x*s!,y!,v.y*s!)));
  for(let r=0;r<rings.length-1;r++)for(let i=0;i<n;i++){const a=r*n+i,b=r*n+(i+1)%n,c=(r+1)*n+i,d=(r+1)*n+(i+1)%n;if((i+r)%2)indices.push(a,c,d,a,d,b);else indices.push(a,c,b,b,c,d);}
  if(T.ShapeUtils.area(outline)>0)for(let i=0;i<indices.length;i+=3){const b=indices[i+1]!;indices[i+1]=indices[i+2]!;indices[i+2]=b;}
  // Table and culet cap winding is chosen separately from the pavilion.
  T.ShapeUtils.triangulateShape(outline,[]).forEach(([a,b,c])=>indices.push(c!,b!,a!));
  const offset=(rings.length-1)*n;T.ShapeUtils.triangulateShape(outline,[]).forEach(([a,b,c])=>indices.push(offset+a!,offset+b!,offset+c!));
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setIndex(indices);const flat=g.toNonIndexed();flat.computeVertexNormals();g.dispose();return flat;
 }
 const heart=Array.from({length:48},(_,i)=>{const t=i/48*Math.PI*2;return new T.Vector2(16*Math.sin(t)**3/24,-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))/24);});
 const centre=new T.Group();centre.name='pink-heart-setting';centre.position.set(0,1.06,0);root.add(centre);
 mesh(cut(heart,.24),pink,'faceted-pink-heart',centre);
 const rim=new T.CatmullRomCurve3(heart.map(v=>new T.Vector3(v.x*1.015,-.055,v.y*1.015)),true);
 mesh(new T.TubeGeometry(rim,96,.021,8,true),metal,'heart-girdle-gallery',centre);
 // Two separate polished rails with a widening split only at the shoulders.
 
 for(const sign of [-1,1]){
  const points=Array.from({length:128},(_,i)=>{const a=i/128*Math.PI*2;const upper=Math.max(0,Math.sin(a));return new T.Vector3(Math.cos(a)*.82,Math.sin(a)*.82,sign*(.065+upper**3*.16));});
  mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points,true),128,.048,12,true),metal,`split-shank-${sign}`);
 }
 const round=Array.from({length:16},(_,i)=>new T.Vector2(Math.cos(i/16*Math.PI*2)*.047,Math.sin(i/16*Math.PI*2)*.047));
 const paveGeo=cut(round,.025),pave=new T.InstancedMesh(paveGeo,white,72);pave.name='shoulder-pave-stones';root.add(pave);const dummy=new T.Object3D();let index=0;
 for(const sign of [-1,1])for(let i=0;i<36;i++){
  const a=.07+i/35*(Math.PI-.14),upper=Math.max(0,Math.sin(a));dummy.position.set(Math.cos(a)*.866,Math.sin(a)*.866,sign*(.065+upper**3*.16));dummy.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),new T.Vector3(Math.cos(a),Math.sin(a),0));dummy.updateMatrix();pave.setMatrixAt(index++,dummy.matrix);
 }
 pave.instanceMatrix.needsUpdate=true;
 const pear=Array.from({length:32},(_,i)=>{const t=i/32*Math.PI*2;return new T.Vector2(Math.sin(t)*.19*(.72+.28*Math.cos(t)),Math.cos(t)*.32);});
 for(const sign of [-1,1]){
  const side=mesh(cut(pear,.12),white,`pear-side-${sign}`);side.position.set(sign*.64,.88,0);side.rotation.z=sign*-.3;
  const bridge=new T.CatmullRomCurve3([new T.Vector3(sign*.45,.9,-.22),new T.Vector3(sign*.65,.89,0),new T.Vector3(sign*.79,.65,.18)]);
  mesh(new T.TubeGeometry(bridge,28,.028,8,false),metal,`pear-basket-${sign}`);
 }
 // Three visible claws correspond to the two lobes and the lower heart point.
 for(const [x,z] of [[-.49,-.31],[.49,-.31],[0,.67]]){
  const curve=new T.CatmullRomCurve3([new T.Vector3(x!*.85,-.22,z!*.85),new T.Vector3(x!,-.01,z!),new T.Vector3(x!*.96,.18,z!*.96)]);
  mesh(new T.TubeGeometry(curve,16,.031,10,false),metal,'heart-prong',centre);
  const tip=mesh(new T.SphereGeometry(.043,12,10),metal,'polished-prong-tip',centre);tip.position.set(x!*.96,.18,z!*.96);tip.scale.set(.8,1.35,1);
 }
 root.userData['design']='Pink heart centre, pear side stones, twin pavé rails and three claws';
 return root;
}

export function createPresentationBox(){
 const root=new T.Group();root.name='ivory-presentation-box';
 const data=new Uint8Array(64*64);for(let i=0;i<data.length;i++)data[i]=110+((i*127+(i>>3)*31)%45);const texture=new T.DataTexture(data,64,64,T.RedFormat);texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(12,12);texture.needsUpdate=true;
 const suede=new T.MeshStandardMaterial({color:0xdcccb5,roughness:.97,bumpMap:texture,bumpScale:.008}),lining=new T.MeshStandardMaterial({color:0xeee4d4,roughness:1,bumpMap:texture,bumpScale:.005}),gold=new T.MeshStandardMaterial({color:0xbda479,metalness:.83,roughness:.28});
 const add=(w:number,h:number,d:number,x:number,y:number,z:number,material:T.Material,name:string)=>{const m=new T.Mesh(new RoundedBoxGeometry(w,h,d,2,Math.min(w,h,d)*.28),material);m.position.set(x,y,z);m.name=name;root.add(m);return m;};
 add(2.42,.18,1.6,0,-.91,0,suede,'base');add(2.2,.12,1.38,0,-.75,0,lining,'cushion');
 // Actual depth-tested front lip occludes the lower ring band, with no 2D mask.
 add(2.42,.64,.14,0,-.57,.74,suede,'occluding-front-lip');add(.14,.64,1.5,-1.14,-.57,0,suede,'left-wall');add(.14,.64,1.5,1.14,-.57,0,suede,'right-wall');
 add(2.4,1.9,.16,0,.28,-.73,suede,'open-lid');add(2.15,1.65,.045,0,.3,-.63,lining,'lid-lining');add(2.41,.028,.16,0,-.28,.75,gold,'champagne-front-trim');
 const hinge=new T.Mesh(new T.CylinderGeometry(.065,.065,1.9,16),gold);hinge.rotation.z=Math.PI/2;hinge.position.set(0,-.72,-.7);root.add(hinge);
 return root;
}

/** Infinite Band: repeating round stones with individual shared-claw settings. */
export function createSignatureBand(){
 const root=new T.Group();root.name='infinite-band-reconstruction';
 const metal=new T.MeshStandardMaterial({color:0xe6e3df,metalness:1,roughness:.13});
 const stone=new T.MeshPhysicalMaterial({color:0xffffff,roughness:.02,transmission:.92,ior:2.42,thickness:.16,dispersion:.035});
 const band=new T.Mesh(new T.TorusGeometry(.8,.065,16,96),metal);band.name='continuous-band';root.add(band);
 const verts:number[]=[],idx:number[]=[],n=12,tiers=[[.5,.13],[1,.04],[1,0],[.05,-.16]];
 tiers.forEach(([r,y])=>{for(let i=0;i<n;i++){const a=i/n*Math.PI*2;verts.push(Math.cos(a)*r!*.145,y!,Math.sin(a)*r!*.145);}});
 for(let j=0;j<3;j++)for(let i=0;i<n;i++){const a=j*n+i,b=j*n+(i+1)%n,c=(j+1)*n+i,d=(j+1)*n+(i+1)%n;idx.push(a,b,c,b,d,c);}for(let i=1;i<n-1;i++)idx.push(0,i+1,i,3*n,3*n+i,3*n+i+1);
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(verts,3));geo.setIndex(idx);const flat=geo.toNonIndexed();flat.computeVertexNormals();geo.dispose();
 const gems=new T.InstancedMesh(flat,stone,22),claws=new T.InstancedMesh(new T.SphereGeometry(.025,8,8),metal,44),dummy=new T.Object3D();gems.name='twenty-two-round-stones';root.add(gems,claws);
 for(let i=0;i<22;i++){const a=i/22*Math.PI*2;dummy.position.set(Math.cos(a)*.86,Math.sin(a)*.86,0);dummy.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),new T.Vector3(Math.cos(a),Math.sin(a),0));dummy.updateMatrix();gems.setMatrixAt(i,dummy.matrix);for(let j=0;j<2;j++){dummy.position.set(Math.cos(a+.12)*.9,Math.sin(a+.12)*.9,j===0?-.1:.1);dummy.updateMatrix();claws.setMatrixAt(i*2+j,dummy.matrix);}}
 gems.instanceMatrix.needsUpdate=true;claws.instanceMatrix.needsUpdate=true;return root;
}
