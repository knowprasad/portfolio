'use client';
import {useEffect,useId,useRef,useState} from 'react';
import {Clock,Moon,Sun} from './icons';
import {selectTheme,useThemePreference} from '@/lib/theme-client';
const options=[{mode:'auto',label:'Auto',Icon:Clock},{mode:'light',label:'Light',Icon:Sun},{mode:'dark',label:'Dark',Icon:Moon}] as const;
export function ThemeChoices({menu=false,onSelect,origin}:{menu?:boolean;onSelect?:()=>void;origin?:()=>HTMLElement|null}) {
  const {mode,phase}=useThemePreference();
  const container=useRef<HTMLDivElement>(null);
  useEffect(()=>{container.current?.querySelector<HTMLButtonElement>('[aria-checked="true"],[aria-pressed="true"]')?.focus();},[]);
  return <div ref={container} className="theme-choices" role={menu?'menu':'group'} aria-label="Theme" onKeyDown={event=>{if(!['ArrowDown','ArrowUp','Home','End'].includes(event.key))return;event.preventDefault();const buttons=Array.from(container.current?.querySelectorAll('button')||[]);const current=buttons.indexOf(document.activeElement as HTMLButtonElement);const next=event.key==='Home'?0:event.key==='End'?2:(current+(event.key==='ArrowDown'?1:-1)+3)%3;buttons[next]?.focus();}}>{options.map(option=><button key={option.mode} type="button" role={menu?'menuitemradio':undefined} tabIndex={menu?(mode===option.mode?0:-1):undefined} aria-checked={menu?mode===option.mode:undefined} aria-pressed={!menu?mode===option.mode:undefined} aria-label={option.mode==='auto'?`Auto${phase?`, ${phase}`:''}. Based on your local time`:option.label} onClick={event=>{const anchor=origin?.()||event.currentTarget;selectTheme(option.mode,anchor);onSelect?.();}}><option.Icon size={16}/><span>{option.label}{option.mode==='auto'&&<small>Based on your local time</small>}</span><span className="theme-selected" aria-hidden="true">{mode===option.mode?'✓':''}</span></button>)}</div>;
}
export function ThemeMenu() {
  const [open,setOpen]=useState(false);
  const {mode,phase}=useThemePreference();
  const trigger=useRef<HTMLButtonElement>(null),wrapper=useRef<HTMLDivElement>(null);
  const id=useId();
  const close=()=>{setOpen(false);trigger.current?.focus();};
  useEffect(()=>{if(!open)return;const outside=(event:PointerEvent)=>{if(!wrapper.current?.contains(event.target as Node))setOpen(false);};document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside);},[open]);
  const Icon=mode==='auto'?Clock:mode==='dark'?Moon:Sun;
  return <div className="theme-control" ref={wrapper} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null))setOpen(false);}} onKeyDown={event=>{if(event.key==='Escape'&&open){event.preventDefault();event.stopPropagation();close();}}}><button type="button" ref={trigger} className="icon-button theme-key" aria-haspopup="menu" aria-expanded={open} aria-controls={open?id:undefined} aria-label={`Theme: ${mode}${mode==='auto'&&phase?` (${phase})`:''}`} title="Choose theme" onClick={()=>setOpen(value=>!value)} onKeyDown={event=>{if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();setOpen(true);}}}><Icon size={18}/></button>{open&&<div id={id} className="theme-menu"><ThemeChoices menu onSelect={close} origin={()=>trigger.current}/></div>}</div>;
}
