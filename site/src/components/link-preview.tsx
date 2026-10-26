'use client';
import { useEffect, useId, useRef, useState, type AnchorHTMLAttributes } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { GithubAvatar } from './github-avatar';
import { ArrowUpRight, GithubLogo, LinkedinLogo, Globe } from '@/components/icons';

type Preview = { title: string; description: string; details?: string; image?: string; imageAlt?: string; avatar?: string; label?: string };
type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; preview: Preview };

// Metadata is prepared on the server; hovering never starts a profile API or screenshot request.
export function LinkPreview({ preview, children, onMouseEnter, onMouseLeave, onFocus, onBlur, ...props }: Props) {
  const [position, setPosition] = useState<{ left: number; top: number; below: boolean } | null>(null);
  const anchor = useRef<HTMLAnchorElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();
  const controller = useRef<AbortController | null>(null);
  const portal = useRef<HTMLDivElement | null>(null);
  const clear = () => { if (timer.current) clearTimeout(timer.current); };
  function hide(immediate = false) {
    clear();
    const close = () => { setPosition(null); controller.current?.abort(); };
    if (immediate) close(); else timer.current = setTimeout(close, 130);
  }
  function show(immediate = false) {
    clear(); controller.current?.abort();
    const subscription = new AbortController(); controller.current = subscription;
    // Only an active/pending preview subscribes; closed links add no global listeners.
    window.addEventListener('keydown', event => { if (event.key === 'Escape') hide(true); }, { signal: subscription.signal });
    window.addEventListener('scroll', event => {
      if (event.target instanceof Node && portal.current?.contains(event.target)) return;
      if (document.activeElement === anchor.current) {
        clear(); setPosition(null);
        timer.current = setTimeout(() => { if (document.activeElement === anchor.current) show(true); }, 120);
      } else hide(true);
    }, { signal: subscription.signal, capture: true, passive: true });
    window.addEventListener('resize', () => hide(true), { signal: subscription.signal });
    timer.current = setTimeout(() => {
      const rect = anchor.current?.getBoundingClientRect();
      if (!rect) { subscription.abort(); return; }
      if (rect.bottom < 0 || rect.top > innerHeight) {
        if (document.activeElement !== anchor.current) subscription.abort();
        return;
      }
      const below = rect.top < (preview.image ? 310 : 180) + 15;
      setPosition({ left: Math.max(12, Math.min(rect.left, innerWidth - 308)), top: below ? rect.bottom + 9 : rect.top - 9, below });
    }, immediate ? 0 : 260);
  }
  function placePreview(node: HTMLDivElement | null) {
    portal.current = node;
    const rect = anchor.current?.getBoundingClientRect();
    if (!node || !rect) return;
    const height = Math.min(node.offsetHeight, innerHeight - 24);
    const below = rect.top < height + 20 && innerHeight - rect.bottom >= height + 20;
    const preferred = below ? rect.bottom + 9 : rect.top - height - 9;
    node.style.top = `${Math.max(12, Math.min(preferred, innerHeight - height - 12))}px`;
    node.style.transform = 'none';
    node.style.maxHeight = `${innerHeight - 24}px`;
    node.style.overflowY = 'auto';
  }
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); controller.current?.abort(); }, []);
  const host = new URL(props.href, 'https://knowprasad.me').hostname.replace(/^www\./, '');
  const Icon = host === 'github.com' ? GithubLogo : host.endsWith('linkedin.com') ? LinkedinLogo : Globe;
  return <><a {...props} ref={anchor} aria-describedby={position ? id : props['aria-describedby']} onMouseEnter={event => { onMouseEnter?.(event); if (document.activeElement === anchor.current) return; if (matchMedia('(hover:hover) and (pointer:fine)').matches) show(); }} onMouseLeave={event => { onMouseLeave?.(event); if (document.activeElement !== anchor.current) hide(); }} onFocus={event => { onFocus?.(event); show(true); }} onBlur={event => { onBlur?.(event); hide(true); }}>{children}</a>{position && createPortal(<div ref={placePreview} id={id} role="tooltip" className={`link-preview ${position.below ? 'preview-below' : 'preview-above'}`} style={{ left: position.left, top: position.top }} onMouseEnter={clear} onMouseLeave={() => hide()}>{preview.image && <Image className="link-preview-image" src={preview.image} width={590} height={330} alt={preview.imageAlt || ''} unoptimized />}<div className="link-preview-content"><span className="link-preview-source"><Icon size={14} />{preview.label || host}<ArrowUpRight size={11} /></span><strong className={preview.avatar ? 'preview-profile-title' : undefined}>{preview.avatar && <GithubAvatar login="knowprasad" src={preview.avatar} size={38} className="preview-profile-avatar" />}{preview.title}</strong><p>{preview.description}</p>{preview.details && <p className="preview-profile-facts">{preview.details}</p>}<small>{host}</small></div></div>, document.body)}</>;
}
