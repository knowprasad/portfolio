import 'server-only';
import { cache } from 'react';
import { parseGithubProfile } from './github-profile';

export const getGithubProfile = cache(async () => {
  try {
    const response = await fetch('https://api.github.com/users/knowprasad', {
      next: { revalidate: 300 }, redirect: 'error', signal: AbortSignal.timeout(4000),
      headers: { 'User-Agent': 'knowprasad-portfolio', Accept: 'application/vnd.github+json' },
    });
    if (!response.ok) return null;
    return parseGithubProfile(await response.json());
  } catch { return null; }
});
