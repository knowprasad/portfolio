import {normalizeTheme,phaseForHour} from './theme';
// Serialize the same pure resolvers used by the client so first paint cannot drift.
export const themeScript = `(()=>{const normalize=${normalizeTheme.toString()};const phaseForHour=${phaseForHour.toString()};let saved=null;try{saved=localStorage.getItem('portfolio-theme')}catch{}const mode=normalize(saved);const phase=phaseForHour(new Date().getHours());const root=document.documentElement;root.dataset.themeMode=mode;root.dataset.themePhase=mode==='auto'?phase:'';root.dataset.theme=mode==='auto'?(phase==='night'?'dark':'light'):mode})()`;
