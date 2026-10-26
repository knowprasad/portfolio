import { expect, it, vi } from 'vitest';
import { loadProjectReadme, projectRepository, readmeUrl } from './project-readme';

it('accepts a repository root but rejects credentials, alternate hosts and arbitrary paths', () => {
  expect(projectRepository('https://github.com/knowprasad/merix.git')?.name).toBe('merix');
  for (const url of ['https://github.com.evil.test/a/b', 'http://github.com/a/b', 'https://user:secret@github.com/a/b', 'https://github.com/a/b/tree/main', 'https://github.com/a/b?url=http://localhost', 'https://127.0.0.1/a/b']) expect(projectRepository(url)).toBeNull();
});
it('fetches only public raw content, without forwarding any credentials', async () => {
  const request = vi.fn<typeof fetch>().mockResolvedValue(new Response('# My project'));
  const result = await loadProjectReadme('https://github.com/knowprasad/merix', request);
  expect(result?.markdown).toBe('# My project');
  expect(request.mock.calls[0][0]).toBe('https://raw.githubusercontent.com/knowprasad/merix/HEAD/README.md');
  expect(request.mock.calls[0][1]).toMatchObject({ credentials: 'omit', redirect: 'error', next: { revalidate: 900 } });
  expect(request.mock.calls[0][1]?.headers).toBeUndefined();
});
it('supports lowercase README names without guessing branches', async () => {
  const request = vi.fn<typeof fetch>().mockResolvedValueOnce(new Response('', { status: 404 })).mockResolvedValueOnce(new Response('Details'));
  expect((await loadProjectReadme('https://github.com/knowprasad/merix', request))?.path).toBe('readme.md');
});
it('returns an honest unavailable result for missing, inaccessible or failed sources', async () => {
  const missing = vi.fn<typeof fetch>().mockImplementation(async () => new Response('', { status: 404 }));
  expect(await loadProjectReadme('https://github.com/knowprasad/missing', missing)).toBeNull();
  expect(missing).toHaveBeenCalledTimes(3);
  const failed = vi.fn<typeof fetch>().mockRejectedValue(new Error('Offline'));
  expect(await loadProjectReadme('https://github.com/knowprasad/merix', failed)).toBeNull();
  expect(await loadProjectReadme(undefined, failed)).toBeNull();
  expect(failed).toHaveBeenCalledTimes(1);
});
it('caps both declared and streaming content before parsing Markdown', async () => {
  for (const response of [new Response('tiny', { headers: { 'content-length': '200001' } }), new Response('a'.repeat(200001))]) expect(await loadProjectReadme('https://github.com/knowprasad/merix', vi.fn<typeof fetch>().mockResolvedValue(response))).toBeNull();
});
it('resolves repo-relative links and images while rejecting executable or unapproved image URLs', async () => {
  const doc = await loadProjectReadme('https://github.com/knowprasad/merix', vi.fn<typeof fetch>().mockResolvedValue(new Response('# Guide')));
  if (!doc) throw new Error('Missing fixture');
  expect(readmeUrl('docs/setup.md', doc)).toBe('https://github.com/knowprasad/merix/blob/HEAD/docs/setup.md');
  expect(readmeUrl('images/screen.png', doc, true)).toBe('https://raw.githubusercontent.com/knowprasad/merix/HEAD/images/screen.png');
  expect(readmeUrl('#features', doc)).toBe('#readme-features');
  for (const link of ['javascript:alert(1)', 'data:text/html,hi', 'https://user:secret@example.com/']) expect(readmeUrl(link, doc)).toBe('');
  expect(readmeUrl('https://tracker.example/pixel.png', doc, true)).toBe('');
});
