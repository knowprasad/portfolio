'use client';
import Link from 'next/link';
import { SectionNavigation } from './section-navigation';
import { SoundToggle } from './sound-toggle';
import { useEffect, useState } from 'react';
import { motion, useScroll } from 'motion/react';
import { ThemeMenu } from './theme-control';
import { usePathname } from 'next/navigation';

export function SiteChrome() {
  const pathname = usePathname();
  const writing = pathname === '/writing' || pathname.startsWith('/writing/');
  const projects = pathname === '/projects' || pathname.startsWith('/projects/');
  const personal = ['books','watchlist','places','articles','channels'].find(section=>pathname==='/' + section||pathname.startsWith('/'+section+'/'));
  const quiet = writing || projects || Boolean(personal);
  const collection = personal || (projects ? 'projects' : 'writing');
  const { scrollYProgress } = useScroll();
  return <><motion.div className="reading-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" /><header className={`site-header${quiet ? projects || personal ? ' project-archive-header' : ' writing-header' : ''}`}><a className="skip-link" href="#main">Skip to content</a>{quiet ? <nav className="writing-breadcrumb" aria-label="Breadcrumb"><Link href="/">knowprasad</Link><span>/</span><Link href={`/${collection}`} aria-current={pathname === `/${collection}` ? 'page' : undefined}>{collection}</Link>{pathname !== `/${collection}` && <><span>/</span><span aria-current="page">{(pathname.split('/')[2] || '').replaceAll('-',' ')}</span></>}</nav> : <Link href="/" className="brand">knowprasad<span className="brand-period">.</span></Link>}<div className="header-actions">{!quiet && <SoundToggle />}<ThemeMenu /></div></header>{!quiet && <SectionNavigation />}</>;
}
export function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className}><div className="section-reveal">{children}</div></div>;
}
export function LocalTime() {
  const [time, setTime] = useState('India · IST');
  useEffect(() => { const update = () => setTime(new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date())); update(); const timer = setInterval(update, 30000); return () => clearInterval(timer); }, []);
  return <span className="local-time"><span className="time-dot" />India <span className="time-divider">/</span> <time>{time}</time></span>;
}
