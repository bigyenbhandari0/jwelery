import { useEffect, useRef, useState } from 'react';
import handImage from '@/assets/hand-ring.jpg';
import fallbackImage from '@/assets/heart-ring.jpg';
import boxImage from '@/assets/ring-box.jpg';
import squareImage from '@/assets/square-ring.jpg';

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => { const t = clamp(v); return t*t*(3-2*t); };

/** Original procedural jewelry models; Three.js is loaded only on the client. */
export function CinematicScene() {
  const host = useRef<HTMLDivElement>(null);
  const section = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = section.current?.getBoundingClientRect();
      if (r) setProgress(clamp(-r.top / Math.max(1, r.height - window.innerHeight)));
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', scroll);
    update();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', scroll); window.removeEventListener('resize', scroll); };
  }, []);
  useEffect(() => {
    let stop = false;
    let cleanup = () => {};
    import('three').then(async (T) => {
      if (stop || !host.current) return;
      const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
      if (stop || !host.current) return;
      let renderer: InstanceType<typeof T.WebGLRenderer>;
      try { renderer = new T.WebGLRenderer({antialias:true, alpha:true, powerPreference:'high-performance'}); }
      catch { return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
      host.current.appendChild(renderer.domElement);
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(35, 1, .1, 100);
      camera.position.set(0, .4, 9);
      const pmrem = new T.PMREMGenerator(renderer);
      const room = new RoomEnvironment();
      const environment = pmrem.fromScene(room, .04);
      scene.environment = environment.texture;
      room.dispose();
      const silver = new T.MeshStandardMaterial({color:0xe5e3e3, metalness:1, roughness:.16, envMapIntensity:2});
      const pink = new T.MeshPhysicalMaterial({color:0xff5cba, metalness:0, roughness:.05, transmission:.32, thickness:.5, ior:2.2, clearcoat:1, flatShading:true, envMapIntensity:2.5});
      const clear = new T.MeshPhysicalMaterial({color:0xffffff, roughness:.03, metalness:.15, transmission:.3, thickness:.2, ior:2.2, flatShading:true});
      const velvet = new T.MeshPhysicalMaterial({color:0x651c37, roughness:.85, sheen:1, sheenColor:0x9d4168});
      const lining = new T.MeshStandardMaterial({color:0xeadccf, roughness:.95});
      const black = new T.MeshStandardMaterial({color:0x101015, roughness:.22, metalness:.65});
      const mesh = (g: ConstructorParameters<typeof T.Mesh>[0], m: InstanceType<typeof T.Material>, parent: InstanceType<typeof T.Object3D>, x=0,y=0,z=0) => {
        const o=new T.Mesh(g,m); o.position.set(x,y,z); parent.add(o); return o;
      };
      const ring = (heart: boolean) => {
        const root = new T.Group();
        mesh(new T.TorusGeometry(.88,.105,16,96),silver,root);
        // Faceted, multi-tier crown and stone set above the band.
        if (heart) {
          const shape = new T.Shape();
          shape.moveTo(0,-.45);
          shape.bezierCurveTo(-.18,-.2,-.65,.05,-.65,.35);
          shape.bezierCurveTo(-.65,.78,-.15,.88,0,.52);
          shape.bezierCurveTo(.15,.88,.65,.78,.65,.35);
          shape.bezierCurveTo(.65,.05,.18,-.2,0,-.45);
          const geo = new T.ExtrudeGeometry(shape,{depth:.19, bevelEnabled:true, bevelSize:.12, bevelThickness:.17, bevelSegments:1, curveSegments:5});
          geo.center();
          const stone=mesh(geo,pink,root,0,.78,.22); stone.scale.setScalar(.85);
          const mount=mesh(geo,silver,root,0,.78,.06);mount.scale.set(.9,.9,.5);
          for(const x of [-.48,.48]) for(const y of [.65,1.1]) mesh(new T.SphereGeometry(.055,12,8),silver,root,x,y,.48);
        } else {
          const frame=mesh(new T.BoxGeometry(.97,.97,.3),silver,root,0,.85,.15);frame.rotation.z=Math.PI/12;
          const face=mesh(new T.BoxGeometry(.8,.8,.33),black,root,0,.85,.2);face.rotation.z=Math.PI/12;
          const gem=mesh(new T.OctahedronGeometry(.38,0),clear,root,0,.85,.5);gem.rotation.set(.3,.2,.2);
        }
        for(let i=0;i<28;i++) {
          const a=(i/28)*Math.PI*2;
          const gem=mesh(new T.OctahedronGeometry(.065,0),clear,root,Math.cos(a)*.89,Math.sin(a)*.89,.11);
          gem.rotation.z=a;
        }
        return root;
      };
      const rose=ring(true); scene.add(rose);
      const eternity=ring(false);scene.add(eternity);
      const box=new T.Group();scene.add(box);
      mesh(new T.CylinderGeometry(1.42,1.29,.66,64),velvet,box,0,-.85,0);
      mesh(new T.CylinderGeometry(1.32,1.32,.08,64),silver,box,0,-.48,0);
      mesh(new T.CylinderGeometry(1.25,1.25,.11,64),lining,box,0,-.42,0);
      const lidPivot=new T.Group();lidPivot.position.set(0,-.48,-1.22);box.add(lidPivot);
      mesh(new T.CylinderGeometry(1.42,1.42,.33,64),velvet,lidPivot,0,.18,1.22);
      mesh(new T.CylinderGeometry(1.27,1.27,.04,64),lining,lidPivot,0,-.01,1.22);
      // A narrow slot in the cushion seats the ring.
      mesh(new T.BoxGeometry(.95,.018,.075),velvet,box,0,-.35,.1);
      scene.add(new T.HemisphereLight(0xffffff,0x5d3348,2));
      for(const [x,y,z,power] of [[-4,5,5,65],[4,2,3,55],[0,4,-4,70]] as const) {
        const light=new T.PointLight(0xffffff,power); light.position.set(x,y,z);scene.add(light);
      }
      const resize=()=> { if(!host.current)return; const w=host.current.clientWidth,h=host.current.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix(); };
      const observer=new ResizeObserver(resize);observer.observe(host.current);resize();
      const media=window.matchMedia('(prefers-reduced-motion: reduce)');
      let target=0,current=0,raf=0,visible=true;
      const readScroll=()=> {const r=section.current?.getBoundingClientRect();if(r)target=clamp(-r.top/(r.height-window.innerHeight));};
      const visibility=new IntersectionObserver(([entry])=>{visible=entry?.isIntersecting ?? false;}); visibility.observe(section.current!);
      const render=()=> {
        raf=requestAnimationFrame(render);
        if(!visible)return;
        current=media.matches?target:current+(target-current)*.085;
        const p=current;

        const enter=smooth((p-.12)/.24),pair=smooth((p-.43)/.12),zoom=smooth((p-.59)/.15),hand=smooth((p-.82)/.15);
        const mobile=camera.aspect<.8;
        scene.background=new T.Color().setRGB(.002,.002,.002).lerp(new T.Color('#f6f4f1'),enter*(1-pair)+hand);
        rose.visible=p<.68;
        rose.position.set(enter*(mobile?0:1.55)*(1-pair)-pair*1.65, .1-enter*.16-pair*.1,0);
        rose.scale.setScalar((1.8-enter*1.25)*(1-pair)+pair*.8);
        rose.rotation.set(-.15-enter*.3,p<.12?-.45+p*5: .15+enter*.35+pair*.4,-.08+enter*.1);
        box.visible=p>.12&&p<.56;
        box.position.set(mobile?0:1.55,mobile?-.45:-.1,0);
        box.scale.setScalar(enter*(1-pair)*.95);
        box.rotation.set(.25,.15,0);
        lidPivot.rotation.x=-smooth((p-.18)/.13)*1.95;
        eternity.visible=p>.43;
        eternity.position.set((1-zoom)*(mobile?.65:1.65),-.05-hand*.2,0);
        eternity.scale.setScalar((.8+zoom*.95)*(1-hand*.8)*pair);
        eternity.rotation.set(-.13+hand*.2,-.65+zoom*.8+hand*.8,.12-zoom*.12);
        if(host.current)host.current.style.opacity=String(1-hand);
        renderer.render(scene,camera);
      };
      window.addEventListener('scroll',readScroll,{passive:true});readScroll();render();setReady(true);
      cleanup=()=>{cancelAnimationFrame(raf);observer.disconnect();visibility.disconnect();window.removeEventListener('scroll',readScroll);scene.traverse(o=>{if(o instanceof T.Mesh)o.geometry.dispose();});[silver,pink,clear,velvet,lining,black].forEach(m=>m.dispose());environment.dispose();pmrem.dispose();renderer.dispose();renderer.domElement.remove();};
    }).catch(()=>{});
    return()=>{stop=true;cleanup();};
  },[]);
  const boxText=progress>.27&&progress<.46;
  return (
    <section ref={section} id="top" className={`three-story ${ready?'three-ready':''}`}>
      <div className="three-sticky">
        {!ready&&<div className="scene-fallback" style={{background:progress>.22&&progress<.45?'#f6f4f1':'#080808'}}>
          <img src={fallbackImage} alt="Pink heart gemstone ring" style={{opacity:1-smooth((progress-.18)/.09),transform:`translate(-50%,-50%) scale(${1.1-progress*1.5}) rotate(${progress*35}deg)`}} />
          <img src={boxImage} alt="Ring inside a burgundy presentation box" style={{opacity:smooth((progress-.2)/.07)*(1-smooth((progress-.43)/.06)),transform:`translate(-50%,-50%) scale(${.7+smooth((progress-.2)/.12)*.3})`,left:'65%'}} />
          <img src={squareImage} alt="Eternity ring close-up" style={{opacity:smooth((progress-.47)/.07)*(1-smooth((progress-.83)/.08)),transform:`translate(-50%,-50%) scale(${.7+smooth((progress-.55)/.2)*.6}) rotate(${(progress-.65)*18}deg)`}} />
        </div>}
        <div ref={host} className="three-canvas" role="img" aria-label="Animated silver heart ring rotating into an opening burgundy presentation box, followed by the Eternity ring" />
        <div className="three-intro" style={{opacity:1-smooth((progress-.08)/.09)}}><p className="eyebrow">AUREN — Fine Jewellery</p><h1>Rare by nature.</h1><a href="#collection" className="eyebrow link-line">Explore the collection</a></div>
        <div className="three-editorial" style={{opacity:boxText?smooth((progress-.27)/.05):0,transform:`translateY(${(1-smooth((progress-.27)/.06))*40}px)`}} aria-hidden={!boxText}><p className="eyebrow">An extraordinary gesture</p><h2>Luxury.<br/>With love.<br/><em>For you.</em></h2></div>
        <div className="three-collection-label" style={{opacity:smooth((progress-.46)/.03)*(1-smooth((progress-.57)/.03))}}><span>Rosé Cœur</span><span>Eternity</span></div>
        <p className="three-eternity-label" style={{opacity:smooth((progress-.66)/.06)*(1-smooth((progress-.79)/.04))}}>Eternity</p>
        <div className="three-hand" style={{opacity:smooth((progress-.83)/.1),transform:`translateY(${(1-smooth((progress-.83)/.13))*80}px)`}}><div><p className="eyebrow">A moment. Forever.</p><h2>Eternity</h2><a href="#collection" tabIndex={progress>.9?0:-1} style={{pointerEvents:progress>.9?"auto":"none"}} className="eyebrow link-line">Discover the pieces</a></div><img src={handImage} alt="Hand wearing the Eternity ring"/></div>
        <p className="three-scroll eyebrow" style={{opacity:1-smooth(progress/.1)}}>Scroll to unfold ↓</p>
      </div>
    </section>
  );
}
