'use client';
import Image from 'next/image';
import { useEffect, useSyncExternalStore } from 'react';
import { soundKey as key, soundEvent as eventName, soundEnabled as snapshot, playInterfaceSound } from '@/lib/interface-sound';
function subscribe(update:()=>void) { window.addEventListener(eventName,update); window.addEventListener('storage',update); return ()=>{window.removeEventListener(eventName,update);window.removeEventListener('storage',update);}; }
export function SoundToggle() {
 const enabled=useSyncExternalStore(subscribe,snapshot,()=>false);
 useEffect(()=>{if(!enabled)return;const onClick=(event:MouseEvent)=>{const target=event.target;if(target instanceof Element&&target.closest('button,a,summary')&&!target.closest('[data-sound-toggle],[data-own-sound]'))playInterfaceSound();};document.addEventListener('click',onClick);return()=>document.removeEventListener('click',onClick);},[enabled]);
 function toggle(){try{localStorage.setItem(key,enabled?'off':'on');window.dispatchEvent(new Event(eventName));if(!enabled)playInterfaceSound();}catch{}}
 return <button className="icon-button sound-toggle" data-sound-toggle aria-pressed={enabled} aria-label={enabled?'Mute interface sounds':'Enable interface sounds'} title={enabled?'Sound on':'Sound off'} onClick={toggle}><Image src={enabled?'/icons/interface-volume.svg':'/icons/interface-volume-mute.svg'} width={19} height={19} alt=""/></button>;
}
