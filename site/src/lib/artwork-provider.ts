import {publicImageUrl,publicUrl} from './content-model';
import type {CollectionKind} from './collection-browser';
export type ArtworkQuery={kind:CollectionKind;name:string;creator:string;link:string;format:string};
export type Artwork={image:string;credit:string;source:string};
type Fetcher=typeof fetch;
const agent='KnowprasadPortfolio/1.0 (https://knowprasad.me)';
const normal=(value:string)=>value.normalize('NFKD').toLowerCase().replace(/\([^)]*\)/g,'').replace(/\b(?:s\d+|season \d+)\b/g,'').replace(/[^a-z0-9]+/g,' ').trim();
export function trustedMetadataUrl(value:string) {
  const url=publicUrl(value);if(!url)return;
  const host=new URL(url).hostname;
  if(['substack.com','medium.com','www.medium.com','dev.to','hashnode.com','www.youtube.com','youtube.com','www.instagram.com','instagram.com','github.com'].includes(host)||host.endsWith('.substack.com')||host.endsWith('.hashnode.dev'))return url;
}
export function metadataImage(html:string,base:string) {
  for(const tag of html.match(/<meta\b[^>]*>/gi)||[]) {
    if(!/(?:property|name)\s*=\s*["'](?:og:image|twitter:image)["']/i.test(tag))continue;
    const content=tag.match(/content\s*=\s*["']([^"']+)["']/i)?.[1]?.replaceAll('&amp;','&');
    if(content){try{const image=publicImageUrl(new URL(content,base).href);if(image)return image;}catch{/* Ignore malformed metadata. */}}
  }
}
async function json(url:string,fetcher:Fetcher) {
  const response=await fetcher(url,{redirect:'error',signal:AbortSignal.timeout(5000),headers:{'User-Agent':agent}});
  if(!response.ok)throw Error('Artwork source unavailable');
  return response.json();
}
async function metadata(link:string,fetcher:Fetcher):Promise<Artwork|null> {
  let url=trustedMetadataUrl(link);if(!url)return null;
  for(let hop=0;hop<3;hop++) {
    const response:Response=await fetcher(url,{redirect:'manual',signal:AbortSignal.timeout(5000),headers:{'User-Agent':agent}});
    if(response.status>=300&&response.status<400){const location:string|null=response.headers.get('location');url=location?trustedMetadataUrl(new URL(location,url).href):undefined;if(!url)return null;continue;}
    if(!response.ok||!response.headers.get('content-type')?.includes('text/html'))return null;
    const reader=response.body?.getReader();if(!reader)return null;let length=0;const chunks:Uint8Array[]=[];
    try{for(;;){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>512000)return null;chunks.push(value);}}finally{await reader.cancel();}
    const image=metadataImage(new TextDecoder().decode(Buffer.concat(chunks)),url);
    return image?{image,credit:'Automatically matched · publisher preview',source:link}:null;
  }
  return null;
}
function plain(value:string=''){return value.replace(/<[^>]*>/g,'').replaceAll('&amp;','&').trim();}
async function wikiArtwork(title:string,kind:CollectionKind,fetcher:Fetcher):Promise<Artwork|null> {
  const data=await json('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(title),fetcher);
  if(data.type==='disambiguation')return null;
  let image=publicImageUrl(data.thumbnail?.source||data.originalimage?.source);
  if(kind==='places'&&image?.includes('/commons/thumb/'))image=image.replace(/\/\d+px-/,'/960px-');
  if(!image||/\.svg(?:[?#]|$)|(?:flag|coat_of_arms|locator|orthographic)/i.test(image))return null;
  const source=publicUrl(data.content_urls?.desktop?.page);if(!source)return null;
  if(image.includes('/commons/')) {
    const parts=new URL(image).pathname.split('/'),filename=decodeURIComponent(parts[parts.indexOf('commons')+(parts[parts.indexOf('commons')+1]==='thumb'?4:3)]||'');
    const result=await json('https://commons.wikimedia.org/w/api.php?'+new URLSearchParams({action:'query',format:'json',titles:'File:'+filename,prop:'imageinfo',iiprop:'extmetadata|url'}),fetcher);
    const info=(Object.values(result.query?.pages||{})[0] as {imageinfo?:Array<{descriptionurl?:string;extmetadata?:Record<string,{value:string}>}>})?.imageinfo?.[0];
    const author=plain(info?.extmetadata?.Artist?.value),license=plain(info?.extmetadata?.LicenseShortName?.value),fileSource=publicUrl(info?.descriptionurl);
    if(!author||!license||!fileSource)return null;
    return {image,credit:`${kind==='places'?'Representative photo':'Image'} · ${author} · ${license}`,source:fileSource};
  }
  return {image,credit:'Automatically matched · artwork via Wikipedia',source};
}
export async function findArtwork(query:ArtworkQuery,fetcher:Fetcher=fetch):Promise<Artwork|null> {
  try {
    if(query.kind==='books') {
      const data=await json('https://openlibrary.org/search.json?'+new URLSearchParams({title:query.name,...query.creator?{author:query.creator}:{},limit:'5',fields:'title,author_name,cover_i,key'}),fetcher);
      const match=data.docs?.find((book:{title:string;author_name?:string[];cover_i?:number})=>normal(book.title)===normal(query.name)&&Number.isSafeInteger(book.cover_i)&&(!query.creator||book.author_name?.some(author=>normal(author).includes(normal(query.creator)))));
      return match&&/^\/works\/OL\d+W$/.test(match.key)?{image:`https://covers.openlibrary.org/b/id/${match.cover_i}-L.jpg?default=false`,credit:'Automatically matched · cover via Open Library',source:'https://openlibrary.org'+match.key}:null;
    }
    if(query.kind==='articles'||query.kind==='channels')return query.link?await metadata(query.link,fetcher):null;
    const title=query.name.replace(/\s*\(?\b(?:S\d+|Season \d+)\)?\s*$/i,'').trim();
    const search=await json('https://en.wikipedia.org/w/api.php?'+new URLSearchParams({action:'query',list:'search',srsearch:`intitle:${title}`,srnamespace:'0',srlimit:'5',format:'json'}),fetcher);
    const matches=(search.query?.search||[]).filter((page:{title:string})=>normal(page.title)===normal(title));
    const preferred=query.format==='Movie'?/\bfilm\b/i:/(?:TV|television|anime).*series/i;
    if(query.kind==='watchlist')matches.sort((a:{title:string},b:{title:string})=>Number(preferred.test(b.title))-Number(preferred.test(a.title)));
    for(const match of matches.slice(0,2)){const image=await wikiArtwork(match.title,query.kind,fetcher);if(image)return image;}
    return null;
  }catch{return null;}
}
