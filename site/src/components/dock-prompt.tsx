'use client';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MagnifyingGlass } from './icons';

const prompts = ['Find a page, or say hello…', 'Explore my projects…', 'See what I’m solving…', 'Switch the lights…'];
export function DockTrigger({ onOpen }: { onOpen: () => void }) {
  const [text, setText] = useState(prompts[0]);
  const reduced = useReducedMotion();
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (reduced || focused) return;
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
  }, [reduced, focused]);
  const visiblePrompt = reduced || focused ? prompts[0] : text;
  return <motion.button className="floating-dock" onClick={onOpen} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} aria-label={`${visiblePrompt} / Open search and contact dock`} whileHover={reduced ? undefined : { y: -2 }} whileTap={reduced ? undefined : { scale: .98 }}><MagnifyingGlass size={16}/><span className="dock-animated-prompt" aria-hidden="true">{visiblePrompt}<i/></span><kbd>/</kbd></motion.button>;
}
