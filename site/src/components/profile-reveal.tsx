'use client';
import Image from 'next/image';
import { useState } from 'react';
import { playInterfaceSound } from '@/lib/interface-sound';
export function ProfileReveal({ photo = '' }: { photo?: string }) {
  const [revealed, setRevealed] = useState(false);
  const [failedPhoto, setFailedPhoto] = useState<string | null>(null);
  const unavailable = failedPhoto === photo;
  const photoSource = unavailable ? '/site-avatar.webp' : '/api/profile-photo';
  function reveal() { setRevealed(value => !value); playInterfaceSound('reveal'); }
  return <button type="button" data-own-sound className={`profile-reveal ${revealed ? 'is-revealed' : ''}`} aria-pressed={revealed} aria-label={revealed ? unavailable ? 'Photo unavailable. Show anime avatar' : 'You found me! Show anime avatar' : 'psst, click me! Reveal Shubham’s photo'} onClick={reveal}>
    <Image className="profile-anime" src="/site-avatar.webp" width={76} height={76} alt="" priority />
    <Image className="profile-photo" src={photoSource} unoptimized={photoSource.startsWith('/api/')} width={76} height={76} alt="" priority onError={() => setFailedPhoto(photo)} />
    <span className="profile-status" aria-hidden="true" />
    <span className="profile-reveal-hint" aria-hidden="true">{revealed ? unavailable ? 'Photo unavailable' : 'You found me!' : 'psst, click me!'}<svg viewBox="0 0 48 24" fill="none"><path d="M2 21C14 20 20 5 44 8m-7-5 8 5-7 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
  </button>;
}
