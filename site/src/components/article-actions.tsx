'use client';
import { useState } from 'react';
export function ArticleActions() {
  const [copied,setCopied] = useState(false);
  async function copy() { try { await navigator.clipboard.writeText(location.href); setCopied(true); setTimeout(()=>setCopied(false),2000); } catch { setCopied(false); } }
  return <div className="article-actions"><button className="text-link" onClick={copy}>{copied ? 'Link copied' : 'Copy article link'}</button><button className="text-link" onClick={async()=>{if(navigator.share) { try { await navigator.share({title:document.title,url:location.href}); } catch {} } else await copy();}}>Share</button></div>;
}
