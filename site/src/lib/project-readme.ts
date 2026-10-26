export type ProjectRepository = { owner: string; name: string; url: string };
export type ProjectReadme = { markdown: string; repository: ProjectRepository; path: string; sourceUrl: string; rawBase: string };

export function projectRepository(value: unknown): ProjectRepository | null {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.hostname !== 'github.com' || url.port || url.username || url.password || url.search || url.hash) return null;
    const parts = url.pathname.replace(/\/$/, '').split('/').filter(Boolean);
    if (parts.length !== 2 || !/^[a-z0-9][a-z0-9-]{0,38}$/i.test(parts[0]) || !/^[a-z0-9_.-]{1,100}$/i.test(parts[1])) return null;
    const name = parts[1].replace(/\.git$/, '');
    if (!name || name === '.' || name === '..') return null;
    return { owner: parts[0], name, url: `https://github.com/${parts[0]}/${name}` };
  } catch { return null; }
}

const maxBytes = 200_000;
// Public raw content only: no credentials, private repositories or API quota.
export async function loadProjectReadme(source: unknown, request: typeof fetch = fetch): Promise<ProjectReadme | null> {
  const repository = projectRepository(source);
  if (!repository) return null;
  for (const path of ['README.md', 'readme.md', 'Readme.md']) {
    try {
      const rawBase = `https://raw.githubusercontent.com/${repository.owner}/${repository.name}/HEAD/`;
      const response = await request(`${rawBase}${path}`, { credentials: 'omit', redirect: 'error', signal: AbortSignal.timeout(5000), cache: 'force-cache', next: { revalidate: 900, tags: ['project-readme'] } });
      if (response.status === 404) { await response.body?.cancel(); continue; }
      if (!response.ok || Number(response.headers.get('content-length')) > maxBytes) { await response.body?.cancel(); return null; }
      const reader = response.body?.getReader();
      if (!reader) return null;
      const chunks: Uint8Array[] = [];
      let size = 0;
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        size += chunk.value.byteLength;
        if (size > maxBytes) { await reader.cancel(); return null; }
        chunks.push(chunk.value);
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
      const markdown = new TextDecoder().decode(bytes).trim();
      if (!markdown) return null;
      return { markdown, repository, path, rawBase, sourceUrl: `${repository.url}/blob/HEAD/${path}` };
    } catch { return null; }
  }
  return null;
}

export function readmeUrl(value: string, readme: ProjectReadme, image = false) {
  try {
    if (!image && value.startsWith('#')) return `#readme-${value.slice(1).replace(/^user-content-/, '')}`;
    const base = image ? readme.rawBase : `${readme.repository.url}/blob/HEAD/`;
    const url = new URL(value, base);
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return '';
    if (image && !['raw.githubusercontent.com', 'github.com', 'user-images.githubusercontent.com', 'avatars.githubusercontent.com', 'img.shields.io'].includes(url.hostname)) return '';
    return url.href;
  } catch { return ''; }
}
