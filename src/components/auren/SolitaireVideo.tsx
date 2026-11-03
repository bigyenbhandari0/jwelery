import {useEffect,useRef,useState} from 'react';
export const SOLITAIRE_VIDEO='/films/atelier-solitaire.mp4';
export const SOLITAIRE_POSTER='/films/atelier-solitaire.webp';
/** Native video decoding, no canvas, animation loop, WebGL or hidden downloads. */
export function SolitaireVideo({label='Atelier Solitaire rotating on a studio display'}:{label?:string}){
 const video=useRef<HTMLVideoElement>(null),shouldPlay=useRef(false);const [loaded,setLoaded]=useState(false),[playing,setPlaying]=useState(false);
 useEffect(()=>{
  const el=video.current;if(!el)return;let visible=false,manualPause=false;const motion=matchMedia('(prefers-reduced-motion: reduce)');const connection=(navigator as Navigator&{connection?:{saveData?:boolean}}).connection;
  const sync=()=>{if(visible&&!document.hidden&&document.documentElement.getAttribute('data-auren-intro')==='skip'&&!motion.matches&&!connection?.saveData&&!manualPause){shouldPlay.current=true;setLoaded(true);void el.play().then(()=>setPlaying(true)).catch(()=>setPlaying(false));}else{shouldPlay.current=false;el.pause();setPlaying(false);}};
  const io=new IntersectionObserver(([e])=>{visible=!!e?.isIntersecting;sync();},{threshold:.15});io.observe(el);
  const stop=()=>{shouldPlay.current=false;el.pause();setPlaying(false);};document.addEventListener('visibilitychange',sync);window.addEventListener('auren-intro-complete',sync);window.addEventListener('auren-intro-start',stop);motion.addEventListener('change',sync);
  const toggle=()=>{manualPause=!el.paused;shouldPlay.current=!manualPause;if(manualPause){el.pause();setPlaying(false);}else{setLoaded(true);void el.play().then(()=>setPlaying(true)).catch(()=>setPlaying(false));}};
  el.addEventListener('auren-toggle-film',toggle);
  return()=>{io.disconnect();el.pause();document.removeEventListener('visibilitychange',sync);window.removeEventListener('auren-intro-complete',sync);window.removeEventListener('auren-intro-start',stop);motion.removeEventListener('change',sync);el.removeEventListener('auren-toggle-film',toggle);};
 },[]);
 useEffect(()=>{if(loaded&&video.current){video.current.load();if(shouldPlay.current)void video.current.play().then(()=>setPlaying(true)).catch(()=>setPlaying(false));}},[loaded]);
 return <div className="solitaire-video"><video ref={video} aria-label={label} muted loop playsInline preload="none" poster={SOLITAIRE_POSTER} onError={()=>setPlaying(false)}>{loaded&&<source src={SOLITAIRE_VIDEO} type="video/mp4"/>}</video><button className="film-play-toggle" aria-label={playing?'Pause ring film':'Play ring film'} onClick={()=>video.current?.dispatchEvent(new Event('auren-toggle-film'))}>{playing?'Pause Ⅱ':'Play ▷'}</button></div>;
}
