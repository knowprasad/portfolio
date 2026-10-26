'use client';
import Link from 'next/link';
import { SectionNavigation } from './section-navigation';
import { SoundToggle } from './sound-toggle';
import { useEffect, useState } from 'react';
import { motion, useScroll } from 'motion/react';
import { Moon, Sun } from '@/components/icons';

let themeTransitionRunning = false;
export function toggleTheme(origin?: { clientX?: number; clientY?: number }) {
  if (themeTransitionRunning) return;
  const root = document.documentElement;
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  const apply = () => {
    root.dataset.theme = next;
    try { localStorage.setItem('portfolio-theme', next); } catch { /* Theme still works without storage. */ }
    window.dispatchEvent(new Event('portfolio-theme'));
  };
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) { apply(); return; }
  const rect = document.activeElement?.getBoundingClientRect();
  const x = origin?.clientX ?? (rect ? rect.left + rect.width / 2 : innerWidth / 2);
  const y = origin?.clientY ?? (rect ? rect.top + rect.height / 2 : 36);
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  themeTransitionRunning = true;
  const transition = document.startViewTransition(apply);
  void transition.ready.then(() => {
    root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] }, { duration: 900, easing: 'cubic-bezier(.32,.72,0,1)', fill: 'both', pseudoElement: '::view-transition-new(root)' });
  }).catch(() => { /* An interrupted transition keeps the selected theme. */ });
  void transition.finished.finally(() => { themeTransitionRunning = false; }).catch(() => {});
}
export function SiteChrome() {
  const { scrollYProgress } = useScroll();
  const [theme, setTheme] = useState('dark');
  useEffect(() => {
    const sync = () => setTheme(document.documentElement.dataset.theme || 'dark');
    sync(); window.addEventListener('portfolio-theme', sync);
    return () => window.removeEventListener('portfolio-theme', sync);
  }, []);
  return <><motion.div className="reading-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" /><header className="site-header"><a className="skip-link" href="#main">Skip to content</a><Link href="/" className="brand">knowprasad<span className="brand-period">.</span></Link><div className="header-actions"><SoundToggle /><button className="icon-button theme-key" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title="Toggle theme">{theme === 'dark' ? <Moon size={17} /> : <Sun size={18} />}</button></div></header><SectionNavigation /></>;
}
export function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className}><div className="section-reveal">{children}</div></div>;
}
export function LocalTime() {
  const [time, setTime] = useState('India · IST');
  useEffect(() => { const update = () => setTime(new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date())); update(); const timer = setInterval(update, 30000); return () => clearInterval(timer); }, []);
  return <span className="local-time"><span className="time-dot" />India <span className="time-divider">/</span> <time>{time}</time></span>;
}
