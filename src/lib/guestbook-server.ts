import 'server-only';
import { z } from 'zod';
import { authConfig } from './auth-config';
import { publicMessages, type PublicMessage } from '@/data/messages';

const rows = z.array(z.object({ id: z.string().uuid(), display_name: z.string().max(80), message: z.string().max(1200), created_at: z.string() }));
export async function getPublicMessages(article?: string): Promise<PublicMessage[]> {
  const config = authConfig();
  if (!config) return publicMessages;
  try {
    // Anon key + RLS: only approved text/name/date are selectable. No auth cookies.
    const response = await fetch(`${config.url}/rest/v1/guestbook_messages?select=id,display_name,message,created_at&article_slug=${article ? `eq.${encodeURIComponent(article)}` : 'is.null'}&order=created_at.desc&limit=100`, { headers: { apikey: config.key }, signal: AbortSignal.timeout(5000), next: { revalidate: 60 } });
    if (!response.ok) throw new Error('Public messages unavailable');
    return rows.parse(await response.json()).map(row => ({ id: row.id, name: row.display_name, text: row.message, date: row.created_at }));
  } catch { return publicMessages; }
}
