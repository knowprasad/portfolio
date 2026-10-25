'use client';
import { useState } from 'react';
import { Copy, Check, ArrowUpRight } from '@/components/icons';

export function FooterContact({ email }: { email: string }) {
  const [status, setStatus] = useState('');
  async function copy() {
    try { await navigator.clipboard.writeText(email); setStatus('Email copied'); }
    catch { setStatus('Copy is unavailable. Use the Email link to open your mail app.'); }
  }
  return <div className="footer-contact"><div className="footer-email-row"><a href={`mailto:${email}`}>Email <ArrowUpRight size={17} /></a><button className="copy-email-button" onClick={copy} aria-label="Copy email address">{status === 'Email copied' ? <Check size={15} /> : <Copy size={15} />}<span>{status === 'Email copied' ? 'Copied' : 'Copy email'}</span></button></div><span className="copy-status" aria-live="polite">{status}</span></div>;
}
