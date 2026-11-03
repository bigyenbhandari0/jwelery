import { renderToString } from 'react-dom/server';
import { render,screen,fireEvent,act,cleanup } from '@testing-library/react';
import { afterEach,beforeEach,describe,expect,it,vi } from 'vitest';
import { BrandIntro } from '@/components/auren/BrandIntro';
const key='auren-ivory-welcome-v3';
describe('ivory welcome',()=>{
 beforeEach(()=>{vi.useFakeTimers();sessionStorage.clear();document.documentElement.removeAttribute('data-auren-intro');document.body.style.overflow='';vi.stubGlobal('matchMedia',()=>({matches:false,addEventListener:vi.fn(),removeEventListener:vi.fn()}));});
 afterEach(()=>{cleanup();vi.useRealTimers();vi.unstubAllGlobals();document.body.style.overflow='';});
 it('renders the covering intro before client effects run',()=>{const markup=renderToString(<BrandIntro/>);expect(markup).toContain('brand-intro playing');expect(markup).toContain('The Art of Being Remembered.');expect(markup).toContain('Enter the maison');});
 it('reveals the page automatically and releases scrolling',()=>{render(<BrandIntro/>);expect(document.body.style.overflow).toBe('hidden');act(()=>vi.advanceTimersByTime(1600));expect(screen.getByRole('dialog').className).toContain('leaving');act(()=>vi.advanceTimersByTime(600));expect(screen.queryByRole('dialog')).toBeNull();expect(document.body.style.overflow).toBe('');expect(sessionStorage.getItem(key)).toBe('seen');});
 it('can be skipped immediately',()=>{render(<BrandIntro/>);fireEvent.click(screen.getByRole('button',{name:'Enter the maison'}));expect(screen.queryByRole('dialog')).toBeNull();expect(document.documentElement.getAttribute('data-auren-intro')).toBe('skip');expect(document.body.style.overflow).toBe('');});
 it('does not replay in the same session',()=>{sessionStorage.setItem(key,'seen');render(<BrandIntro/>);expect(screen.queryByRole('dialog')).toBeNull();expect(document.body.style.overflow).toBe('');});
 it('skips motion for reduced-motion users',()=>{vi.stubGlobal('matchMedia',()=>({matches:true,addEventListener:vi.fn(),removeEventListener:vi.fn()}));render(<BrandIntro/>);expect(screen.queryByRole('dialog')).toBeNull();});
});
