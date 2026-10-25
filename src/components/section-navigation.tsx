'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const sections = [['stack', 'Tools'], ['projects', 'Projects'], ['work', 'Work'], ['highlights', 'Highlights'], ['problem-solving', 'Coding'], ['open-source', 'Open source'], ['writing', 'Writing'], ['off-clock', 'Off the clock'], ['leave-message', 'Message']] as const;
export function SectionNavigation() {
  const pathname = usePathname();
  const [active, setActive] = useState('');
  useEffect(() => {
    if (pathname !== '/') return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id === 'intro' ? '' : entry.target.id);
    }, { rootMargin: '-12% 0px -68% 0px' });
    const intro = document.getElementById('intro');
    if (intro) observer.observe(intro);
    for (const [id] of sections) { const section = document.getElementById(id); if (section) observer.observe(section); }
    return () => observer.disconnect();
  }, [pathname]);
  return <nav className="section-navigation" aria-label="Page sections"><Link className="nav-site-mark" href="/#intro" aria-label="Shubham Prasad — home"><Image src="/site-avatar.webp" width={26} height={26} alt="" /></Link>{sections.map(([id, label]) => <a key={id} href={`${pathname === '/' ? '' : '/'}#${id}`} aria-current={pathname === '/' && active === id ? 'location' : undefined}>{label}</a>)}</nav>;
}
