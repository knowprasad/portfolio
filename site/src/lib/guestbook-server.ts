import 'server-only';
import { authConfig } from './auth-config';
import { publicMessages, type PublicMessage } from '@/data/messages';
import { parsePublicMessages } from './guestbook-model';

export async function getPublicMessages(article?: string): Promise<PublicMessage[]> {
  const config = authConfig();
  if (!config) return publicMessages;
  try {
    // Anon key + RLS: only approved text/name/date are selectable. No auth cookies.
    const response = await fetch(`${config.url}/rest/v1/guestbook_messages?select=id,display_name,message,created_at,pinned&article_slug=${article ? `eq.${encodeURIComponent(article)}` : 'is.null'}&order=pinned.desc,created_at.desc&limit=100`, { headers: { apikey: config.key }, signal: AbortSignal.timeout(5000), next: { revalidate: 60, tags: ['guestbook-messages'] } });
    if (!response.ok) throw new Error('Public messages unavailable');
    return parsePublicMessages(await response.json());
  } catch { return publicMessages; }
}
