import type {ReactNode} from 'react';
import {render,screen,fireEvent,cleanup,within} from '@testing-library/react';
import {afterEach,beforeEach,describe,it,expect,vi} from 'vitest';
vi.mock('@tanstack/react-router',()=>({Link:({children,className,onClick,to,params,hash}:{children:ReactNode;className?:string;onClick?:()=>void;to:string;params?:{productId:string};hash?:string})=><a className={className} onClick={onClick} href={params?`/pieces/${params.productId}`:`${to}${hash?'#'+hash:''}`}>{children}</a>}));
import {RunwayGallery} from '@/components/auren/RunwayGallery';
beforeEach(()=>{localStorage.clear();document.documentElement.setAttribute('data-auren-intro','skip');});
afterEach(()=>{cleanup();document.documentElement.removeAttribute('data-auren-intro');});
describe('editorial gallery',()=>{
 it('opens a selected piece, reveals its details and saves the same piece',()=>{render(<RunwayGallery onReplay={()=>{}}/>);fireEvent.click(screen.getByRole('button',{name:'Explore Rosé Cœur'}));const dialog=screen.getByRole('dialog');expect(within(dialog).getByRole('img',{name:'Rosé Cœur'})).toBeTruthy();fireEvent.click(within(dialog).getByRole('button',{name:'Show piece details'}));fireEvent.click(within(dialog).getByRole('button',{name:'Add to your tray +'}));expect(JSON.parse(localStorage.getItem('auren-private-tray')||'[]')[0].id).toBe('coeur');expect(within(dialog).getByRole('link',{name:'Details & personal enquiry ↗'}).getAttribute('href')).toBe('/pieces/coeur');fireEvent.click(within(dialog).getByRole('button',{name:'Close private edit'}));expect(screen.queryByRole('dialog')).toBeNull();});
 it('changes the product photo and name together with gallery arrows',()=>{render(<RunwayGallery onReplay={()=>{}}/>);fireEvent.click(screen.getByRole('button',{name:'Explore Rosé Cœur'}));const dialog=screen.getByRole('dialog');fireEvent.click(within(dialog).getByRole('button',{name:'Next piece'}));expect(within(dialog).getByRole('img',{name:'Marquise Noble'})).toBeTruthy();fireEvent.click(within(dialog).getByRole('button',{name:'Previous piece'}));expect(within(dialog).getByRole('img',{name:'Rosé Cœur'})).toBeTruthy();});
});
