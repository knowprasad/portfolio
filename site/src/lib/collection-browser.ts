export type CollectionKind = 'books' | 'watchlist' | 'places' | 'articles' | 'channels';
export type CollectionItem = { id:string; name:string; creator:string; format:string; status:string; summary:string; note?:string; path?:string; country:string; image?:string; url?:string; imageCredit:string; imageSource?:string; featured:boolean };
export const collectionFormats: Record<CollectionKind,string[]> = {
  books:[], watchlist:['Movie','Series','Anime','YouTube video'], places:[], articles:['Article','Research paper'], channels:['YouTube channel','Instagram creator','Discord community','Other'],
};
export const collectionStatuses: Record<CollectionKind,string[]> = {
  books:['Reading','Read','Want to read'], watchlist:['Watching','Watched','Want to watch'], places:['Visited','Want to go'], articles:['Reading','Read','Want to read'], channels:[],
};
export function filterCollection(items:CollectionItem[], query:string, format='All',status='All') {
  const words=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return items.filter(item=>(format==='All'||item.format===format)&&(status==='All'||item.status===status)&&words.every(word=>[item.name,item.creator,item.summary,item.note,item.country,item.format,item.status].join(' ').toLocaleLowerCase().includes(word)));
}
export function collectionGroups(items:CollectionItem[],kind:CollectionKind) {
  const order=collectionStatuses[kind];
  if(!order.length) return [{title:'On the shelf',items}];
  return [...order.map(status=>({title:status,items:items.filter(item=>item.status===status)})),{title:'On the shelf',items:items.filter(item=>!order.includes(item.status))}].filter(group=>group.items.length);
}
