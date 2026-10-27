import 'server-only';
import {unstable_cache} from 'next/cache';
import {findArtwork,type ArtworkQuery} from './artwork-provider';
import type {ContentEntry} from './content-model';
import type {CollectionKind} from './collection-browser';
import {collectionImage} from './collection-content';
const lookup=unstable_cache((query:ArtworkQuery)=>findArtwork(query),['portfolio-auto-artwork-v1'],{revalidate:86400});
export async function withCollectionArtwork(entries:ContentEntry[],kind:CollectionKind) {
  const output=[...entries];let cursor=0;
  async function worker(){for(;;){const index=cursor++;if(index>=entries.length)return;const entry=entries[index];if(collectionImage(entry.values.Image))continue;const image=await lookup({kind,name:entry.name,creator:entry.values.Creator||'',link:entry.values.Link||'',format:entry.values.Format||''});if(image)output[index]={...entry,values:{...entry.values,Image:image.image,'Image credit':image.credit,'Image source':image.source}};}}
  await Promise.all(Array.from({length:Math.min(entries.length,3)},worker));return output;
}
