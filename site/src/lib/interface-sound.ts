// Generated locally with Web Audio; nothing downloads or plays until opted in.
export const soundKey = 'portfolio-sound';
export const soundEvent = 'portfolio-sound-change';
export function soundEnabled() {
  try { return localStorage.getItem(soundKey) === 'on'; } catch { return false; }
}
let audio: AudioContext | null = null;
export async function playInterfaceSound(kind: 'click' | 'reveal' = 'click') {
  if (!soundEnabled()) return;
  try {
    const Audio = globalThis.AudioContext || (globalThis as typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Audio) return;
    if (!audio || audio.state === 'closed') audio = new Audio();
    const context = audio;
    // Mobile browsers may suspend or interrupt audio between taps. Resume during
    // the user gesture, then schedule against the resumed clock, never before it.
    if (context.state !== 'running') await context.resume();
    if (context.state !== 'running' || !soundEnabled()) return;
    const tone = context.createOscillator(), gain = context.createGain();
    const now = context.currentTime, reveal = kind === 'reveal';
    tone.type = 'sine';
    tone.frequency.setValueAtTime(reveal ? 440 : 620, now);
    tone.frequency.exponentialRampToValueAtTime(reveal ? 880 : 390, now + (reveal ? .11 : .035));
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(.025, now + .008);
    gain.gain.exponentialRampToValueAtTime(.0001, now + (reveal ? .17 : .045));
    tone.connect(gain); gain.connect(context.destination);
    tone.onended = () => { tone.disconnect(); gain.disconnect(); };
    tone.start(now); tone.stop(now + (reveal ? .18 : .05));
  } catch { /* Sound must never prevent an interaction. */ }
}
