import {useEffect,useRef,useState,type RefObject} from 'react';
import {PRODUCTS} from '@/lib/shop';

type Props={progress:RefObject<number>;onView:()=>void;productMode?:boolean;design?:'coeur'|'band'};
export function SignatureScene({progress,onView,productMode=false,design='coeur'}:Props){
 const host=useRef<HTMLDivElement>(null),reset=useRef<()=>void>(()=>{});const [state,setState]=useState<'loading'|'ready'|'fallback'>('loading');
 useEffect(()=>{
  let stopped=false,dispose=()=>{};
  const init=async()=>{
   const [T,{RoomEnvironment},{createSignatureRing,createPresentationBox,createSignatureBand}]=await Promise.all([import('three'),import('three/addons/environments/RoomEnvironment.js'),import('./SignatureModel')]);
   if(stopped||!host.current)return;
   const renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.25:1.6));renderer.setClearColor(0xf6f2ea,0);renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;renderer.outputColorSpace=T.SRGBColorSpace;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;host.current.appendChild(renderer.domElement);dispose=()=>{renderer.dispose();renderer.domElement.remove();};
   const scene=new T.Scene(),camera=new T.PerspectiveCamera(34,1,.1,50);camera.position.set(0,1.35,7.4);camera.lookAt(0,.15,0);
   const pmrem=new T.PMREMGenerator(renderer),room=new RoomEnvironment(),env=pmrem.fromScene(room,.025);room.dispose();scene.environment=env.texture;
   const light=new T.DirectionalLight(0xfff2df,3);light.position.set(-3,5,4);light.castShadow=true;light.shadow.mapSize.set(512,512);light.shadow.camera.left=-4;light.shadow.camera.right=4;light.shadow.camera.top=4;light.shadow.camera.bottom=-4;light.shadow.bias=-.001;scene.add(light);const edge=new T.DirectionalLight(0xe5edff,2);edge.position.set(4,2,-2);scene.add(edge);scene.add(new T.HemisphereLight(0xfffaf1,0x776958,.65));
   const ring=design==='band'?createSignatureBand():createSignatureRing(),box=createPresentationBox();scene.add(ring,box);scene.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=true;o.receiveShadow=true;}});box.visible=!productMode;
   // All case surfaces use native depth testing and receive the ring shadow.
   let frame=0,visible=true,last=0,entrance=document.documentElement.getAttribute('data-auren-intro')==='skip'?performance.now():Infinity,previous=0,yaw=0,pitch=0,dragging=false,lastX=0,lastY=0,spin=0;
   const reduced=matchMedia('(prefers-reduced-motion: reduce)');
   const start=()=>{entrance=performance.now();spin=0;};const conceal=()=>{entrance=Infinity;};window.addEventListener('auren-intro-complete',start);window.addEventListener('auren-intro-start',conceal);
   const down=(e:PointerEvent)=>{dragging=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId);};
   const move=(e:PointerEvent)=>{if(!dragging)return;yaw+=(e.clientX-lastX)*.007;pitch=T.MathUtils.clamp(pitch+(e.clientY-lastY)*.004,-.4,.4);lastX=e.clientX;lastY=e.clientY;};const up=()=>{dragging=false;};
   renderer.domElement.addEventListener('pointerdown',down);renderer.domElement.addEventListener('pointermove',move);renderer.domElement.addEventListener('pointerup',up);renderer.domElement.addEventListener('pointercancel',up);renderer.domElement.addEventListener('lostpointercapture',up);
   reset.current=()=>{yaw=0;pitch=0;spin=0;};
   const resize=()=>{if(!host.current)return;const w=host.current.clientWidth,h=host.current.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
   const ro=new ResizeObserver(resize);ro.observe(host.current);resize();
   const io=new IntersectionObserver(([e])=>{visible=!!e?.isIntersecting;});io.observe(host.current);
   const contextLost=(e:Event)=>{e.preventDefault();cancelAnimationFrame(frame);visible=false;setState('fallback');};renderer.domElement.addEventListener('webglcontextlost',contextLost);
   dispose=()=>{cancelAnimationFrame(frame);ro.disconnect();io.disconnect();window.removeEventListener('auren-intro-complete',start);window.removeEventListener('auren-intro-start',conceal);renderer.domElement.removeEventListener('webglcontextlost',contextLost);for(const name of ['pointerdown','pointermove','pointerup','pointercancel','lostpointercapture'])renderer.domElement.removeEventListener(name,(name==='pointerdown'?down:name==='pointermove'?move:up) as EventListener);const geometries=new Set<import('three').BufferGeometry>(),materials=new Set<import('three').Material>(),textures=new Set<import('three').Texture>();scene.traverse(o=>{if(o instanceof T.Mesh){geometries.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{materials.add(m);Object.values(m).forEach(v=>{if(v instanceof T.Texture)textures.add(v);});});}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());env.dispose();pmrem.dispose();renderer.dispose();renderer.domElement.remove();};
   await renderer.compileAsync(scene,camera);if(stopped){dispose();return;}
   setState('ready');
   const ease=(x:number)=>x*x*(3-2*x);
   const render=(now:number)=>{
    if(stopped)return;frame=requestAnimationFrame(render);const dt=Math.min(.05,(now-previous)/1000||0);
    if(!visible||document.hidden||now-last<1000/(innerWidth<700?40:60))return;last=now;previous=now;
    const p=productMode?0:ease(Math.max(0,Math.min(1,progress.current))),mobile=host.current!.clientWidth<650;
    const enter=reduced.matches||productMode?1:ease(Math.max(0,Math.min(1,(now-entrance)/1300)));
    if(!dragging&&!reduced.matches&&enter===1)spin+=dt*.25*(1-p);
    ring.visible=enter>0;ring.position.set(mobile?0:p*1.55,.03-(1-enter)*3.6-p*.12,0);ring.scale.setScalar((.25+enter*.75)*(1-p*.38));
    ring.rotation.set(.55+pitch,.55+spin*(1-p)+yaw,0);box.position.set(mobile?0:1.55,-(1-ease(Math.min(1,p*1.4)))*3.5,-.08);box.visible=!productMode&&p>.05;
    // Keep the final pose oriented towards the viewer and inside the actual case.
    renderer.render(scene,camera);
   };
   frame=requestAnimationFrame(render);
  };
  init().catch(()=>{dispose();if(!stopped)setState('fallback');});return()=>{stopped=true;dispose();};
 },[productMode,progress,design]);
 return <div className={`signature-scene ${state}`}><div ref={host} className="signature-canvas" role="img" aria-label="Three-dimensional Rosé Cœur reconstruction. Drag horizontally to turn the ring."/>{state!=='ready'&&<div className="signature-fallback"><img src={PRODUCTS[design].image} alt={`${PRODUCTS[design].name} product photograph`} width={960} height={960}/>{state==='fallback'&&<p>3D isn’t available on this device. Showing the product photograph.</p>}</div>}<div className="signature-scene-controls"><button onClick={()=>reset.current()}>Reset view ↺</button><button onClick={onView}>Photographic details ↗</button></div><span className="signature-model-note">{state==='ready'?'DRAG TO TURN · PRODUCT-INSPIRED 3D RECONSTRUCTION':state==='loading'?'PREPARING THE 3D PRESENTATION':'STUDIO PHOTOGRAPH'}</span></div>;
}
