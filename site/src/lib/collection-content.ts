import {publicImageUrl,publicUrl,slugSchema,type ContentEntry} from './content-model';
import type {CollectionItem,CollectionKind} from './collection-browser';
export function collectionImage(value:unknown) {
  const url=publicImageUrl(value);
  if(!url) return;
  const parsed=new URL(url);
  return parsed.hostname==='knowprasad.me'&&parsed.pathname.startsWith('/collection-images/') ? parsed.pathname : url;
}
export function collectionSlug(entry:ContentEntry) {
  return slugSchema.safeParse(entry.values.Slug).success?entry.values.Slug:entry.id;
}
export function libraryKind(entry:ContentEntry):CollectionKind|undefined {
  const shelf=entry.values.Shelf;
  if(shelf==='Books')return entry.values.Format==='Book'?'books':undefined;
  return shelf==='Watchlist'?'watchlist':shelf==='Channels'?'channels':['Articles','Papers'].includes(shelf)?'articles':undefined;
}
export function collectionItem(entry:ContentEntry,kind:CollectionKind):CollectionItem {
  return {id:entry.id,path:`/${kind}/${collectionSlug(entry)}`,name:entry.name,creator:entry.values.Creator||'',format:entry.values.Format||'',status:entry.values[kind==='places'?'Travel status':'Progress']||'',summary:entry.values.Summary||'',note:entry.values['My take']||'',country:entry.values.Country||'',image:collectionImage(entry.values.Image),url:publicUrl(entry.values.Link||entry.values.Map),imageCredit:entry.values['Image credit']||'',imageSource:publicUrl(entry.values['Image source']),featured:entry.featured};
}
export function featuredImages(entries:ContentEntry[],limit:number) {
  return [...entries.filter(e=>e.featured),...entries.filter(e=>!e.featured)].filter(e=>publicImageUrl(e.values.Image)).slice(0,limit);
}
