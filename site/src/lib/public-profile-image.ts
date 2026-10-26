import { publicImageUrl } from './content-model';

const imageTypes = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif']);
const maxBytes = 1024 * 1024;

// The caller resolves the owner's published photo. No request-supplied URL is accepted.
export async function loadPublicProfileImage(source: string, request: typeof fetch = fetch) {
  let url = source;
  for (let redirects = 0; redirects <= 2; redirects++) {
    if (!publicImageUrl(url)) throw new Error('Unsupported photo host');
    const response = await request(url, { redirect: 'manual', cache: 'force-cache', next: { revalidate: 300, tags: ['profile-photo'] }, credentials: 'omit', signal: AbortSignal.timeout(5000) });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      await response.body?.cancel();
      if (!location) throw new Error('Invalid photo redirect');
      url = new URL(location, url).href;
      continue;
    }
    const type = response.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
    if (!response.ok || !type || !imageTypes.has(type)) { await response.body?.cancel(); throw new Error('Photo unavailable'); }
    if (Number(response.headers.get('content-length')) > maxBytes) { await response.body?.cancel(); throw new Error('Photo too large'); }
    const reader = response.body?.getReader();
    if (!reader) throw new Error('Empty photo');
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > maxBytes) { await reader.cancel(); throw new Error('Photo too large'); }
      chunks.push(chunk.value);
    }
    if (!size) throw new Error('Empty photo');
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    return { body: bytes.buffer, type };
  }
  throw new Error('Too many photo redirects');
}
