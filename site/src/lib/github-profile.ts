import { z } from 'zod';

const profileSchema = z.object({
  login: z.string(), name: z.string().nullable(), bio: z.string().nullable(),
  avatar_url: z.string().url().startsWith('https://avatars.githubusercontent.com/'),
  html_url: z.literal('https://github.com/knowprasad'),
  followers: z.number().int().nonnegative(), public_repos: z.number().int().nonnegative(),
});

export function parseGithubProfile(payload: unknown) {
  const value = profileSchema.parse(payload);
  if (value.login.toLowerCase() !== 'knowprasad') throw new Error('GitHub profile mismatch');
  return { name: value.name || value.login, bio: value.bio, avatar: value.avatar_url, followers: value.followers, repositories: value.public_repos };
}
