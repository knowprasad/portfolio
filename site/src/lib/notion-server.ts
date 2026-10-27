import 'server-only';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import sources from '@/data/notion-sources.json';
import {belongsToCollection,collectionPhotos} from './collection-gallery';
import type {CollectionKind} from './collection-browser';
import {collectionSlug,collectionImage} from './collection-content';
import { normalizePublishedPage, publicUrl, publicImageUrl, type ContentBlock, type ContentEntry, type RichText } from './content-model';

export type ContentSource = keyof typeof sources;
type ApiList = { results: Record<string, unknown>[]; has_more: boolean; next_cursor: string | null };
export function notionReady() { return Boolean(process.env.NOTION_TOKEN); }
async function request(path: string, body?: object): Promise<ApiList> {
  for(let attempt=0;attempt<3;attempt++) {
    const response = await fetch(`https://api.notion.com/v1/${path}`, { method: body ? 'POST' : 'GET', cache: 'no-store', redirect:'error', signal: AbortSignal.timeout(10000), headers: { Authorization: `Bearer ${process.env.NOTION_TOKEN}`, 'Notion-Version': '2025-09-03', 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
    if(response.status===429 && attempt<2) { const seconds=Number(response.headers.get('retry-after')); await new Promise(resolve=>setTimeout(resolve,Number.isFinite(seconds)?Math.min(2000,Math.max(500,seconds*1000)):1000)); continue; }
    if (!response.ok) throw new Error(`Content source unavailable (${response.status})`);
    return response.json();
  }
  throw new Error('Content source unavailable');
}
// Fixed source IDs only. Never search the owner's wider workspace from a public request.
const publishedSource = unstable_cache(async (source: ContentSource): Promise<ContentEntry[]> => {
  const entries: ContentEntry[] = []; let cursor: string | null = null;
  for (let page = 0; page < 20; page++) {
    const result = await request(`data_sources/${sources[source].sourceId}/query`, { page_size: 100, filter: { property: 'Publish', select: { equals: 'Published' } }, sorts: [{ property: 'Order', direction: 'ascending' }], ...(cursor ? { start_cursor: cursor } : {}) });
    for (const row of result.results) { const entry = normalizePublishedPage(row); if (entry) entries.push(entry); }
    if (!result.has_more || !result.next_cursor) break;
    cursor = result.next_cursor;
  }
  return entries;
}, ['portfolio-published-content-v4'], { revalidate: 300, tags: ['portfolio-content'] });
export const getContent = cache(async (source: ContentSource): Promise<ContentEntry[] | null> => {
  if (!notionReady()) return null;
  try { return await publishedSource(source); } catch { return null; }
});
function rich(input: unknown): RichText[] {
  if (!Array.isArray(input)) return [];
  return input.map(item => { const text = item as { plain_text?: string; href?: string; annotations?: { bold?: boolean; italic?: boolean; code?: boolean; strikethrough?: boolean } }; return { text: text.plain_text || '', href: publicUrl(text.href), bold: text.annotations?.bold, italic: text.annotations?.italic, code: text.annotations?.code, strike: text.annotations?.strikethrough }; });
}
async function blocks(id: string, depth = 0): Promise<ContentBlock[]> {
  if (depth > 5) return [];
  const output: ContentBlock[] = []; let cursor: string | null = null;
  for (let page = 0; page < 10; page++) {
    const result = await request(`blocks/${id}/children?page_size=100${cursor ? `&start_cursor=${encodeURIComponent(cursor)}` : ''}`);
    for (const row of result.results) {
      if (typeof row.id !== 'string' || typeof row.type !== 'string') continue;
      const data = row[row.type] as { rich_text?: unknown; caption?: unknown; language?: string; external?: { url?: string }; file?: { url?: string }; cells?: unknown[][]; has_column_header?: boolean; has_row_header?: boolean } | undefined;
      // Do not follow synced blocks, child pages, embeds or arbitrary URLs.
      const supported = ['paragraph','heading_1','heading_2','heading_3','bulleted_list_item','numbered_list_item','quote','callout','code','divider','image','toggle','table','table_row'];
      if (!supported.includes(row.type)) { output.push({ id: row.id, type: 'unsupported', text: [], children: [] }); continue; }
      output.push({ id: row.id, type: row.type, text: rich(data?.rich_text || data?.caption), children: row.has_children ? await blocks(row.id, depth + 1) : [], url: publicImageUrl(data?.external?.url || data?.file?.url), language: data?.language, rows: data?.cells ? [data.cells.map(cell => rich(cell).map(t => t.text).join(''))] : undefined, ...(row.type === 'table' ? { tableHeaderRow: data?.has_column_header === true, tableHeaderColumn: data?.has_row_header === true } : {}) });
    }
    if (!result.has_more || !result.next_cursor) break;
    cursor = result.next_cursor;
  }
  return output;
}
const publishedBody = unstable_cache(blocks, ['portfolio-article-body-v2'], { revalidate: 300, tags: ['portfolio-content'] });
export async function getArticle(slug: string) {
  const entries = await getContent('writing');
  const entry = entries?.find(row => row.values.Slug === slug);
  if (!entry) return null;
  try { return { ...entry, blocks: await publishedBody(entry.id) }; } catch { return null; }
}
export async function getProjectBody(slug: string) {
  const project=(await getContent('projects'))?.find(p=>p.values.Slug===slug);
  if(!project)return [];
  try { return await publishedBody(project.id); } catch { return []; }
}
export async function getCollectionGallery(kind:CollectionKind,id:string) {
  const entries=await getContent(kind==='places'?'places':'library');
  if(entries===null) throw new Error('Collection unavailable');
  const entry=entries.find(e=>e.id===id&&belongsToCollection(e,kind));
  if(!entry)return null;
  // Membership is checked before fetching blocks; arbitrary/private IDs are never read.
  return collectionPhotos(await publishedBody(entry.id));
}
export const getCollectionNote=cache(async(kind:CollectionKind,slug:string)=>{
  const entries=await getContent(kind==='places'?'places':'library');
  const matches=entries?.filter(e=>belongsToCollection(e,kind)&&(collectionSlug(e)===slug||e.id===slug))||[];
  if(matches.length!==1)return null;
  const entry=matches[0];
  function localImages(items:ContentBlock[]):ContentBlock[]{return items.map(block=>({...block,url:block.type==='image'?collectionImage(block.url):block.url,children:localImages(block.children)}));}
  try{return {entry,blocks:localImages(await publishedBody(entry.id)),unavailable:false};}catch{return {entry,blocks:[],unavailable:true};}
});
