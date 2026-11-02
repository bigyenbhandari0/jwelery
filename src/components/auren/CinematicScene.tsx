import { Link } from "@tanstack/react-router";
import { RingExplorer } from "./RingExplorer";
import { useEffect, useRef, useState } from 'react';
import ring from '@/assets/heart-ring.jpg';

/** Perspective product display with native browser compositing, no WebGL dependency. */
export function CinematicScene() {
  const [lighting,setLighting]=useState("Studio");
  const [exploring, setExploring] = useState(false);
  const display = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = display.current;
    if (!el || !window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return;
    let frame = 0;
    const move = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      const { clientX, clientY } = event;
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--light-x', `${(clientX-r.left)/r.width*100}%`);
        el.style.setProperty('--light-y', `${(clientY-r.top)/r.height*100}%`);
        el.style.setProperty('--rx', `${-(clientY-r.top-r.height/2)/r.height*9}deg`);
        el.style.setProperty('--ry', `${(clientX-r.left-r.width/2)/r.width*12}deg`);
      });
    };
    const reset = () => { cancelAnimationFrame(frame); el.style.setProperty('--light-x','50%');el.style.setProperty('--light-y','35%');el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg'); };
    el.addEventListener('pointermove',move);el.addEventListener('pointerleave',reset);
    return () => {cancelAnimationFrame(frame);el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',reset);};
  },[]);
  return <section id="top" className="maison-hero">
    <div className="maison-hero-copy">
      <p className="eyebrow hero-arrive">THE SIGNATURE COLLECTION</p>
      <h1 className="hero-arrive">An expression<br/>of <em>eternity.</em></h1>
      <p className="hero-description hero-arrive">Jewellery made to be remembered.<br/>Step inside your private atelier.</p>
      <a href="#discover" className="maison-button hero-arrive">Discover the collection <span aria-hidden="true">↗</span></a>
      <div className="hero-edition hero-arrive"><span>01 / 05</span><span>ROSÉ CŒUR<br/><small>THE SIGNATURE EDIT</small></span></div>
    </div>
    <div ref={display} className={`maison-display showroom-${lighting.toLowerCase()}`} aria-label="Private jewelry showroom">
      {exploring && <RingExplorer onClose={() => setExploring(false)} />}
      <Link to="/pieces/$productId" params={{productId:"coeur"}} className="jewel-plane" aria-label="Discover Rosé Cœur" style={{visibility:exploring?"hidden":"visible"}}><img src={ring} width={1024} height={1024} alt="Rosé Cœur, a pink heart gemstone ring with silver pavé shoulders" fetchPriority="high"/></Link>
      {!exploring && <button className="explore-ring-button" onClick={() => setExploring(true)}>Explore the 3D design study <span aria-hidden="true">↗</span></button>}
      {!exploring && <div className="showroom-lighting" aria-label="Illustrative lighting treatments">{["Studio","Daylight","Evening"].map(l=><button key={l} aria-pressed={lighting===l} onClick={()=>setLighting(l)}>{l}</button>)}<small>Photographic mood study · not a material simulation</small></div>}
      <span className="display-note">A STUDY IN LIGHT & FORM</span>
    </div>
    <span className="hero-side-label" aria-hidden="true">EST. IN IMAGINATION — DESIGNED TO ENDURE</span>
    <div className="hero-baseline"><span>FINE JEWELLERY / VOL. I</span><a href="#story">Our world <span aria-hidden="true">↓</span></a></div>
  </section>;
}
