'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from './reader.module.css';

export function ReaderCode({ text, language, ariaLabel = 'Code example' }: { text: string; language?: string; ariaLabel?: string }) {
  const [notice, setNotice] = useState('');
  return <div className={styles.code}><div className={styles.codeBar}><span>{language || 'text'}</span><button type="button" onClick={async () => { try { await navigator.clipboard.writeText(text); setNotice('Copied'); } catch { setNotice('Copy unavailable'); } }}>Copy<span className={styles.srOnly}> code</span></button><span role="status">{notice}</span></div><pre tabIndex={0} role="group" aria-label={ariaLabel}><code>{text}</code></pre></div>;
}

export function ReaderImage({ src, alt, caption, priority = false }: { src: string; alt: string; caption?: string; priority?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  return <figure className={styles.figure}><button type="button" className={styles.imageButton} onClick={() => { setOpen(true); dialog.current?.showModal(); }} aria-label={`View full image${alt ? `: ${alt}` : ''}`}><Image src={src} alt={alt} unoptimized width={1200} height={800} loading={priority ? 'eager' : 'lazy'} style={{ width:'100%',height:'auto' }}/></button>{caption && <figcaption>{caption}</figcaption>}<dialog ref={dialog} className={styles.imageDialog} aria-label="Full image" onClose={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}><button type="button" className={styles.closeImage} onClick={() => dialog.current?.close()} autoFocus>Close image</button>{open && <Image src={src} alt={alt} unoptimized loading="eager" width={1600} height={1000} style={{ width:'auto',height:'auto' }}/>}</dialog></figure>;
}

export function ReaderContents({ headings }: { headings: { id: string; text: string; nested: boolean }[] }) {
  const [active, setActive] = useState('');
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top-b.boundingClientRect.top); if (visible[0]) setActive(visible[0].target.id); }, { rootMargin:'-10% 0px -65% 0px' });
    for (const heading of headings) { const node = document.getElementById(heading.id); if (node) observer.observe(node); }
    return () => observer.disconnect();
  }, [headings]);
  const links = <>{headings.map(h => <a key={h.id} href={`#${h.id}`} className={h.nested ? styles.nested : undefined} aria-current={active === h.id ? 'location' : undefined}>{h.text}</a>)}</>;
  return <><details className={styles.mobileContents}><summary>On this page <span>{headings.length}</span></summary><nav aria-label="Article contents">{links}</nav></details><aside className={styles.contents}><nav aria-label="On this page"><p>On this page <span>{headings.length}</span></p>{links}</nav></aside></>;
}

export function ReaderHighlights() {
  const [enabled, setEnabled] = useState(false);
  return <button type="button" className={styles.highlightToggle} role="switch" aria-checked={enabled} onClick={() => { const next = !enabled; setEnabled(next); const article = document.querySelector('[data-reader]'); if (article instanceof HTMLElement) article.dataset.highlights = String(next); }}>Colour highlights <span aria-hidden="true">{enabled ? 'On' : 'Off'}</span></button>;
}
