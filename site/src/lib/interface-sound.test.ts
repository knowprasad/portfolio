import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const start = vi.fn();
let enabled = true;
let state = 'suspended';
let resume: () => Promise<void>;
class TestAudio {
  get state() { return state; }
  currentTime = 8;
  destination = {};
  resume() { return resume(); }
  createOscillator() { return { type: '', frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }, connect: vi.fn(), disconnect: vi.fn(), start, stop: vi.fn(), onended: null }; }
  createGain() { return { gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }, connect: vi.fn(), disconnect: vi.fn() }; }
}
beforeEach(() => {
  vi.resetModules();
  start.mockClear();
  enabled = true; state = 'suspended';
  resume = async () => { state = 'running'; };
  vi.stubGlobal('AudioContext', TestAudio);
  vi.stubGlobal('localStorage', { getItem: () => enabled ? 'on' : 'off' });
});
afterEach(() => vi.unstubAllGlobals());
it('does not play before the visitor opts in', async () => {
  enabled = false;
  await (await import('./interface-sound')).playInterfaceSound();
  expect(start).not.toHaveBeenCalled();
});
it('waits for the mobile audio clock to resume before scheduling a tone', async () => {
  let finish = () => {};
  resume = () => new Promise<void>(resolve => { finish = () => { state = 'running'; resolve(); }; });
  const { playInterfaceSound } = await import('./interface-sound');
  const playing = playInterfaceSound();
  expect(start).not.toHaveBeenCalled();
  finish(); await playing;
  expect(start).toHaveBeenCalledWith(8);
});
it('respects muting while mobile playback permission is pending', async () => {
  let finish = () => {};
  resume = () => new Promise<void>(resolve => { finish = () => { state = 'running'; resolve(); }; });
  const { playInterfaceSound } = await import('./interface-sound');
  const playing = playInterfaceSound();
  enabled = false; finish(); await playing;
  expect(start).not.toHaveBeenCalled();
});
it('does not break navigation if a browser refuses to resume audio', async () => {
  resume = async () => { throw new Error('Playback blocked'); };
  await expect((await import('./interface-sound')).playInterfaceSound()).resolves.toBeUndefined();
  expect(start).not.toHaveBeenCalled();
});
it('supports the prefixed Safari constructor', async () => {
  vi.stubGlobal('AudioContext', undefined);
  vi.stubGlobal('webkitAudioContext', TestAudio);
  await (await import('./interface-sound')).playInterfaceSound('reveal');
  expect(start).toHaveBeenCalledWith(8);
});
