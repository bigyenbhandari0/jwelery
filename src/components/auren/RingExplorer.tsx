import { useEffect, useRef, useState } from 'react';

export function RingExplorer({ onClose, productId='coeur', tryOn=false }: { onClose?:()=>void; productId?:string; tryOn?:boolean }) {
 const host=useRef<HTMLDivElement>(null);
 const api=useRef<{finish:(c:string)=>void;reset:()=>void;spin:(v:boolean)=>void;place:(f:string)=>void}|null>(null);
 const [status,setStatus]=useState('Preparing your 3D atelier…'),[failed,setFailed]=useState(false),[spinning,setSpinning]=useState(false),[finish,setFinish]=useState('Platinum'),[finger,setFinger]=useState('Ring finger');
 useEffect(()=>{
  let cancelled=false,dispose=()=>{};setStatus('Preparing your 3D atelier…');setFailed(false);
  const init=async()=>{
   const [T,{OrbitControls},{RoomEnvironment},{createJewelry}]=await Promise.all([import('three'),import('three/addons/controls/OrbitControls.js'),import('three/addons/environments/RoomEnvironment.js'),import('./jewelryGeometry')]);
   if(cancelled||!host.current)return;
   const renderer=new T.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.9;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;host.current.appendChild(renderer.domElement);
   const scene=new T.Scene(),camera=new T.PerspectiveCamera(34,1,.01,100);const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.enableZoom=false;controls.minPolarAngle=.15;controls.maxPolarAngle=Math.PI-.15;
   const pmrem=new T.PMREMGenerator(renderer),room=new RoomEnvironment(),env=pmrem.fromScene(room,.035);room.dispose();scene.environment=env.texture;
   scene.add(new T.HemisphereLight(0xfff4e9,0x332132,.45));
   const key=new T.DirectionalLight(0xfff1df,3);key.position.set(-3,5,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.bias=-.0003;scene.add(key);
   const rim=new T.DirectionalLight(0xdce8ff,2);rim.position.set(4,2,-3);scene.add(rim);
   const {root:ring,metal}=createJewelry(productId);scene.add(ring);
   const world=new T.Group();scene.add(world);
   let raf=0,visible=true,start=0,from=new T.Vector3(),to=new T.Vector3(),handRoot:InstanceType<typeof T.Group>|null=null,handScale=1;
   const fingerMap:Record<string,string>={'Ring finger':'ring_01','Middle finger':'middle_01','Index finger':'index_01'};
   const place=(f:string)=>{
    if(!handRoot)return;
    let base:InstanceType<typeof T.Object3D>|undefined,next:InstanceType<typeof T.Object3D>|undefined;
    handRoot.traverse(o=>{if(o.name.startsWith(fingerMap[f]??'ring_01'))base=o;if(o.name.startsWith((fingerMap[f]??'ring_01').replace('_01','_02')))next=o;});
    if(!base||!next)throw new Error('Hand joint unavailable');
    scene.updateMatrixWorld(true);
    const a=base.getWorldPosition(new T.Vector3()),b=next.getWorldPosition(new T.Vector3()),dir=b.clone().sub(a).normalize(),length=a.distanceTo(b);
    to=a.clone().addScaledVector(dir,length*.18);from=a.clone().addScaledVector(dir,length*1.85);
    const back=new T.Vector3(0,0,1);back.addScaledVector(dir,-back.dot(dir)).normalize();const x=new T.Vector3().crossVectors(back,dir).normalize();ring.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(x,back,dir));ring.scale.setScalar(length*.18);start=performance.now();ring.position.copy(from);
   };
   const reset=()=>{camera.position.set(tryOn?.4:.3,tryOn?.15:.45,tryOn?7.6:6.4);controls.target.set(0,tryOn?.05:.35,0);controls.update();};
   const ro=new ResizeObserver(()=>{if(!host.current)return;renderer.setSize(host.current.clientWidth,host.current.clientHeight);camera.aspect=host.current.clientWidth/host.current.clientHeight;camera.updateProjectionMatrix();});ro.observe(host.current);
   const io=new IntersectionObserver(([e])=>{visible=e?.isIntersecting??false;});io.observe(host.current);
   let mixer:InstanceType<typeof T.AnimationMixer>|undefined;
   dispose=()=>{cancelAnimationFrame(raf);ro.disconnect();io.disconnect();controls.dispose();if(mixer)mixer.stopAllAction();scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{for(const value of Object.values(m))if(value instanceof T.Texture)value.dispose();m.dispose();});}});env.dispose();pmrem.dispose();renderer.dispose();renderer.domElement.remove();api.current=null;};
   if(tryOn){
    const {GLTFLoader}=await import('three/addons/loaders/GLTFLoader.js');
    const gltf=await new GLTFLoader().loadAsync('https://raw.githubusercontent.com/blechdom/morphazoid/main/assets/gesticulating-hand/hand.glb');
    if(cancelled){gltf.scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});return;}
    handRoot=new T.Group();const model=gltf.scene;handRoot.add(model);model.rotation.y=-Math.PI/2;world.add(handRoot);
    if(gltf.animations[0]){mixer=new T.AnimationMixer(model);mixer.clipAction(gltf.animations[0]).play();mixer.setTime(0);}
    handRoot.updateMatrixWorld(true);const box=new T.Box3().setFromObject(handRoot),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3());handScale=3.8/Math.max(size.x,size.y,size.z);handRoot.scale.setScalar(handScale);handRoot.position.copy(center.multiplyScalar(-handScale));
    model.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=true;o.receiveShadow=true;}});scene.updateMatrixWorld(true);place('Ring finger');
   } else {ring.rotation.set(-.12,-.2,0);}
   reset();api.current={finish:c=>metal.color.set(c),reset,spin:v=>{controls.autoRotate=v;controls.autoRotateSpeed=.9;},place};
   const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
   const render=()=>{raf=requestAnimationFrame(render);if(!visible)return;if(tryOn&&start){const t=reduced?1:Math.min(1,(performance.now()-start)/1800);ring.position.lerpVectors(from,to,1-Math.pow(1-t,3));}controls.update();renderer.render(scene,camera);};render();setStatus('');
  };
  init().catch(()=>{if(!cancelled){dispose();setFailed(true);setStatus('This browser cannot display the 3D scene. Return to Studio view to see the product photograph.');}});
  return()=>{cancelled=true;dispose();};
 },[productId,tryOn]);
 return <div className={`ring-explorer ${tryOn?'hand-atelier':''}`}><div ref={host} className="ring-explorer-stage" aria-label={tryOn?'Interactive textured hand and ring. Drag to rotate.':'Interactive pink-heart ring. Drag to rotate.'}/>{status&&<p className="explorer-status" role="status">{status}</p>}{onClose&&<button className="explorer-close" onClick={onClose}>← Studio view</button>}{!status&&<div className="explorer-tools"><p className="eyebrow">{tryOn?'THE HAND ATELIER':'THE JEWEL ATELIER'} · DRAG TO ROTATE</p>{tryOn&&<div className="finger-options">{Object.keys({'Ring finger':1,'Middle finger':1,'Index finger':1}).map(f=><button key={f} aria-pressed={finger===f} onClick={()=>{setFinger(f);api.current?.place(f);}}>{f}</button>)}<button onClick={()=>api.current?.place(finger)}>Replay placement ↻</button></div>}<div className="finish-options">{[['Platinum','#e4e1dc'],['Gold','#d7ac59'],['Rose gold','#c78e79']].map(([n,c])=><button key={n} aria-pressed={finish===n} onClick={()=>{setFinish(n!);api.current?.finish(c!);}}><i style={{background:c}}/>{n}</button>)}</div><div className="explorer-actions"><button onClick={()=>{setSpinning(!spinning);api.current?.spin(!spinning);}}>{spinning?'Pause':'Auto-spin'}</button><button onClick={()=>api.current?.reset()}>Reset view</button></div><p className="explorer-disclaimer">{tryOn?'Illustrative 3D styling, not sizing. Hand: Elena FF · CC BY-SA 4.0.':'Product-inspired 3D reconstruction; fine details differ from the photograph.'}</p>{tryOn&&<a className="hand-credit" href="https://sketchfab.com/3d-models/rigged-hand-eae97cc2a742413cb5338ab942b12c1e" target="_blank" rel="noreferrer">Hand model & license ↗</a>}</div>}{failed&&onClose&&<button className="explorer-return" onClick={onClose}>Return to studio</button>}</div>;
}
