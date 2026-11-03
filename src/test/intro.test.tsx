import { renderToString } from 'react-dom/server';
import { render,screen,fireEvent,act,cleanup } from '@testing-library/react';
import { afterEach,beforeEach,describe,expect,it,vi } from 'vitest';
import { BrandIntro } from '@/components/auren/BrandIntro';
const key='auren-runway-welcome-v1';
describe('ivory welcome',()=>{
 beforeEach(()=>{vi.useFakeTimers();sessionStorage.clear();document.documentElement.removeAttribute('data-auren-intro');document.body.style.overflow='';vi.stubGlobal('matchMedia',()=>({matches:false,addEventListener:vi.fn(),removeEventListener:vi.fn()}));});
 afterEach(()=>{cleanup();vi.useRealTimers();vi.unstubAllGlobals();document.body.style.overflow='';});
 it('renders the covering intro before client effects run',()=>{const markup=renderToString(<BrandIntro/>);expect(markup).toContain('brand-intro brand-morph playing');expect(markup).toContain('For every version of you.');expect(markup).toContain('Enter the maison');});
 it('reveals the page automatically and releases scrolling',()=>{render(<BrandIntro/>);expect(document.body.style.overflow).toBe('hidden');act(()=>vi.advanceTimersByTime(1100));expect(screen.getByRole('dialog').className).toContain('leaving');act(()=>vi.advanceTimersByTime(900));expect(screen.queryByRole('dialog')).toBeNull();expect(document.body.style.overflow).toBe('');expect(sessionStorage.getItem(key)).toBe('seen');});
 it('can be skipped immediately',()=>{render(<BrandIntro/>);fireEvent.click(screen.getByRole('button',{name:'Enter the maison'}));expect(screen.queryByRole('dialog')).toBeNull();expect(document.documentElement.getAttribute('data-auren-intro')).toBe('skip');expect(document.body.style.overflow).toBe('');act(()=>vi.advanceTimersByTime(3000));expect(screen.queryByRole('dialog')).toBeNull();});
 it('emits one ring entrance when skipped, with no delayed replay',()=>{const complete=vi.fn();window.addEventListener('auren-intro-complete',complete);render(<BrandIntro/>);fireEvent.click(screen.getByRole('button',{name:'Enter the maison'}));act(()=>vi.advanceTimersByTime(5000));expect(complete).toHaveBeenCalledTimes(1);window.removeEventListener('auren-intro-complete',complete);});
 it('allows an explicit replay even after a saved visit or hash navigation',()=>{sessionStorage.setItem(key,'seen');history.replaceState(null,'','#top');render(<BrandIntro replay/>);expect(screen.getByRole('dialog')).toBeTruthy();history.replaceState(null,'','/');});
 it('does not replay in the same session',()=>{sessionStorage.setItem(key,'seen');render(<BrandIntro/>);expect(screen.queryByRole('dialog')).toBeNull();expect(document.body.style.overflow).toBe('');});
 it('skips motion for reduced-motion users',()=>{vi.stubGlobal('matchMedia',()=>({matches:true,addEventListener:vi.fn(),removeEventListener:vi.fn()}));render(<BrandIntro/>);expect(screen.queryByRole('dialog')).toBeNull();});
});
