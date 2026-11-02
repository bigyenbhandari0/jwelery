import { useEffect, useRef, useState } from 'react';

export function RingExplorer({ onClose }: { onClose: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<{ finish:(color:string)=>void; reset:()=>void; spin:(v:boolean)=>void } | null>(null);
  const [status,setStatus] = useState('Loading the atelier…');
  const [failed,setFailed] = useState(false);
  const [spinning,setSpinning] = useState(false);
  const [finish,setFinish] = useState('Platinum');
  useEffect(()=>{
    let cancelled=false,dispose=()=>{};
    const init=async()=>{
      const [T,{GLTFLoader},{OrbitControls},{RoomEnvironment}]=await Promise.all([import('three'),import('three/addons/loaders/GLTFLoader.js'),import('three/addons/controls/OrbitControls.js'),import('three/addons/environments/RoomEnvironment.js')]);
      if(cancelled||!host.current)return;
      const renderer=new T.WebGLRenderer({antialias:true,alpha:true});
      renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
      host.current.appendChild(renderer.domElement);
      const scene=new T.Scene(),camera=new T.PerspectiveCamera(34,1,.01,100);
      const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.enableZoom=false;
      const pmrem=new T.PMREMGenerator(renderer),room=new RoomEnvironment(),env=pmrem.fromScene(room,.04);room.dispose();scene.environment=env.texture;
      scene.add(new T.HemisphereLight(0xffffff,0x8c7161,2));
      const light=new T.DirectionalLight(0xffffff,3);light.position.set(2,4,5);scene.add(light);
      let raf=0,visible=true;
      const resize=()=>{if(!host.current)return;renderer.setSize(host.current.clientWidth,host.current.clientHeight);camera.aspect=host.current.clientWidth/host.current.clientHeight;camera.updateProjectionMatrix();};
      const ro=new ResizeObserver(resize);ro.observe(host.current);resize();
      const io=new IntersectionObserver(([e])=>{visible=e?.isIntersecting??false;});io.observe(host.current);
      const materials: InstanceType<typeof T.MeshStandardMaterial>[]=[];
      const animate=()=>{raf=requestAnimationFrame(animate);if(!visible)return;controls.update();renderer.render(scene,camera);};
      dispose=()=>{cancelAnimationFrame(raf);ro.disconnect();io.disconnect();controls.dispose();scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>m.dispose());}});env.dispose();pmrem.dispose();renderer.dispose();renderer.domElement.remove();api.current=null;};
      const model=await new GLTFLoader().loadAsync('https://raw.githubusercontent.com/ehsanwwe/diamond-shader-lab/edd718e34c081d3ea0f6c99017b87cf8d022f329/public/models/diamond-ring.glb');
      if(cancelled){model.scene.traverse(o=>{if(o instanceof T.Mesh)o.geometry.dispose();});return;}
      const bounds=new T.Box3().setFromObject(model.scene),center=bounds.getCenter(new T.Vector3()),size=bounds.getSize(new T.Vector3());
      model.scene.position.sub(center);const root=new T.Group();root.add(model.scene);root.scale.setScalar(2.8/Math.max(size.x,size.y,size.z));scene.add(root);
      model.scene.traverse(o=>{if(o instanceof T.Mesh){const original=Array.isArray(o.material)?o.material[0]:o.material;const gem=/diamond|stone|gem/i.test(`${o.name} ${original?.name}`);if(gem){o.material=new T.MeshPhysicalMaterial({color:0xffffff,roughness:.04,metalness:.05,transmission:.65,thickness:.3,ior:2.3,clearcoat:1,envMapIntensity:2});}else{const m=new T.MeshStandardMaterial({color:0xe7e5e1,metalness:1,roughness:.14,envMapIntensity:1.8});o.material=m;materials.push(m);}}});
      const reset=()=>{camera.position.set(3,2.3,5.5);controls.target.set(0,0,0);controls.update();};reset();
      api.current={finish:(color)=>materials.forEach(m=>m.color.set(color)),reset,spin:v=>{controls.autoRotate=v;controls.autoRotateSpeed=1.3;}};
      setStatus('');animate();
    };
    init().catch(()=>{if(!cancelled){dispose();setFailed(true);setStatus('3D is unavailable in this browser. You can still explore the photographic collection.');}});
    return()=>{cancelled=true;dispose();};
  },[]);
  return <div className="ring-explorer"><div ref={host} className="ring-explorer-stage" aria-label="Interactive diamond ring. Drag to rotate." />
    {status&&<p className="explorer-status" role="status">{status}</p>}
    <button className="explorer-close" onClick={onClose}>← Back to Rosé Cœur</button>
    {!status&&<div className="explorer-tools"><p className="eyebrow">THE DIAMOND ATELIER · DRAG TO ROTATE</p><div className="finish-options">{[['Platinum','#e7e5e1'],['Gold','#dbb76a'],['Rose gold','#ce9683']].map(([name,color])=><button key={name} aria-pressed={finish===name} onClick={()=>{setFinish(name!);api.current?.finish(color!);}}><i style={{background:color}}/>{name}</button>)}</div><div className="explorer-actions"><button onClick={()=>{setSpinning(!spinning);api.current?.spin(!spinning);}}>{spinning?'Pause rotation':'Auto-spin'}</button><button onClick={()=>api.current?.reset()}>Reset view</button></div><p className="explorer-disclaimer">Interactive round-diamond design study · separate from Rosé Cœur</p></div>}
    {failed&&<button className="explorer-return" onClick={onClose}>Return to collection</button>}
  </div>;
}
