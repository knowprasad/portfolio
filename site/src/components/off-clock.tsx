import Link from 'next/link';
import Image from 'next/image';
import {shelves} from '@/data/shelves';
import {ArrowUpRight,BookOpen,Play} from './icons';
import {getContent} from '@/lib/notion-server';
import {featuredImages,collectionImage,collectionSlug} from '@/lib/collection-content';
import {withCollectionArtwork} from '@/lib/collection-artwork-server';
import styles from './home-bookcase.module.css';
import {BookCover} from './book-cover';

export async function OffClock() {
  const [libraryContent,placeContent]=await Promise.all([getContent('library'),getContent('places')]);
  const groups=await Promise.all((['books','watchlist','articles','channels'] as const).map(kind=>withCollectionArtwork((libraryContent||[]).filter(e=>(e.values.Shelf===shelves[kind].shelf||(kind==='articles'&&e.values.Shelf==='Papers'))&&(kind!=='books'||e.values.Format==='Book')),kind)));
  const library=groups.flat();
  const place=featuredImages(await withCollectionArtwork(placeContent||[],'places'),1)[0];
  const order=['books','watchlist','places','articles','channels'] as const;
  return <div className="personal-shelves">{order.map(slug=>{
    const shelf=shelves[slug];
    const picks=library.filter(e=>(e.values.Shelf===shelf.shelf||(slug==='articles'&&e.values.Shelf==='Papers'))&&(slug!=='books'||e.values.Format==='Book'));
    const covers=featuredImages(picks,slug==='books'?4:3);
    const caption=<><span><strong>{shelf.title}</strong><small>{slug==='places'?'Visited & want to go':picks.length?`${picks.length} ${picks.length===1?'pick':'picks'} on the shelf`:slug==='books'?'Reading, read & on my list':slug==='watchlist'?'Movies, series, anime & videos':slug==='channels'?'People & communities worth following':'Essays, ideas & research worth keeping'}</small></span><ArrowUpRight size={14}/></>;
    if(slug==='books')return <div className={`personal-shelf shelf-books ${styles.card}`} key={slug}><div className={`shelf-art ${styles.bookcase}`}><div className={styles.books}>{covers.length?covers.map(book=><Link prefetch={false} href={`/books/${collectionSlug(book)}`} key={book.id} className={styles.book} aria-label={`Read notes on ${book.name}`} title={book.name}><BookCover src={collectionImage(book.values.Image)!} name={book.name}/><span className={styles.bookEdge} aria-hidden="true"/></Link>):<p className={styles.empty}><BookOpen size={28}/>Your bookshelf is taking shape.</p>}</div><span className={styles.rail} aria-hidden="true"/></div><Link className={`shelf-caption ${styles.caption}`} href="/books">{caption}</Link></div>;
    return <Link className={`personal-shelf shelf-${slug}`} href={`/${slug}`} key={slug}>
      {slug==='watchlist'?<div className="shelf-art watch-art" aria-hidden="true">{[0,1].map(i=><span key={i}>{covers[i]?<Image unoptimized src={collectionImage(covers[i].values.Image)!} width={120} height={180} alt=""/>:<Play size={25}/>}</span>)}</div>:slug==='places'?<div className="shelf-art" aria-hidden="true">{place&&<Image className="place-cover" unoptimized src={collectionImage(place.values.Image)!} width={400} height={240} alt=""/>}<svg className="map-lines" viewBox="0 0 200 112" fill="none"><path d="M-10 25 70 75 130 12 210 60M10 120 70 75 138 105 170-10M-10 62 50 20 130 60 200 98" stroke="currentColor" opacity=".22"/><circle cx="106" cy="55" r="12" fill="currentColor" opacity=".1"/><circle cx="106" cy="55" r="4" fill="currentColor"/></svg></div>:slug==='articles'?<div className="shelf-art paper-preview" aria-hidden="true">{covers.length?<div className="shelf-article-covers">{covers.map(entry=><Image key={entry.id} unoptimized src={collectionImage(entry.values.Image)!} width={160} height={100} alt=""/>)}</div>:<><BookOpen size={25}/><span><i/><i/><i/></span></>}</div>:<div className="shelf-art channel-art" aria-hidden="true">{['↗','▶','#'].map((symbol,i)=><i key={symbol}>{covers[i]?<Image unoptimized src={collectionImage(covers[i].values.Image)!} width={36} height={36} alt=""/>:symbol}</i>)}</div>}
      <span className="shelf-caption">{caption}</span>
    </Link>;
  })}</div>;
}
