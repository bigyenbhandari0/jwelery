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
  const box = smooth((progress - .19) / .08);
  const pair = smooth((progress - .40) / .08);
  const closeup = smooth((progress - .58) / .15);
  const hand = smooth((progress - .80) / .12);
  return (
    <section ref={section} id="top" className="jewel-film">
      <div className="jewel-film-stage">
        <div className="film-panel film-dark" style={{opacity:1-box}} aria-hidden={box===1}>
          <img className="film-hero-ring" src={fallbackImage} alt="Pink heart gemstone ring" fetchPriority="high" style={{transform:`scale(${1+progress*.7}) translateY(${-progress*30}px)`}} />
          <div className="film-intro"><p className="eyebrow">AUREN — Fine Jewellery</p><h1>Rare by nature.</h1><a href="#collection" tabIndex={box===1?-1:0} className="eyebrow link-line">Explore the collection</a></div>
        </div>
        <div className="film-panel film-box" style={{opacity:box*(1-pair)}} aria-hidden={box===0||pair===1}>
          <div className="film-editorial"><p className="eyebrow">An extraordinary gesture</p><h2>Luxury.<br/>With love.<br/><em>For you.</em></h2></div>
          <img src={boxImage} alt="Pink ring in a burgundy presentation box" style={{transform:`translateY(${(1-box)*55}px) scale(${.94+box*.06})`}} />
        </div>
        <div className="film-panel film-dark film-pair" style={{opacity:pair*(1-hand)}} aria-hidden={pair===0||hand===1}>
          <div className="film-piece film-left" style={{opacity:1-closeup,transform:`translateX(${-closeup*100}px)`}}><p>Marquise Noble</p><img src={ornateImage} alt="Marquise Noble diamond ring" /></div>
          <div className="film-piece film-right" style={{left:`${50-closeup*25}%`,width:`${50+closeup*50}%`}}><p style={{opacity:1-closeup}}>Eternity</p><img src={squareImage} alt="Eternity ring" style={{transform:`scale(${.9+closeup*.4})`}} /></div>
          <p className="film-eternity" style={{opacity:closeup}}>Eternity</p>
        </div>
        <div className="film-panel film-hand" style={{opacity:hand}} aria-hidden={hand===0}>
          <div><p className="eyebrow">A moment. Forever.</p><h2>Eternity</h2><a href="#collection" tabIndex={hand>.9?0:-1} className="eyebrow link-line">Discover the pieces</a></div>
          <img src={handImage} alt="Hand wearing the Eternity ring" style={{transform:`translateY(${(1-hand)*65}px)`}} />
        </div>
        <p className="film-scroll eyebrow" style={{opacity:1-smooth(progress/.1)}}>Scroll to unfold ↓</p>
      </div>
    </section>
  );
}
