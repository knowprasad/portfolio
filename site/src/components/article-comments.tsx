import Link from 'next/link';
import { getPublicMessages } from '@/lib/guestbook-server';
export async function ArticleComments({slug}:{slug:string}) {
  const messages = await getPublicMessages(slug);
  return <section id="comments" className="article-comments"><h2>Discussion</h2><p className="message-note">Comments appear after review. Your email is never shown.</p>{messages.length ? <ul className="public-messages">{messages.map(m=><li key={m.id}><div className="message-byline"><span className="message-initial" aria-hidden="true">{m.name.slice(0,1)}</span><strong>{m.name}</strong><time dateTime={m.date}>{new Date(m.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'})}</time></div><blockquote><p>{m.text}</p></blockquote></li>)}</ul> : <p>No comments yet.</p>}<Link href={`/guestbook?article=${slug}#compose`} className="text-link">Join the discussion ↗</Link></section>;
}
