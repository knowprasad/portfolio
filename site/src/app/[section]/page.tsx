import Link from 'next/link';
import { notFound } from 'next/navigation';
import { shelves } from '@/data/shelves';
import { getContent } from '@/lib/notion-server';
import { Footer } from '@/components/section';
import { CollectionBrowser } from '@/components/collection-browser';
import type { CollectionKind } from '@/lib/collection-browser';
import { collectionItem } from '@/lib/collection-content';
import {withCollectionArtwork} from '@/lib/collection-artwork-server';
import { pageMetadata } from '@/lib/seo';
import styles from './collections.module.css';
export const revalidate=300;
export function generateStaticParams() { return Object.keys(shelves).map(section=>({section})); }
async function data(section:string) {
  if(!Object.hasOwn(shelves,section)) notFound();
  const kind=section as CollectionKind,shelf=shelves[kind];
  const entries=await getContent(kind==='places'?'places':'library');
  const selected=(entries||[]).filter(e=>kind==='places'||((e.values.Shelf===shelf.shelf||(kind==='articles'&&e.values.Shelf==='Papers'))&&(kind!=='books'||e.values.Format==='Book')));
  return {kind,shelf,entries:await withCollectionArtwork(selected,kind)};
}
export async function generateMetadata({params}:{params:Promise<{section:string}>}) {
  const {section}=await params;const {shelf,entries}=await data(section);
  return {...pageMetadata(`/${section}`,shelf.title,shelf.description),robots:{index:entries.length>0,follow:true}};
}
export default async function Collection({params}:{params:Promise<{section:string}>}) {
  const {section}=await params;const {kind,shelf,entries}=await data(section);
  return <><main id="main" tabIndex={-1} className={styles.page}><h1>{shelf.title}</h1><p className={styles.intro}>{shelf.description}</p><CollectionBrowser kind={kind} title={shelf.title} items={entries.map(e=>collectionItem(e,kind))}/><Link className={styles.back} href="/#off-clock">← Off the clock</Link></main><Footer/></>;
}
