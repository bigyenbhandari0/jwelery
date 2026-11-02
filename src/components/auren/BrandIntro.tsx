import { useEffect, useState } from 'react';

export function BrandIntro() {
  const [phase, setPhase] = useState<'hidden' | 'playing' | 'leaving'>('playing');
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setPhase('hidden'); return; }
    try { if (sessionStorage.getItem('auren-intro-v1')) { setPhase('hidden'); return; } } catch { /* optional */ }
    setPhase('playing');
    const finish = setTimeout(() => setPhase('leaving'), 1800);
    const hide = setTimeout(() => {
      setPhase('hidden');
      try { sessionStorage.setItem('auren-intro-v1', 'seen'); } catch { /* optional */ }
    }, 2600);
    return () => { clearTimeout(finish); clearTimeout(hide); };
  }, []);
  useEffect(() => {
    if (phase === 'hidden') return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [phase]);
  const skip = () => {
    setPhase('hidden');
    try { sessionStorage.setItem('auren-intro-v1', 'seen'); } catch { /* optional */ }
  };
  if (phase === 'hidden') return null;
  return <div className={`brand-intro ${phase}`} role="dialog" aria-modal="true" aria-label="Welcome to AUREN" onKeyDown={e => { if(e.key==='Escape') skip(); if(e.key==='Tab') e.preventDefault(); }}>
    <div className="intro-orbit" aria-hidden="true" />
    <div className="intro-mark" aria-hidden="true">A</div>
    <p className="intro-word">{'AUREN'.split('').map((letter,i)=><span key={i} style={{animationDelay:`${.15+i*.09}s`}}>{letter}</span>)}</p>
    <p className="intro-caption">THE ART OF THE EXTRAORDINARY</p>
    <div className="intro-rule" aria-hidden="true" />
    <button autoFocus onClick={skip} className="intro-skip">Enter the maison <span aria-hidden="true">↗</span></button>
  </div>;
}
