'use client';
import Image from 'next/image';
import { useState } from 'react';
import { GithubLogo } from './icons';

// First-party image optimization avoids requiring a visitor to reach GitHub's CDN.
// Failed deliveries retain the link's layout and accessible name without a broken image.
export function GithubAvatar({ login, src, size, className = '' }: { login: string; src?: string; size: number; className?: string }) {
  const source = src || `https://github.com/${encodeURIComponent(login)}.png?size=${Math.max(size * 2, 64)}`;
  const [failedSource, setFailedSource] = useState<string | null>(null);
  return <span className={`github-avatar ${className}`} style={{ width: size, height: size }} aria-hidden="true">
    {failedSource === source ? <span className="github-avatar-fallback"><GithubLogo size={Math.round(size * .62)}/></span> : <Image src={source} width={size} height={size} sizes={`${size}px`} unoptimized={source.startsWith('/api/profile-photo')} alt="" onError={() => setFailedSource(source)}/>}
  </span>;
}
