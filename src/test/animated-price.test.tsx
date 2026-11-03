import {render,screen,act,cleanup} from '@testing-library/react';
import {afterEach,describe,it,expect,vi} from 'vitest';
import {AnimatedPrice} from '@/components/auren/AnimatedPrice';
describe('price entrances',()=>{
 afterEach(()=>{cleanup();vi.unstubAllGlobals();});
 it('keeps the exact accessible price while revealing digits when visible',()=>{
  let reveal:(entries:unknown[])=>void=()=>{};const disconnect=vi.fn();vi.stubGlobal('matchMedia',()=>({matches:false}));
  vi.stubGlobal('IntersectionObserver',class{constructor(fn:typeof reveal){reveal=fn;}observe(){}disconnect=disconnect;});
  const {container}=render(<AnimatedPrice value={485000}/>);expect(screen.getByLabelText('NPR 4,85,000')).toBeTruthy();expect(container.firstChild).not.toHaveClass('is-visible');
  act(()=>reveal([{isIntersecting:true}]));expect(container.firstChild).toHaveClass('is-visible');expect(disconnect).toHaveBeenCalled();
 });
 it('shows the price immediately with reduced motion',()=>{vi.stubGlobal('matchMedia',()=>({matches:true}));const {container}=render(<AnimatedPrice value={215000}/>);expect(container.firstChild).toHaveClass('is-visible');expect(screen.getByLabelText('NPR 2,15,000')).toBeTruthy();});
});
