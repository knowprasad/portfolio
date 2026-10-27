'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import { MagnifyingGlass, ArrowUpRight, ArrowLeft, X, Moon, Clock, EnvelopeSimple, PaperPlaneTilt, GithubLogo } from '@/components/icons';
import { projects, profile } from '@/data/site';
import { ThemeChoices } from './theme-control';
import { DockTrigger } from './dock-prompt';
import { mergeSearchEntries, type SearchEntry as Entry } from '@/lib/search-index';

const fallbackProjectPaths = new Set(projects.map(project => `/projects/${project.slug}`));
const entries: Entry[] = [
  { title: 'Home', subtitle: 'A little about me', href: '/' }, { title: 'Projects', subtitle: 'Things I am building', href: '/projects' },
  ...projects.map(p => ({ title: p.name, subtitle: p.description, href: `/projects/${p.slug}` })),
  ...[['Activity', '/activity'], ['Writing', '/writing'], ['Bookshelf', '/books'], ['Articles & papers', '/articles'], ['Watchlist', '/watchlist'], ['Channels', '/channels'], ['Places', '/places'], ['Leave a message', '/guestbook'], ['Résumé', '/resume'], ['Book a call', '/book']].map(([title, href]) => ({ title, subtitle: 'Page', href })),
  { title: 'Say hello', subtitle: 'Write me a message', action: 'compose' }, { title: 'Switch theme', subtitle: 'Auto, Light or Dark', action: 'theme' }, { title: 'Local time', subtitle: 'The time in India', action: 'time' },
];
const draftKey = 'portfolio-contact-draft';
export function Dock() {
  const [mode, setMode] = useState<'search' | 'compose' | 'time' | 'theme'>('search');
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const [draft, setDraft] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [localTime, setLocalTime] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const [contentEntries, setContentEntries] = useState<Entry[]>([]);
  const [searchRequested, setSearchRequested] = useState(false);
  const [searchAttempt, setSearchAttempt] = useState(0);
  const [searchSource, setSearchSource] = useState<'loading' | 'live' | 'fallback'>('loading');
  const searchEntries = useMemo(() => mergeSearchEntries(entries, contentEntries, fallbackProjectPaths, searchSource), [contentEntries, searchSource]);
  useEffect(() => {
    if (!searchRequested) return;
    const abort = new AbortController();
    fetch('/api/search',{signal:abort.signal}).then(response=>{if(!response.ok)throw new Error('Search unavailable');return response.json();}).then((data: unknown)=>{if(!Array.isArray(data))throw new Error('Invalid search index');setContentEntries(data.filter((entry):entry is Entry=>Boolean(entry && typeof entry.title==='string' && typeof entry.subtitle==='string' && typeof entry.href==='string' && entry.href.startsWith('/') && !entry.href.startsWith('//'))));setSearchSource('live');}).catch(()=>{if(!abort.signal.aborted)setSearchSource('fallback');});
    return ()=>abort.abort();
  },[searchRequested,searchAttempt]);
  const fuse = useMemo(() => searchRequested ? new Fuse(searchEntries, { keys: [{ name: 'title', weight: .55 }, { name: 'subtitle', weight: .3 }, { name: 'body', weight: .15 }], threshold: .35, ignoreLocation:true }) : null, [searchRequested, searchEntries]);
  const results = useMemo(() => query.trim() && fuse ? fuse.search(query).map(result => result.item) : searchEntries.slice(0, 7), [query, fuse, searchEntries]);
  const formId = process.env.NEXT_PUBLIC_FORMSPREE_ID;
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || profile.email;

  function open(next: typeof mode = 'search') {
    opener.current = document.activeElement as HTMLElement;
    setMode(next); setIndex(0); setStatus('idle');
    if (next === 'search') { setSearchRequested(true); setQuery(''); }
    dialog.current?.showModal();
    if (next === 'search') requestAnimationFrame(() => input.current?.focus());
  }
  function restoreDraft() {
    try { const saved = JSON.parse(localStorage.getItem(draftKey) || 'null'); if (saved && ['name', 'email', 'message'].every(key => typeof saved[key] === 'string')) setDraft({ name: saved.name.slice(0, 100), email: saved.email.slice(0, 254), message: saved.message.slice(0, 5000) }); } catch { /* A malformed draft should never block the dock. */ }
  }
  function close() { dialog.current?.close(); opener.current?.focus(); }
  function choose(entry: Entry) {
    if (entry.href) { close(); router.push(entry.href); }
    else if (entry.action === 'theme') { setMode('theme'); }
    else if (entry.action === 'compose') { restoreDraft(); setMode('compose'); setStatus('idle'); }
    else { setLocalTime(new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit' }).format(new Date())); setMode('time'); }
  }
  useEffect(() => {
    const keyboard = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.key === 'Escape' && dialog.current?.open) { event.preventDefault(); dialog.current.close(); return; }
      if (target.closest('input,textarea,[contenteditable="true"]') || document.querySelector('dialog[open]')) return;
      if (event.key === '/' || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k')) { event.preventDefault(); opener.current = target; setSearchRequested(true); setMode('search'); setQuery(''); setIndex(0); dialog.current?.showModal(); requestAnimationFrame(() => input.current?.focus()); }
    };
    const compose = () => { opener.current = document.activeElement as HTMLElement; restoreDraft(); setMode('compose'); dialog.current?.showModal(); };
    window.addEventListener('keydown', keyboard); window.addEventListener('portfolio-contact', compose);
    return () => { window.removeEventListener('keydown', keyboard); window.removeEventListener('portfolio-contact', compose); };
  }, []);
  function updateDraft(next: typeof draft) { setDraft(next); try { localStorage.setItem(draftKey, JSON.stringify(next)); } catch { /* Compose remains available without storage. */ } }
  async function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formId) {
      if (email) window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Portfolio note from ${draft.name.replace(/[\r\n]/g, ' ')}`)}&body=${encodeURIComponent(`${draft.message}\n\nReply to: ${draft.email}`)}`;
      return;
    }
    setStatus('sending');
    try { const response = await fetch(`https://formspree.io/f/${encodeURIComponent(formId)}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(draft) }); if (!response.ok) throw new Error('Delivery failed'); setStatus('sent'); updateDraft({ name: '', email: '', message: '' }); } catch { setStatus('error'); }
  }
  return <><DockTrigger onOpen={() => open()}/>
    <dialog ref={dialog} className={`dock-dialog mode-${mode}`} aria-labelledby="dock-title" onClose={() => opener.current?.focus()} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close(); } }}><div className="dock-heading">{mode !== 'search' && <button onClick={() => { setSearchRequested(true); setMode('search'); }} className="icon-button" aria-label="Back to search"><ArrowLeft size={17} /></button>}<h2 id="dock-title">{mode === 'compose' ? 'Say hello' : mode === 'time' ? 'A little time check' : mode === 'theme' ? 'Choose theme' : 'Where would you like to go?'}</h2><button onClick={close} className="icon-button" aria-label="Close dock"><X size={18} /></button></div>
      {mode === 'search' && <><div className="search-field"><MagnifyingGlass size={18} /><input ref={input} aria-label="Search the whole website" role="combobox" aria-expanded="true" aria-controls="dock-results" aria-activedescendant={results[index] ? `result-${index}` : undefined} value={query} onChange={event => { setQuery(event.target.value); setIndex(0); }} placeholder="Projects, writing, theme, time..." onKeyDown={event => { if (['ArrowDown', 'ArrowUp'].includes(event.key)) { event.preventDefault(); if (results.length) setIndex((index + (event.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length); } else if (event.key === 'Enter' && results[index]) { event.preventDefault(); choose(results[index]); } }} /></div>{searchSource === 'loading' && <p className="search-empty" role="status">Loading published content…</p>}{searchSource === 'fallback' && <div className="search-recovery"><p role="status">Published content couldn’t load. Built-in pages are still available.</p><button type="button" data-search-retry onClick={() => { setSearchSource('loading'); setSearchAttempt(attempt => attempt + 1); }}>Retry</button></div>}<div id="dock-results" role="listbox" aria-label="Search results" className="dock-results">{results.length ? results.map((entry, i) => <button id={`result-${i}`} key={entry.title} role="option" aria-selected={i === index} onMouseEnter={() => setIndex(i)} onClick={() => choose(entry)} className={i === index ? 'active' : ''}><span><strong>{entry.title}</strong><small>{entry.subtitle}</small></span><ArrowUpRight size={14} /></button>) : searchSource === 'loading' ? null : <p className="search-empty">No matches. Try a project name or “theme”.</p>}</div><div className="dock-shortcuts"><button onClick={() => { restoreDraft(); setMode('compose'); }}><EnvelopeSimple size={14} />Say hello</button><button onClick={() => setMode('theme')}><Moon size={14} />Theme</button><span>↑ ↓ navigate · ↵ open</span></div></>}
      {mode === 'compose' && <form className="contact-form" onSubmit={send}><p>A question, an idea, or just a hello.</p>{!formId && <div className="contact-notice">Continue in your mail app to send this private note. Your draft stays in this browser.{email && <> You can <a href={`mailto:${email}`}>email me directly</a>.</>}</div>}<label>Your name<input required maxLength={100} value={draft.name} onChange={event => updateDraft({ ...draft, name: event.target.value })} autoComplete="name" /></label><label>Email<input type="email" required maxLength={254} value={draft.email} onChange={event => updateDraft({ ...draft, email: event.target.value })} autoComplete="email" /></label><label>Message<textarea required maxLength={5000} rows={4} value={draft.message} onChange={event => updateDraft({ ...draft, message: event.target.value })} /></label><div className="contact-actions"><a className="text-link" href="https://github.com/knowprasad" target="_blank" rel="noreferrer"><GithubLogo size={15} />Find me on GitHub</a><button type="submit" className="button primary" disabled={(!formId && !email) || status === 'sending'}><PaperPlaneTilt size={15} />{status === 'sending' ? 'Sending…' : formId ? 'Send message' : 'Open email app'}</button></div><p aria-live="polite">{status === 'sent' ? 'Your message was sent. Thank you!' : status === 'error' ? 'The message could not be sent. Your draft is saved; please try again.' : ''}</p></form>}
      {mode === 'theme' && <ThemeChoices onSelect={close}/>}
      {mode === 'time' && <div className="time-card"><Clock size={28} /><strong>{localTime}</strong><p>India · Asia/Kolkata</p></div>}
    </dialog></>;
}
export function ContactButton() { return <button className="button" onClick={() => window.dispatchEvent(new Event('portfolio-contact'))}><EnvelopeSimple size={15} />Say hi</button>; }
