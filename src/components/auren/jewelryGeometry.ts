import * as T from 'three';

/** Original modeled geometry, shared by standalone and hand previews. */
export function createJewelry(id: string) {
  const root=new T.Group();
  const metal=new T.MeshStandardMaterial({color:0xe4e1dc,metalness:1,roughness:.12,envMapIntensity:1.2});
  const gem=new T.MeshPhysicalMaterial({color:id==='coeur'?0xf553b0:id==='bordeaux'?0xa41b43:0xf4f1fa,metalness:0,roughness:.015,transmission:.72,ior:2.333,thickness:.55,dispersion:.045,clearcoat:1,envMapIntensity:1.8});
  const diamond=new T.MeshPhysicalMaterial({color:0xffffff,roughness:.025,metalness:0,transmission:.55,ior:2.3,thickness:.15,envMapIntensity:2});
  const add=(g:T.BufferGeometry,m:T.Material,x=0,y=0,z=0,parent:T.Object3D=root)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;};
  add(new T.TorusGeometry(.88,.085,24,128),metal);
  // Twin pavé shoulders remain actual geometry at every viewing angle.
  for(let i=0;i<64;i++) {const a=i/64*Math.PI*2;for(const z of [-.045,.045]){const stone=add(new T.OctahedronGeometry(.037,0),diamond,Math.cos(a)*.89,Math.sin(a)*.89,z);stone.rotation.z=a;}}
  if(id==='band')return {root,metal};
  if(id==='eternity'){
    const black=new T.MeshStandardMaterial({color:0x08080a,metalness:.5,roughness:.16});
    add(new T.BoxGeometry(1.05,1.05,.23),metal,0,.83,.17);
    add(new T.BoxGeometry(.9,.9,.25),black,0,.83,.2);
    add(new T.TorusGeometry(.27,.045,12,4),metal,0,.83,.39).rotation.z=Math.PI/4;
    add(new T.OctahedronGeometry(.29,1),diamond,0,.83,.4);return {root,metal};
  }
  const N=48, outline:T.Vector2[]=[];
  for(let i=0;i<N;i++){const t=i/N*Math.PI*2;let x:number,y:number;
    if(id==='coeur'){x=16*Math.pow(Math.sin(t),3)/17;y=(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))/17;}
    else {x=Math.cos(t)*(id==='marquise'?.5:.7);y=Math.sin(t)*(id==='marquise'?1.2:1);}
    outline.push(new T.Vector2(x,y));
  }
  const positions:number[]=[],indices:number[]=[];
  const tiers=[[.55,.3],[.86,.19],[1,0],[.84,-.12],[.12,-.45]];
  tiers.forEach(([scale,z])=>outline.forEach(v=>positions.push(v.x*scale!,v.y*scale!,z!)));
  for(let j=0;j<tiers.length-1;j++)for(let i=0;i<N;i++){const a=j*N+i,b=j*N+(i+1)%N,c=(j+1)*N+i,d=(j+1)*N+(i+1)%N;indices.push(a,c,b,b,c,d);}
  const top=T.ShapeUtils.triangulateShape(outline,[]);top.forEach(t=>indices.push(...t));
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setIndex(indices);const flat=geo.toNonIndexed();flat.computeVertexNormals();geo.dispose();
  const crown=new T.Group();crown.position.set(0,.94,.16);crown.scale.setScalar(.66);root.add(crown);add(flat,gem,0,0,0,crown);
  const path=new T.CatmullRomCurve3(outline.map(v=>new T.Vector3(v.x*1.05,v.y*1.05,-.035)),true);
  add(new T.TubeGeometry(path,96,.045,8,true),metal,0,0,0,crown);
  if(id!=='coeur')for(let i=0;i<N;i++){const v=outline[i]!;add(new T.OctahedronGeometry(.055,0),diamond,v.x*1.1,v.y*1.1,0,crown);}
  for(const i of [4,14,24,34,44]){const v=outline[i]!;add(new T.SphereGeometry(.067,16,12),metal,v.x*.96,v.y*.96,.17,crown);}
  for(const sign of [-1,1]){
    const side=add(new T.OctahedronGeometry(.24,1),diamond,sign*.66,.72,.16);side.scale.set(.75,1.25,.65);side.rotation.z=-sign*.7;
    const curve=new T.CatmullRomCurve3([new T.Vector3(sign*.3,.85,0),new T.Vector3(sign*.64,.95,-.06),new T.Vector3(sign*.9,.4,0)]);
    add(new T.TubeGeometry(curve,40,.045,10,false),metal);
  }
  return {root,metal};
}
