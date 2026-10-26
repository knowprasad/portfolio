'use client';
import Image from 'next/image';
import { useState } from 'react';

export function StackTool({ name, icon, url, category }: { name: string; icon: string; url: string; category: string }) {
  const [dismissed, setDismissed] = useState(false);
  return <a className="stack-symbol" href={url} target="_blank" rel="noreferrer" aria-label={`${name} ${category}`} onFocus={() => setDismissed(false)} onMouseEnter={() => setDismissed(false)} onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); setDismissed(true); } }}><Image src={`/stack-icons/${icon}.svg`} width={20} height={20} alt=""/>{!dismissed && <span className="stack-name" aria-hidden="true"><strong>{name}</strong>{' '}<small>{category}</small></span>}</a>;
}
