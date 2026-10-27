import Link from 'next/link';
import { ArrowUpRight, ArrowLeft } from './icons';
import { Reveal } from './site-chrome';
import Image from 'next/image';
import { profile } from '@/data/site';
import { getFriends } from '@/lib/portfolio-content';
import { FooterContact } from './footer-contact';
import { SocialLinks } from './social-links';
import { VisitorCount } from './visitor-count';
import { PortfolioService } from './portfolio-service';
export function Section({ id, title, count, href, action, children }: { id: string; title: string; count?: string; href?: string; action?: string; children: React.ReactNode }) {
  return <section className="section" id={id}><Reveal><div className="section-heading"><h2>{title}</h2>{count && <span className="section-count">{count}</span>}{href && <Link href={href} className="section-link">{action || 'View all'} <ArrowUpRight size={13} /></Link>}</div>{children}</Reveal></section>;
}
export async function Footer() {
  const friends = await getFriends();
  return <footer className="site-footer compact-footer"><div className="footer-row"><span>© {new Date().getFullYear()} Shubham Prasad</span><VisitorCount /><span className="footer-hint">Press <kbd>/</kbd> to open the dock</span></div><div id="friends" className="friends-section" role="group" aria-labelledby="friends-heading"><div className="friends-heading"><h2 id="friends-heading">Friends</h2></div>{friends.length ? <div className="friend-links">{friends.map(friend => <a className="friend-link" href={friend.url} key={friend.url} target="_blank" rel="noreferrer" title={friend.note || friend.url}><span className="friend-avatar">{friend.avatar ? <Image src={friend.avatar} alt="" width={34} height={34} /> : friend.name.slice(0, 1).toUpperCase()}</span><span>{friend.name}</span></a>)}</div> : <p className="friends-empty">A few good corners will find their way here soon.</p>}</div><nav className="friend-navigation" aria-label="Explore friends">{friends.length ? <a href={friends[friends.length - 1].url} rel="noreferrer" target="_blank"><ArrowLeft size={12} /> prev</a> : <button disabled title="Add friends to enable navigation"><ArrowLeft size={12} /> prev</button>}<a href="#friends">around the web</a>{friends.length ? <a href={friends[0].url} rel="noreferrer" target="_blank">next <ArrowLeft size={12} style={{ rotate: '180deg' }} /></a> : <button disabled title="Add friends to enable navigation">next <ArrowLeft size={12} style={{ rotate: '180deg' }} /></button>}</nav><div className="footer-bottom-links"><FooterContact email={profile.email} /><SocialLinks /></div><PortfolioService /></footer>;
}
