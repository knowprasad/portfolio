'use client';
import {useSyncExternalStore} from 'react';
import {normalizeTheme,phaseForHour,type ThemeMode} from './theme';
let transitioning=false;
const notify=()=>window.dispatchEvent(new Event('portfolio-theme'));
function applyMode(mode:ThemeMode) {
  const root=document.documentElement;
  const phase=phaseForHour(new Date().getHours());
  root.dataset.themeMode=mode;
  root.dataset.themePhase=mode==='auto'?phase:'';
  root.dataset.theme=mode==='auto'?(phase==='night'?'dark':'light'):mode;
  notify();
}
export function selectTheme(mode:ThemeMode,origin?:HTMLElement) {
  if(transitioning)return;
  try{localStorage.setItem('portfolio-theme',mode);}catch{/* Selection still works without storage. */}
  const root=document.documentElement;
  const current=`${root.dataset.theme}:${root.dataset.themePhase}`;
  const phase=mode==='auto'?phaseForHour(new Date().getHours()):'';
  const next=`${mode==='auto'?(phase==='night'?'dark':'light'):mode}:${phase}`;
  if(current===next||!document.startViewTransition||matchMedia('(prefers-reduced-motion: reduce)').matches){applyMode(mode);return;}
  const rect=origin?.getBoundingClientRect();
  const x=rect?rect.left+rect.width/2:innerWidth/2,y=rect?rect.top+rect.height/2:36;
  const radius=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
  transitioning=true;
  try {
    const transition=document.startViewTransition(()=>applyMode(mode));
    void transition.ready.then(()=>{root.animate({clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${radius}px at ${x}px ${y}px)`]},{duration:900,easing:'cubic-bezier(.32,.72,0,1)',fill:'both',pseudoElement:'::view-transition-new(root)'});}).catch(()=>{});
    void transition.finished.finally(()=>{transitioning=false;}).catch(()=>{});
  }catch{transitioning=false;applyMode(mode);}
}
let subscriptions=0;
function syncStorage(event:StorageEvent) {
  if(event.key==='portfolio-theme'||event.key===null)applyMode(normalizeTheme(event.newValue));
}
function subscribe(callback:()=>void) {
  window.addEventListener('portfolio-theme',callback);
  if(subscriptions++===0)window.addEventListener('storage',syncStorage);
  return()=>{window.removeEventListener('portfolio-theme',callback);if(--subscriptions===0)window.removeEventListener('storage',syncStorage);};
}
const snapshot=()=>`${document.documentElement.dataset.themeMode||'auto'}:${document.documentElement.dataset.themePhase||''}`;
export function useThemePreference() {
  const value=useSyncExternalStore(subscribe,snapshot,()=> 'auto:');
  const [mode,phase]=value.split(':');
  return {mode:normalizeTheme(mode),phase};
}
