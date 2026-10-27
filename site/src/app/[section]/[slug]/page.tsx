import Image from 'next/image';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {shelves} from '@/data/shelves';
import {getCollectionNote} from '@/lib/notion-server';
import {collectionItem} from '@/lib/collection-content';
import {withCollectionArtwork} from '@/lib/collection-artwork-server';
import type {CollectionKind} from '@/lib/collection-browser';
import {pageMetadata} from '@/lib/seo';
import {ContentBlocks} from '@/components/content-blocks';
import {Footer} from '@/components/section';
import styles from '../collections.module.css';
export const revalidate=300;
export function generateStaticParams(){return [];}
async function data(section:string,slug:string){if(!Object.hasOwn(shelves,section))notFound();const kind=section as CollectionKind;const result=await getCollectionNote(kind,slug);if(!result)notFound();return {...result,kind};}
export async function generateMetadata({params}:{params:Promise<{section:string;slug:string}>}){const {section,slug}=await params;const {entry}=await data(section,slug);return pageMetadata(`/${section}/${slug}`,`${entry.name} · Notes`,entry.values['My take']||entry.values.Summary||`Personal notes on ${entry.name}.`);}
export default async function CollectionNote({params}:{params:Promise<{section:string;slug:string}>}) {
  const {section,slug}=await params;const {entry,blocks,unavailable,kind}=await data(section,slug);const item=collectionItem((await withCollectionArtwork([entry],kind))[0],kind);
  return <><main id="main" tabIndex={-1} className={`${styles.page} ${styles.entry}`}><Link className={styles.back} href={`/${section}`}>← {shelves[kind].title}</Link><p className={styles.entryLabel}>Off the clock · Notebook</p><h1>{item.name}</h1><p className={styles.intro}>{[item.creator,item.format,item.country,item.status].filter(Boolean).join(' · ')}</p>{item.summary&&<p className={styles.intro}>{item.summary}</p>}{item.image&&<figure className={styles.entryCover}><Image src={item.image} unoptimized width={1000} height={600} alt={`${item.name} artwork`}/>{item.imageCredit&&<figcaption>{item.imageSource?<a href={item.imageSource} target="_blank" rel="noreferrer">{item.imageCredit}</a>:item.imageCredit}</figcaption>}</figure>}{item.note&&<p className={styles.entryTake}>{item.note}</p>}<div className={`article-prose ${styles.entryProse}`}>{unavailable?<p>My notes couldn’t load right now. Please try again shortly.</p>:blocks.length?<ContentBlocks blocks={blocks} reader/>:!item.note&&<p>My notes for this entry are still to come.</p>}</div>{item.url&&<a className={styles.back} href={item.url} target="_blank" rel="noreferrer">{kind==='places'?'Open map':'Visit original'} ↗</a>}<Link className={styles.back} href={`/${section}`}>Back to {shelves[kind].title.toLowerCase()} →</Link></main><Footer/></>;
}
