import 'server-only';
import { validateActivityRequest } from './security';
import acceptedSnapshot from '@/data/accepted-submissions-snapshot.json';
import ownerSnapshot from '@/data/github-owners-snapshot.json';
import { z } from 'zod';
import type { ContributorOwner, AcceptedHistory } from './activity';
import cfSnapshot from '@/data/codeforces-snapshot.json';
import cfSolvesSnapshot from '@/data/codeforces-solves-snapshot.json';
import codechefSnapshot from '@/data/codechef-snapshot.json';
import prSnapshot from '@/data/github-pr-snapshot.json';
import { profile } from '@/data/site';
import githubSnapshot from '@/data/github-snapshot.json';
import leetcodeSnapshot from '@/data/leetcode-snapshot.json';
import { parseCalendar, parseLeetcode, parseCodeforces, indianDate, parseCodeforcesSolves, parseCodeforcesAcceptedDays, parseAcceptedLeetcode, parseCodechefAccepted, parseCodechef, parsePullRequests, type PrState, type PrActivity, type CodechefActivity, type GithubActivity, type LeetcodeActivity, type CodeforcesActivity } from './activity';

const LEETCODE_QUERY = `query Portfolio($username: String!) {
  matchedUser(username: $username) { username submitStatsGlobal { acSubmissionNum { difficulty count } } userCalendar { streak totalActiveDays submissionCalendar } }
  userContestRanking(username: $username) { rating globalRanking topPercentage }
  userContestRankingHistory(username: $username) { attended rating ranking problemsSolved totalProblems contest { title startTime } }
}`;

async function request(url: string, options: RequestInit = {}) {
  validateActivityRequest(url, new Headers(options.headers).has('Authorization'));
  const response = await fetch(url, { cache: 'force-cache', ...options, redirect: 'error', signal: AbortSignal.timeout(7000), next: { revalidate: 3600 }, headers: { 'User-Agent': 'knowprasad-portfolio', ...options.headers } });
  if (!response.ok) throw new Error(`Public source returned ${response.status}`);
  return response;
}

export async function getGithubActivity(): Promise<GithubActivity> {
  try {
    const response = await request('https://github.com/users/knowprasad/contributions');
    const days = parseCalendar(await response.text());
    return { username: 'knowprasad', fetchedAt: new Date().toISOString(), days, total: days.reduce((sum, day) => sum + day.count, 0), source: 'live' };
  } catch {
    const { username, fetchedAt, days, total } = githubSnapshot;
    return { username, fetchedAt, days, total, source: 'snapshot' };
  }
}

export async function getLeetcodeActivity(): Promise<LeetcodeActivity> {
  try {
    const response = await request('https://leetcode.com/graphql', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: LEETCODE_QUERY, variables: { username: 'knowprasad' } }) });
    const payload = await response.json();
    return parseLeetcode(payload.data, new Date().toISOString(), 'live');
  } catch { return parseLeetcode(leetcodeSnapshot.data, leetcodeSnapshot.fetchedAt, 'snapshot'); }
}

export async function getCodeforcesActivity(): Promise<CodeforcesActivity> {
  const fetchedAt = new Date().toISOString();
  let rating: CodeforcesActivity;
  try {
    const response = await request(`https://codeforces.com/api/user.rating?handle=${encodeURIComponent(profile.codeforces)}`);
    rating = { ...parseCodeforces(await response.json(), profile.codeforces, fetchedAt), source: 'live' };
  } catch { rating = { ...parseCodeforces(cfSnapshot.data, profile.codeforces, cfSnapshot.fetchedAt), source: 'snapshot' }; }
  // Codeforces permits one request per two seconds. Keep the two methods sequential.
  await new Promise(resolve => setTimeout(resolve, 2100));
  try {
    const response = await request(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(profile.codeforces)}`);
    const payload = await response.json();
    return { ...rating, solved: parseCodeforcesSolves(payload), acceptedDays: parseCodeforcesAcceptedDays(payload), acceptedSource: 'live', acceptedFetchedAt: fetchedAt };
  } catch { return { ...rating, solved: cfSolvesSnapshot.solved, acceptedDays: cfSolvesSnapshot.acceptedDays, acceptedSource: 'snapshot', acceptedFetchedAt: cfSolvesSnapshot.fetchedAt, source: 'snapshot', fetchedAt: cfSolvesSnapshot.fetchedAt }; }
}

export async function getCodechefActivity(): Promise<CodechefActivity> {
  try {
    const [response, recent] = await Promise.all([
      request(`https://www.codechef.com/users/${encodeURIComponent(profile.codechef)}`),
      request(`https://www.codechef.com/recent/user?page=0&user_handle=${encodeURIComponent(profile.codechef)}`),
    ]);
    return { ...parseCodechef(await response.text(), profile.codechef, new Date().toISOString()), ...parseCodechefAccepted(await recent.json()) };
  } catch { return { ...codechefSnapshot, source: 'snapshot', available: true }; }
}

export const prQueries: Record<PrState, string> = {
  merged: 'author:knowprasad is:pr is:merged is:public -user:knowprasad',
  open: 'author:knowprasad is:pr is:open is:public -user:knowprasad',
  closed: 'author:knowprasad is:pr is:closed is:unmerged is:public -user:knowprasad',
  reviewed: 'reviewed-by:knowprasad -author:knowprasad is:pr is:public',
};
export async function getPullRequestActivity(): Promise<PrActivity> {
  const entries = await Promise.all((Object.keys(prQueries) as PrState[]).map(async state => {
    try {
      const response = await request(`https://api.github.com/search/issues?q=${encodeURIComponent(prQueries[state])}&sort=updated&per_page=100`, { headers: process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {} });
      return [state, parsePullRequests(await response.json(), state, new Date().toISOString())] as const;
    } catch { return [state, prSnapshot[state]] as const; }
  }));
  return Object.fromEntries(entries) as PrActivity;
}

export async function getAcceptedLeetcodeDays(): Promise<AcceptedHistory> {
  const today = indianDate(Date.now() / 1000);
  try {
    const response = await request('https://leetcode.com/graphql', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: 'query { recentAcSubmissionList(username:"knowprasad",limit:50) { timestamp } }' }) });
    return { days: parseAcceptedLeetcode(await response.json()), today, source: 'live', fetchedAt: new Date().toISOString() };
  } catch { return { days: parseAcceptedLeetcode({ data: acceptedSnapshot.data }), today, source: 'snapshot', fetchedAt: acceptedSnapshot.fetchedAt }; }
}

export async function getContributorOwners(activity: PrActivity): Promise<ContributorOwner[]> {
  const logins = [...new Set(activity.merged.items.map(item => item.repository.split('/')[0]))];
  const schema = z.object({ login: z.string(), type: z.enum(['User', 'Organization']), avatar_url: z.string().startsWith('https://avatars.githubusercontent.com/'), html_url: z.string().startsWith('https://github.com/') });
  return Promise.all(logins.map(async login => {
    try {
      const response = await request(`https://api.github.com/users/${encodeURIComponent(login)}`);
      const owner = schema.parse(await response.json());
      return { login: owner.login, kind: owner.type, avatar: owner.avatar_url, url: owner.html_url };
    } catch {
      const saved = ownerSnapshot[login as keyof typeof ownerSnapshot];
      return saved ?? { login, kind: 'Unknown', avatar: `https://github.com/${login}.png?size=64`, url: `https://github.com/${login}` };
    }
  }));
}
