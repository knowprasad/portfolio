import type {ContentBlock,ContentEntry} from './content-model';
import {publicUrl} from './content-model';
import {collectionImage} from './collection-content';
import type {CollectionKind} from './collection-browser';
export type CollectionPhoto={src:string;caption:string;source?:string};
export function belongsToCollection(entry:ContentEntry,kind:CollectionKind) {
  const shelf={books:'Books',watchlist:'Watchlist',articles:'Articles',channels:'Channels',places:''}[kind];
  return kind==='places'||((entry.values.Shelf===shelf||(kind==='articles'&&entry.values.Shelf==='Papers'))&&(kind!=='books'||entry.values.Format==='Book'));
}
export function collectionPhotos(blocks:ContentBlock[]):CollectionPhoto[] {
  const photos:CollectionPhoto[]=[];
  function visit(items:ContentBlock[]) { for(const block of items) { if(photos.length>=30)return;const src=block.type==='image'?collectionImage(block.url):undefined;if(src&&!photos.some(photo=>photo.src===src)){let caption=block.text.map(t=>t.text).join('');const match=caption.match(/\s+Source:\s+(https:\/\/\S+)$/);const source=publicUrl(match?.[1])||block.text.map(t=>publicUrl(t.href)).find(Boolean);if(match&&source)caption=caption.slice(0,match.index).trim();photos.push({src,caption,...source?{source}:{}});}visit(block.children); } }
  visit(blocks);return photos;
}
