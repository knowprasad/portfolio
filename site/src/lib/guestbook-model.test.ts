import { expect, it } from 'vitest';
import { parsePublicMessages } from './guestbook-model';

it('preserves owner pins while exposing only public comment fields', () => {
  const messages = parsePublicMessages([{ id: '405e990a-0e97-4e93-ae0a-058101511410', display_name: 'Visitor', message: 'Hello', created_at: '2026-10-26T00:00:00Z', pinned: true, user_id: 'private', status: 'approved' }]);
  expect(messages).toEqual([{ id: '405e990a-0e97-4e93-ae0a-058101511410', name: 'Visitor', text: 'Hello', date: '2026-10-26T00:00:00Z', pinned: true }]);
});

it('treats older unpinned rows as unpinned and rejects invalid pin values', () => {
  const row = { id: '405e990a-0e97-4e93-ae0a-058101511410', display_name: 'Visitor', message: 'Hello', created_at: '2026-10-26T00:00:00Z' };
  expect(parsePublicMessages([row])[0].pinned).toBe(false);
  expect(() => parsePublicMessages([{ ...row, pinned: 'true' }])).toThrow();
});
