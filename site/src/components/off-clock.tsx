import Link from 'next/link';
import Image from 'next/image';
import { shelves } from '@/data/shelves';
import { ArrowUpRight, BookOpen, Play } from './icons';
import { getContent } from '@/lib/notion-server';
import { publicImageUrl } from '@/lib/content-model';
export async function OffClock() {
  const [libraryContent,placeContent] = await Promise.all([getContent('library'),getContent('places')]);
  const library = libraryContent || [];
  const place = (placeContent || []).find(e=>publicImageUrl(e.values.Image));
  const books = library.filter(e=>e.values.Shelf==='Books');
  const order = ['books','watchlist','places','articles','channels'] as const;
  return <div className="personal-shelves">{order.map(slug => {
    const shelf = shelves[slug];
    const picks = library.filter(e=>e.values.Shelf===shelf.shelf || (slug==='articles' && e.values.Shelf==='Papers'));
    const covers = picks.filter(e=>publicImageUrl(e.values.Image));
    return <Link className={`personal-shelf shelf-${slug}`} href={`/${slug}`} key={slug}>
      {slug==='books' ? <div className="shelf-art" aria-hidden="true"><div className="book-fan">{['Stories','Ideas','Notes'].map((label,i)=><span key={label}>{publicImageUrl(books[i]?.values.Image) ? <Image unoptimized src={publicImageUrl(books[i].values.Image)!} width={115} height={166} alt=""/> : <><small>Off the clock</small><b>{label}</b><BookOpen size={18}/></>}</span>)}</div></div> : slug==='watchlist' ? <div className="shelf-art watch-art" aria-hidden="true">{[0,1].map(i=><span key={i}>{covers[i]?<Image unoptimized src={publicImageUrl(covers[i].values.Image)!} width={120} height={180} alt=""/>:<Play size={25}/>}</span>)}</div> : slug==='places' ? <div className="shelf-art" aria-hidden="true">{place && <Image className="place-cover" unoptimized src={publicImageUrl(place.values.Image)!} width={400} height={240} alt=""/>}<svg className="map-lines" viewBox="0 0 200 112" fill="none"><path d="M-10 25 70 75 130 12 210 60M10 120 70 75 138 105 170-10M-10 62 50 20 130 60 200 98" stroke="currentColor" opacity=".22"/><circle cx="106" cy="55" r="12" fill="currentColor" opacity=".1"/><circle cx="106" cy="55" r="4" fill="currentColor"/></svg></div> : slug==='articles' ? <div className="shelf-art paper-preview" aria-hidden="true"><BookOpen size={25}/><span><i/><i/><i/></span></div> : <div className="shelf-art channel-art" aria-hidden="true">{['↗','▶','#'].map((symbol,i)=><i key={symbol}>{covers[i]?<Image unoptimized src={publicImageUrl(covers[i].values.Image)!} width={36} height={36} alt=""/>:symbol}</i>)}</div>}
      <span className="shelf-caption"><span><strong>{shelf.title}</strong><small>{slug==='places'?'Visited & want to go':picks.length ? `${picks.length} ${picks.length===1?'pick':'picks'} on the shelf` : slug==='books'?'Reading, read & on my list':slug==='watchlist'?'Movies, series, anime & videos':slug==='channels'?'People & communities worth following':'Essays, ideas & research worth keeping'}</small></span><ArrowUpRight size={14}/></span>
    </Link>;
  })}</div>;
}
