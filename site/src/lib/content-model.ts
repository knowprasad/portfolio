import { z } from 'zod';

export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100);
export function publicUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return;
  try { const url = new URL(value); if (url.protocol === 'https:' && !url.username && !url.password && !url.port && !/^(localhost|127\.|0\.|\[|10\.|192\.168\.)/i.test(url.hostname)) return url.href; } catch { /* Invalid content is omitted. */ }
}
export const contentImageHosts = ['github.com','avatars.githubusercontent.com','prod-files-secure.s3.us-west-2.amazonaws.com','s3.us-west-2.amazonaws.com','images.unsplash.com'];
export function publicImageUrl(value: unknown) { const url=publicUrl(value); return url && contentImageHosts.includes(new URL(url).hostname) ? url : undefined; }
export type RichText = { text: string; href?: string; bold?: boolean; italic?: boolean; code?: boolean; strike?: boolean };
export type ContentBlock = { id: string; type: string; text: RichText[]; children: ContentBlock[]; url?: string; language?: string; rows?: string[][]; tableHeaderRow?: boolean; tableHeaderColumn?: boolean };
export type ContentEntry = { id: string; name: string; values: Record<string, string>; tags: string[]; featured: boolean; blocks?: ContentBlock[] };
type Property = { type?: string; title?: { plain_text?: string }[]; rich_text?: { plain_text?: string }[]; select?: { name: string } | null; multi_select?: { name: string }[]; url?: string | null; date?: { start: string } | null; checkbox?: boolean; number?: number | null };
export function normalizePublishedPage(input: unknown): ContentEntry | null {
  const parsed = z.object({ id: z.string().uuid(), archived: z.boolean().optional(), in_trash: z.boolean().optional(), properties: z.record(z.string(), z.unknown()) }).safeParse(input);
  if (!parsed.success || parsed.data.archived || parsed.data.in_trash) return null;
  const props = parsed.data.properties as Record<string, Property>;
  if (props.Publish?.select?.name !== 'Published') return null;
  const values: Record<string, string> = {};
  for (const [name, property] of Object.entries(props)) {
    if (!property || typeof property !== 'object') continue;
    values[name] = (property.title || property.rich_text)?.map(t => t.plain_text || '').join('') || property.select?.name || property.url || property.date?.start || (property.checkbox ? 'true' : '') || (property.number != null ? String(property.number) : '');
  }
  const cover = (input as {cover?:{external?:{url?:string};file?:{url?:string}}}).cover;
  if (!values.Image) values.Image = publicImageUrl(cover?.external?.url || cover?.file?.url) || '';
  const name = values.Name?.trim();
  if (!name) return null;
  return { id: parsed.data.id, name, values, featured: props.Featured?.checkbox === true, tags: props.Tags?.multi_select?.map(t => t.name) || [] };
}
export function plainBlocks(blocks: ContentBlock[]): string { return blocks.map(b => `${b.text.map(t => t.text).join('')} ${plainBlocks(b.children)} ${(b.rows || []).flat().join(' ')}`).join('\n'); }
