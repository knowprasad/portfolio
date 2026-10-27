import {getCollectionGallery} from '@/lib/notion-server';
import type {CollectionKind} from '@/lib/collection-browser';
const kinds=new Set(['books','watchlist','places','articles','channels']);
export async function GET(_request:Request,{params}:{params:Promise<{kind:string;id:string}>}) {
  const {kind,id}=await params;
  const headers={'Cache-Control':'no-store'};
  if(!kinds.has(kind)||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))return Response.json({error:'Not found'},{status:404,headers});
  try {const photos=await getCollectionGallery(kind as CollectionKind,id);return photos===null?Response.json({error:'Not found'},{status:404,headers}):Response.json({photos},{headers});}
  catch {return Response.json({error:'Photos are temporarily unavailable'},{status:503,headers});}
}
