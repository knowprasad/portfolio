'use client';
import { useActionState } from 'react';
import { postMessage } from '@/app/guestbook/actions';
export function PublicMessageForm({ name, article }: { name: string; article?: string }) {
  const [state, action, pending] = useActionState(postMessage, { message: '', success: false });
  return <form action={action} className="public-message-form">{article && <input type="hidden" name="article" value={article}/>}<label>Display name<input name="name" defaultValue={name} required maxLength={80} autoComplete="name" /></label><label>Your message<textarea name="message" rows={4} required maxLength={1200} placeholder="A thought, a question, a small hello." /></label><p>Your name and message become public after review. Your Google email stays private.</p><button className="button primary" disabled={pending || state.success}>{pending ? 'Posting…' : state.success ? 'Submitted for review' : 'Post message'}</button><p role="status">{state.message}</p></form>;
}
