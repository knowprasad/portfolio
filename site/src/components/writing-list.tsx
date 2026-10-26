import Link from 'next/link';
import { getContent } from '@/lib/notion-server';
import { slugSchema } from '@/lib/content-model';
import { ArrowUpRight } from './icons';
export async function WritingList({ compact = false }: { compact?: boolean }) {
  const entries = (await getContent('writing') || []).filter(e => slugSchema.safeParse(e.values.Slug).success).sort((a,b) => (b.values['Published date'] || '').localeCompare(a.values['Published date'] || ''));
  if (!entries.length) return <div className="writing-empty"><p>A place to think out loud.</p><span>The first published piece will appear here.</span>{compact && <Link className="text-link" href="/writing">Visit the notebook <ArrowUpRight size={13}/></Link>}</div>;
  const selected = compact && entries.some(e=>e.featured) ? entries.filter(e=>e.featured) : entries;
  return <div className="writing-list">{selected.slice(0, compact ? 3 : undefined).map(entry => <Link href={`/writing/${entry.values.Slug}`} className="writing-row" key={entry.id}><span><strong>{entry.name}</strong><small>{entry.values.Summary}</small></span><span className="writing-date">{entry.values['Published date']?.slice(0,10)}<ArrowUpRight size={13}/></span></Link>)}</div>;
}
