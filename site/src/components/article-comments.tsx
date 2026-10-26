import Link from 'next/link';
import { getPublicMessages } from '@/lib/guestbook-server';
export async function ArticleComments({slug}:{slug:string}) {
  const messages = await getPublicMessages(slug);
  return <section id="comments" className="article-comments"><h2>Comments <span className="article-comment-count">{String(messages.length).padStart(2,'0')}</span></h2><div className="article-comment-prompt"><p>Got something to say? Leave a comment.</p><Link href={`/guestbook?article=${slug}#compose`} className="text-link">Join the discussion ↗</Link></div>{messages.length ? <ul className="public-messages">{messages.map(m=><li key={m.id}><div className="message-byline"><span className="message-initial" aria-hidden="true">{m.name.slice(0,1)}</span><strong>{m.name}</strong>{m.pinned && <span className="message-pin">Pinned</span>}<time dateTime={m.date}>{new Date(m.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'})}</time></div><blockquote><p>{m.text}</p></blockquote></li>)}</ul> : <p className="message-note">No comments yet. Yours can be the first.</p>}</section>;
}
