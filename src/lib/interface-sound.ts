// Generated locally with Web Audio; nothing downloads or plays until opted in.
export const soundKey = 'portfolio-sound';
export const soundEvent = 'portfolio-sound-change';
export function soundEnabled() {
  try { return localStorage.getItem(soundKey) === 'on'; } catch { return false; }
}
let audio: AudioContext | null = null;
export function playInterfaceSound(kind: 'click' | 'reveal' = 'click') {
  if (!soundEnabled()) return;
  try {
    audio ||= new AudioContext();
    void audio.resume();
    const tone = audio.createOscillator(), gain = audio.createGain();
    const now = audio.currentTime, reveal = kind === 'reveal';
    tone.type = 'sine';
    tone.frequency.setValueAtTime(reveal ? 440 : 620, now);
    tone.frequency.exponentialRampToValueAtTime(reveal ? 880 : 390, now + (reveal ? .11 : .035));
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(.025, now + .008);
    gain.gain.exponentialRampToValueAtTime(.0001, now + (reveal ? .17 : .045));
    tone.connect(gain); gain.connect(audio.destination);
    tone.onended = () => { tone.disconnect(); gain.disconnect(); };
    tone.start(); tone.stop(now + (reveal ? .18 : .05));
  } catch { /* Sound must never prevent an interaction. */ }
}
