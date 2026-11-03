import {render,screen,fireEvent,act,cleanup} from '@testing-library/react';
import {beforeEach,afterEach,describe,it,expect,vi} from 'vitest';
import {SolitaireVideo} from '@/components/auren/SolitaireVideo';
let intersect:(e:{isIntersecting:boolean}[])=>void;
const disconnect=vi.fn();
beforeEach(()=>{document.documentElement.setAttribute('data-auren-intro','skip');vi.stubGlobal('matchMedia',()=>({matches:false,addEventListener:vi.fn(),removeEventListener:vi.fn()}));vi.stubGlobal('IntersectionObserver',class{constructor(callback:typeof intersect){intersect=callback;}observe(){}disconnect=disconnect;});vi.spyOn(HTMLMediaElement.prototype,'play').mockResolvedValue();vi.spyOn(HTMLMediaElement.prototype,'pause').mockImplementation(()=>{});vi.spyOn(HTMLMediaElement.prototype,'load').mockImplementation(()=>{});});
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.unstubAllGlobals();document.documentElement.removeAttribute('data-auren-intro');});
describe('lightweight solitaire film',()=>{
 it('does not attach or download video before it is visible',()=>{const {container}=render(<SolitaireVideo/>);expect(container.querySelector('source')).toBeNull();expect(container.querySelector('video')?.preload).toBe('none');expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();});
 it('plays when visible and pauses after leaving the viewport',async()=>{render(<SolitaireVideo/>);await act(async()=>intersect([{isIntersecting:true}]));expect(document.querySelector('source')?.getAttribute('src')).toBe('/films/atelier-solitaire.mp4');expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();act(()=>intersect([{isIntersecting:false}]));expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();expect(screen.getByRole('button',{name:'Play ring film'})).toBeTruthy();});
 it('requires an explicit play with reduced motion',async()=>{vi.stubGlobal('matchMedia',()=>({matches:true,addEventListener:vi.fn(),removeEventListener:vi.fn()}));render(<SolitaireVideo/>);act(()=>intersect([{isIntersecting:true}]));expect(document.querySelector('source')).toBeNull();await act(async()=>fireEvent.click(screen.getByRole('button',{name:'Play ring film'})));expect(document.querySelector('source')).toBeTruthy();expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();});
});
