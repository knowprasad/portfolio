import { expect, it, vi } from 'vitest';
import { loadPublicProfileImage } from './public-profile-image';

it('returns raster image bytes without forwarding browser credentials', async () => {
  const request = vi.fn<typeof fetch>().mockResolvedValue(new Response(new Uint8Array([1, 2, 3]), { headers: { 'content-type': 'image/png' } }));
  const result = await loadPublicProfileImage('https://avatars.githubusercontent.com/u/123', request);
  expect([...new Uint8Array(result.body)]).toEqual([1, 2, 3]);
  expect(result.type).toBe('image/png');
  expect(request.mock.calls[0][1]?.credentials).toBe('omit');
  expect(request.mock.calls[0][1]?.headers).toBeUndefined();
});
it('checks each redirect before fetching the next host', async () => {
  const request = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 302, headers: { location: 'http://127.0.0.1/private' } }));
  await expect(loadPublicProfileImage('https://github.com/knowprasad.png', request)).rejects.toThrow('Unsupported photo host');
  expect(request).toHaveBeenCalledTimes(1);
});
it('permits the normal GitHub-to-avatar redirect', async () => {
  const request = vi.fn<typeof fetch>().mockResolvedValueOnce(new Response(null, { status: 302, headers: { location: 'https://avatars.githubusercontent.com/u/123' } })).mockResolvedValueOnce(new Response('image', { headers: { 'content-type': 'image/webp' } }));
  expect((await loadPublicProfileImage('https://github.com/knowprasad.png', request)).type).toBe('image/webp');
});
it('rejects script-capable content and oversized streaming bodies', async () => {
  const svg = vi.fn<typeof fetch>().mockResolvedValue(new Response('<svg/>', { headers: { 'content-type': 'image/svg+xml' } }));
  await expect(loadPublicProfileImage('https://images.unsplash.com/photo', svg)).rejects.toThrow('Photo unavailable');
  const large = vi.fn<typeof fetch>().mockResolvedValue(new Response(new Uint8Array(1024 * 1024 + 1), { headers: { 'content-type': 'image/png' } }));
  await expect(loadPublicProfileImage('https://images.unsplash.com/photo', large)).rejects.toThrow('Photo too large');
});
it('rejects private addresses and embedded credentials without making a request', async () => {
  const request = vi.fn<typeof fetch>();
  for (const source of ['https://127.0.0.1/a.png', 'https://user:password@github.com/a.png', 'https://evil.test/a.png']) await expect(loadPublicProfileImage(source, request)).rejects.toThrow('Unsupported photo host');
  expect(request).not.toHaveBeenCalled();
});
