'use client';
import { useEffect, useState } from 'react';
export function VisitorCount() {
  const [count,setCount] = useState<number | null>(null);
  useEffect(()=>{const controller=new AbortController();fetch('/api/visitors',{method:'POST',signal:controller.signal}).then(response=>response.status===403?fetch('/api/visitors',{signal:controller.signal}).then(read=>read.ok?read.json():null):response.ok?response.json():null).then(value=>{if(typeof value?.count==='number')setCount(value.count);}).catch(()=>{});return()=>controller.abort();},[]);
  return <span className="visitor-count" title="Approximate browsers counted since launch. Cleared cookies and different devices may count again.">{count === null ? '—' : count.toLocaleString()} visitors</span>;
}
