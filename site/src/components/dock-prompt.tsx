'use client';
import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

const prompts = ['Find a page, or say hello…', 'Explore my projects…', 'See what I’m solving…', 'Switch the lights…'];
export function DockPrompt() {
  const [text, setText] = useState(prompts[0]);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    let word = 0, length = prompts[0].length, deleting = true;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      length += deleting ? -1 : 1;
      setText(prompts[word].slice(0, length));
      let delay = deleting ? 32 : 65;
      if (length === 0) { deleting = false; word = (word + 1) % prompts.length; delay = 250; }
      else if (length === prompts[word].length) { deleting = true; delay = 2400; }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 2800);
    return () => clearTimeout(timer);
  }, [reduced]);
  return <span className="dock-animated-prompt" aria-hidden="true">{reduced ? prompts[0] : text}<i /></span>;
}
