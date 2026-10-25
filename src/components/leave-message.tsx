import Link from 'next/link';
import { getPublicMessages } from '@/lib/guestbook-server';
import { MessageSignIn } from './message-sign-in';
export async function LeaveMessage({full=false}:{full?:boolean}) {
 const all=await getPublicMessages(); const messages=full?all:all.slice(0,3);
 return <div className="message-book">{!full && <MessageSignIn/>}{messages.length>0 && <ul className="public-messages">{messages.map(m=><li key={m.id}><span className="message-initial" aria-hidden="true">{m.name.slice(0,1).toUpperCase()}</span><div className="message-content"><div className="message-byline"><strong>{m.name}</strong><time dateTime={m.date}>{new Date(m.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'})}</time></div><blockquote><p>{m.text}</p></blockquote></div></li>)}</ul>}{!messages.length && <p className="message-empty-hint">No public messages yet. Be the first to say hello.</p>}{!full && <div className="message-view-all"><Link href="/guestbook" className="text-link">{all.length?`View all ${all.length} messages`:'Leave a message'} →</Link></div>}</div>;
}
