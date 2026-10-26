import { z } from 'zod';
import type { PublicMessage } from '@/data/messages';

const rows = z.array(z.object({
  id: z.string().uuid(),
  display_name: z.string().max(80),
  message: z.string().max(1200),
  created_at: z.string(),
  pinned: z.boolean().default(false),
}));

export function parsePublicMessages(value: unknown): PublicMessage[] {
  return rows.parse(value).map(row => ({ id: row.id, name: row.display_name, text: row.message, date: row.created_at, pinned: row.pinned }));
}
