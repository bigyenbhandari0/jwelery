import { useEffect, useRef, useState } from 'react';
import handImage from '@/assets/hand-ring.jpg';
import fallbackImage from '@/assets/heart-ring.jpg';
import boxImage from '@/assets/ring-box.jpg';
import squareImage from '@/assets/square-ring.jpg';
import ornateImage from '@/assets/ornate-ring.jpg';

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => { const t = clamp(v); return t*t*(3-2*t); };

/** Photographic campaign sequence: original jewelry imagery with scroll compositing. */
export function CinematicScene() {
  const section = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const ready = false;
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
  const boxText=progress>.27&&progress<.46;
  return (
    <section ref={section} id="top" className="three-story photo-story">
      <div className="three-sticky">
        {!ready&&<div className="scene-fallback" style={{background:progress>.22&&progress<.45?'#f6f4f1':'#080808'}}>
          <img src={fallbackImage} alt="Pink heart gemstone ring" style={{opacity:1-smooth((progress-.18)/.09),transform:`translate(-50%,-50%) scale(${1.1-progress*1.5}) rotate(${progress*35}deg)`}} />
          <img src={boxImage} alt="Ring inside a burgundy presentation box" style={{opacity:smooth((progress-.2)/.07)*(1-smooth((progress-.43)/.06)),transform:`translate(-50%,-50%) scale(${.7+smooth((progress-.2)/.12)*.3})`,left:'65%'}} />
          <img src={ornateImage} alt="Marquise diamond ring" style={{opacity:smooth((progress-.44)/.05)*(1-smooth((progress-.58)/.08)),left:'28%',transform:`translate(-50%,-50%) scale(.68)`}} />
          <img src={squareImage} alt="Eternity ring close-up" style={{left:`${72-smooth((progress-.55)/.15)*22}%`,opacity:smooth((progress-.47)/.07)*(1-smooth((progress-.83)/.08)),transform:`translate(-50%,-50%) scale(${.7+smooth((progress-.55)/.2)*.6}) rotate(${(progress-.65)*18}deg)`}} />
        </div>}

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
