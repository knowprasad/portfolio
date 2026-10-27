'use client';
import Image from 'next/image';
import {useEffect,useRef,useState} from 'react';
import type {CollectionItem,CollectionKind} from '@/lib/collection-browser';
import type {CollectionPhoto} from '@/lib/collection-gallery';
import styles from './collection-browser.module.css';
export function EntryGallery({item,kind}:{item:CollectionItem;kind:CollectionKind}) {
  const [open,setOpen]=useState(false);
  return <><button className={styles.galleryButton} type="button" onClick={()=>setOpen(true)}>View photos</button>{open&&<CollectionGallery item={item} kind={kind} onClose={()=>setOpen(false)}/>}</>;
}
export function CollectionGallery({item,kind,onClose}:{item:CollectionItem;kind:CollectionKind;onClose:()=>void}) {
  const dialog=useRef<HTMLDialogElement>(null);
  const [photos,setPhotos]=useState<CollectionPhoto[]>(item.image?[{src:item.image,caption:item.imageCredit,source:item.imageSource}]:[]);
  const [index,setIndex]=useState(0),[state,setState]=useState<'loading'|'ready'|'error'>('loading'),[attempt,setAttempt]=useState(0);
  const [failedImage,setFailedImage]=useState<string|null>(null);
  useEffect(()=>{const node=dialog.current;if(node&&!node.open)node.showModal();},[]);
  useEffect(()=>{const controller=new AbortController();fetch(`/api/collections/${kind}/${encodeURIComponent(item.id)}/gallery`,{signal:controller.signal}).then(async response=>{if(!response.ok)throw Error('Unavailable');const data:unknown=await response.json();if(!data||typeof data!=='object'||!('photos'in data)||!Array.isArray(data.photos))throw Error('Invalid gallery');const additional=data.photos.filter((photo):photo is CollectionPhoto=>Boolean(photo&&typeof photo==='object'&&typeof photo.src==='string'&&(photo.src.startsWith('https:')||photo.src.startsWith('/collection-images/'))&&typeof photo.caption==='string'));setPhotos([...item.image?[{src:item.image,caption:item.imageCredit,source:item.imageSource}]:[],...additional.filter(photo=>photo.src!==item.image)]);setState('ready');}).catch(()=>{if(!controller.signal.aborted)setState('error');});return()=>controller.abort();},[item.id,item.image,item.imageCredit,item.imageSource,kind,attempt]);
  const photo=photos[index];
  function move(direction:number){setIndex(current=>Math.max(0,Math.min(photos.length-1,current+direction)));}
  return <dialog ref={dialog} className={styles.dialog} aria-labelledby="collection-gallery-title" onClose={onClose} onKeyDown={event=>{if(event.key==='ArrowRight'){event.preventDefault();move(1);}if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}}} onClick={event=>{if(event.target===event.currentTarget){const rect=event.currentTarget.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.current?.close();}}}>
    <div className={styles.dialogHeading}><div><h2 id="collection-gallery-title">{item.name}</h2><p>{[item.country,item.status].filter(Boolean).join(' · ')}</p></div><button type="button" autoFocus onClick={()=>dialog.current?.close()}>Close</button></div>
    {photo?<figure className={styles.galleryFigure}>{failedImage===photo.src?<p className={styles.galleryNotice}>This image is unavailable right now.</p>:<Image key={photo.src} src={photo.src} unoptimized width={1200} height={800} alt={photo.caption||item.name} loading="eager" onError={()=>setFailedImage(photo.src)}/>} {photo.caption&&<figcaption>{photo.caption}{photo.source?.startsWith("https:")&&<> <a href={photo.source} target="_blank" rel="noreferrer">Photo source ↗</a></>}</figcaption>}</figure>:<p className={styles.galleryNotice}>{state==='loading'?'Loading photos…':'No photos added yet.'}</p>}
    {photos.length>1&&<><div className={styles.galleryNavigation}><button type="button" disabled={index===0} onClick={()=>move(-1)}>← Previous</button><span aria-live="polite">{index+1} / {photos.length}</span><button type="button" disabled={index===photos.length-1} onClick={()=>move(1)}>Next →</button></div><div className={styles.thumbnails} role="group" aria-label="Choose photo">{photos.map((entry,i)=><button type="button" key={entry.src} aria-label={`Photo ${i+1}${entry.caption?`: ${entry.caption}`:''}`} aria-pressed={i===index} onClick={()=>setIndex(i)}><Image src={entry.src} unoptimized width={80} height={60} alt=""/></button>)}</div></>}
    {item.summary&&<p className={styles.gallerySummary}>{item.summary}</p>}
    {item.note&&<section className={styles.note}><h3>My take</h3><p>{item.note}</p></section>}{state==='loading'&&photo&&<p className={styles.galleryNotice} role="status">Checking for more photos…</p>}
    {state==='error'&&<p className={styles.galleryNotice} role="status">Extra photos couldn’t load. <button type="button" onClick={()=>{setState('loading');setAttempt(value=>value+1);}}>Retry</button></p>}
    {item.url&&<a className={styles.galleryLink} href={item.url} target="_blank" rel="noreferrer">{kind==='places'?'Open map':'Visit original'} ↗</a>}
  </dialog>;
}
