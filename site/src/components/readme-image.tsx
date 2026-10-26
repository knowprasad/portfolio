'use client';
import { useState } from 'react';

export function ReadmeImage({ src, alt }: { src?: string; alt?: string }) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  if (!src || failedSource === src) return <span className="readme-image-fallback">{alt || 'Repository image'}</span>;
  // README images include badges and diagrams with unknown intrinsic sizes.
  // Preserve their natural proportions rather than forcing a cover-card ratio.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt || ''} loading="lazy" decoding="async" ref={node => { if (node?.complete && !node.naturalWidth) setFailedSource(src); }} onError={() => setFailedSource(src)}/>;
}
