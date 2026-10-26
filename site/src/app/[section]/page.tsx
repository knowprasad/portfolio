import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { shelves } from '@/data/shelves';
import { getContent } from '@/lib/notion-server';
import { publicUrl, publicImageUrl } from '@/lib/content-model';
import { Footer } from '@/components/section';
import { pageMetadata } from '@/lib/seo';
export const revalidate = 300;
export function generateStaticParams() { return Object.keys(shelves).map(section=>({section})); }
async function data(section: string) {
  if (!Object.hasOwn(shelves,section)) notFound();
  const shelf = shelves[section as keyof typeof shelves];
  const entries = await getContent(section==='places'?'places':'library');
  return {shelf,entries:(entries || []).filter(e=>section==='places' || e.values.Shelf===shelf.shelf || (section==='articles' && e.values.Shelf==='Papers'))};
}
export async function generateMetadata({params}:{params:Promise<{section:string}>}) { const {section}=await params; const {shelf,entries}=await data(section);return {...pageMetadata(`/${section}`,shelf.title,shelf.description),robots:{index:entries.length>0,follow:true}}; }
export default async function Collection({params}:{params:Promise<{section:string}>}) {
 const {section}=await params;const {shelf,entries}=await data(section);
 const groups = section==='places' ? ['Visited','Want to go'] : ['On the shelf'];
 return <><main id="main" tabIndex={-1} className="inner-page"><Link className="back-link" href="/#off-clock">← Off the clock</Link><h1>{shelf.title}<span>.</span></h1><p className="page-intro">{shelf.description}</p>{groups.map(group=>{const items=section==='places'?entries.filter(e=>e.values['Travel status']===group):entries;return <section className="library-group" key={group}>{section==='places' && <h2>{group}</h2>}{items.length ? <div className="library-list">{items.map(entry=>{const url=publicUrl(entry.values.Link || entry.values.Map),image=publicImageUrl(entry.values.Image);return <article className="library-item" key={entry.id}>{image && <Image unoptimized src={image} width={90} height={120} alt=""/>}<div><h2>{url?<a href={url} target="_blank" rel="noreferrer">{entry.name} ↗</a>:entry.name}</h2><p className="library-meta">{[entry.values.Creator,entry.values.Country,entry.values.Format,entry.values.Progress].filter(Boolean).join(' · ')}</p>{entry.values.Summary && <p>{entry.values.Summary}</p>}</div></article>;})}</div> : <p className="shelf-empty">{section==='places' ? group==='Visited'?'No visited places shared yet.':'The travel wishlist is still taking shape.':'Nothing shared on this shelf yet. I’ll add my own picks here.'}</p>}</section>})}</main><Footer/></>;
}
