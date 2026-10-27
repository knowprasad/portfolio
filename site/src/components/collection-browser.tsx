'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { collectionFormats,collectionStatuses,filterCollection,collectionGroups,type CollectionItem,type CollectionKind } from '@/lib/collection-browser';
import { MagnifyingGlass as Search,BookOpen,Play,Globe } from './icons';
import styles from './collection-browser.module.css';

const labels:Record<string,string>={Reading:'Currently reading',Read:'Read','Want to read':'Want to read',Watching:'Watching',Watched:'Watched','Want to watch':'Want to watch',Visited:'Visited','Want to go':'Want to go','YouTube video':'Videos','YouTube channel':'YouTube','Instagram creator':'Instagram','Discord community':'Discord','Research paper':'Papers',Article:'Articles',Movie:'Movies',Series:'Series',Anime:'Anime',Other:'Other'};
function Artwork({item,kind}:{item:CollectionItem;kind:CollectionKind}) {
  const [failed,setFailed]=useState(false);
  const Icon=kind==='books'||kind==='articles'?BookOpen:kind==='watchlist'?Play:Globe;
  return <div className={`${styles.artwork} ${styles[kind]}`} aria-hidden="true">{item.image&&!failed ? <Image src={item.image} unoptimized={item.image.startsWith('https:')} width={kind==='places'?640:360} height={kind==='places'?420:540} alt={`${item.name} ${kind==='books'?'cover':kind==='watchlist'?'poster':'image'}`} sizes="(max-width:600px) 45vw,200px" onError={()=>setFailed(true)}/> : <div className={styles.placeholder}><Icon size={28}/><span>{item.name}</span></div>}</div>;
}
export function CollectionBrowser({items,kind,title}:{items:CollectionItem[];kind:CollectionKind;title:string}) {
  const [query,setQuery]=useState('');const [format,setFormat]=useState('All');const [status,setStatus]=useState('All');
  const formats=collectionFormats[kind],statuses=collectionStatuses[kind];
  const visible=filterCollection(items,query,format,status),groups=collectionGroups(visible,kind);
  const reset=()=>{setQuery('');setFormat('All');setStatus('All');};
  return <div className={styles.browser}>
    {formats.length>0 && <div className={styles.filters} role="group" aria-label="Filter by format">{['All',...formats].map(value=><button key={value} aria-pressed={format===value} onClick={()=>setFormat(value)}>{labels[value]||value}</button>)}</div>}
    {statuses.length>0 && <div className={`${styles.filters} ${formats.length?styles.secondary:''}`} role="group" aria-label={kind==='places'?'Filter by travel status':'Filter by progress'}>{['All',...statuses].map(value=><button key={value} aria-pressed={status===value} onClick={()=>setStatus(value)}>{labels[value]||value}</button>)}</div>}
    <label className={styles.search}><Search size={16}/><span className="sr-only">Search {title.toLowerCase()}</span><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={`Search ${title.toLowerCase()}`} autoComplete="off"/>{query && <button onClick={()=>setQuery('')} type="button" aria-label="Clear search">Clear</button>}</label>
    <p className={styles.result} role="status" aria-live="polite">{visible.length} of {items.length} {items.length===1?'entry':'entries'}{kind==='places'&&<span>{items.filter(item=>item.status==='Visited').length} visited</span>}</p>
    {!visible.length ? <div className={styles.empty}><h2>{items.length?'No matches':'This shelf is still taking shape'}</h2><p>{items.length?'Try another search or clear your filters.':'New picks will appear here when they are published.'}</p>{items.length>0&&<button onClick={reset}>Clear filters</button>}</div> : groups.map(group=><section key={group.title} className={styles.group}><h2>{labels[group.title]||group.title}<span>/ {String(group.items.length).padStart(2,'0')}</span></h2><ul className={`${styles.grid} ${styles[`grid_${kind}`]}`}>{group.items.map(item=><li key={item.id}><Link prefetch={false} className={styles.card} href={item.path||`/${kind}/${item.id}`}><Artwork key={item.image||item.id} item={item} kind={kind}/><div className={styles.copy}><h3>{item.name}</h3><p className={styles.itemMeta}>{[labels[item.status]||item.status,item.format,item.country].filter(Boolean).join(' · ')}</p>{item.creator&&<p className={styles.creator}>{item.creator}</p>}{(item.note||item.summary)&&<p className={styles.excerpt}>{item.note||item.summary}</p>}</div></Link></li>)}</ul></section>)}
  </div>;
}
