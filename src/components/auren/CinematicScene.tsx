import { useEffect, useRef } from 'react';
import ring from '@/assets/heart-ring.jpg';

/** Perspective product display with native browser compositing, no WebGL dependency. */
export function CinematicScene() {
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
        el.style.setProperty('--rx', `${-(clientY-r.top-r.height/2)/r.height*9}deg`);
        el.style.setProperty('--ry', `${(clientX-r.left-r.width/2)/r.width*12}deg`);
      });
    };
    const reset = () => { cancelAnimationFrame(frame); el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg'); };
    el.addEventListener('pointermove',move);el.addEventListener('pointerleave',reset);
    return () => {cancelAnimationFrame(frame);el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',reset);};
  },[]);
  return <section id="top" className="maison-hero">
    <div className="maison-hero-copy">
      <p className="eyebrow hero-arrive">THE FIRST COLLECTION · AUREN</p>
      <h1 className="hero-arrive">Some things<br/>are <em>forever.</em></h1>
      <p className="hero-description hero-arrive">Extraordinary stones. Quiet confidence.<br/>Jewellery for the moments that become you.</p>
      <a href="#collection" className="maison-button hero-arrive">Discover the collection <span aria-hidden="true">↗</span></a>
      <div className="hero-edition hero-arrive"><span>01 / 05</span><span>ROSÉ CŒUR<br/><small>THE SIGNATURE EDIT</small></span></div>
    </div>
    <div ref={display} className="maison-display" aria-label="Jewelry display with dimensional metallic sculpture">
      <div className="sculpture" aria-hidden="true"><div className="sculpture-ring sculpture-one"/><div className="sculpture-ring sculpture-two"/><div className="sculpture-ring sculpture-three"/></div>
      <div className="jewel-plane"><img src={ring} width={1024} height={1024} alt="Rosé Cœur, a pink heart gemstone ring with silver pavé shoulders" fetchPriority="high"/></div>
      <span className="display-note">A STUDY IN LIGHT & FORM</span>
    </div>
    <span className="hero-side-label" aria-hidden="true">EST. IN IMAGINATION — DESIGNED TO ENDURE</span>
    <div className="hero-baseline"><span>FINE JEWELLERY / VOL. I</span><a href="#story">Our world <span aria-hidden="true">↓</span></a></div>
  </section>;
}
