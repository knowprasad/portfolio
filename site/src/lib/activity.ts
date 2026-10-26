import { indianDate } from './activity-metrics';
export { indianDate, solveStreak, monthlySubmissions } from './activity-metrics';
import { z } from 'zod';

export type ContributionDay = { date: string; count: number; level: number };
export type AcceptedHistory = { days: string[]; today: string; source: 'live' | 'snapshot'; fetchedAt: string };
export type GithubActivity = { username: string; fetchedAt: string; days: ContributionDay[]; total: number; source: 'live' | 'snapshot' };
export type Contest = { title: string; date: string; rating: number; rank: number; solved: number; total: number };
export type LeetcodeActivity = { username: string; fetchedAt: string; solved: number; easy: number; medium: number; hard: number; activeDays: number | null; streak: number | null; submissions: {date: string; count: number}[]; contests: Contest[]; rating: number | null; rank: number | null; top: number | null; source: 'live' | 'snapshot' };
export type CodeforcesActivity = { username: string; fetchedAt: string; available: boolean; solved?: number | null; acceptedDays?: string[]; acceptedSource?: 'live' | 'snapshot'; acceptedFetchedAt?: string; source?: 'live' | 'snapshot'; contests: { id: number; title: string; date: string; rating: number; previousRating: number; rank: number }[] };
export type CodechefActivity = { username: string; fetchedAt: string; available: boolean; solved: number | null; acceptedDays?: string[]; historyComplete?: boolean; rating: number | null; source: 'live' | 'snapshot'; contests: { title: string; rating: number }[] };
export type PrState = 'merged' | 'open' | 'closed' | 'reviewed';
export type PrGroup = { count: number; fetchedAt: string; source: string; available: boolean; items: { title: string; url: string; repository: string; date: string; number: number; state: string }[] };
export type PrActivity = Record<PrState, PrGroup>;
export type ContributorOwner = { login: string; kind: string; avatar: string; url: string };

export function parseAcceptedLeetcode(payload: unknown): string[] {
  const value = z.object({ data: z.object({ recentAcSubmissionList: z.array(z.object({ timestamp: z.string().regex(/^\d+$/) })) }) }).parse(payload);
  return [...new Set(value.data.recentAcSubmissionList.map(item => indianDate(Number(item.timestamp))))].sort();
}
export function parseCodeforcesAcceptedDays(payload: unknown): string[] {
  const value = z.object({ status: z.literal('OK'), result: z.array(z.object({ verdict: z.string().optional(), creationTimeSeconds: z.number().nonnegative() })) }).parse(payload);
  return [...new Set(value.result.filter(item => item.verdict === 'OK').map(item => indianDate(item.creationTimeSeconds)))].sort();
}
export function parseCodechefAccepted(payload: unknown) {
  const value = z.object({ content: z.string(), max_page: z.coerce.number().nonnegative() }).parse(payload);
  if (!value.content.includes('dataTable')) throw new Error('CodeChef submission history unavailable');
  const days: string[] = [];
  for (const row of value.content.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)) {
    if (!/title=['"]accepted['"]/.test(row[1])) continue;
    const date = row[1].match(/\d{2}:\d{2} [AP]M (\d{2})\/(\d{2})\/(\d{2})/);
    if (!date) throw new Error('CodeChef accepted date unavailable');
    days.push(`20${date[3]}-${date[2]}-${date[1]}`);
  }
  return { acceptedDays: [...new Set(days)].sort(), historyComplete: value.max_page <= 1 };
}

export function parseCodechef(html: string, username: string, fetchedAt: string): CodechefActivity {
  const user = html.match(/<label>Username:<\/label>\s*<span>\s*([^<]+)<\/span>/i)?.[1]?.trim();
  const solved = html.match(/Total Problems Solved:\s*(\d+)/i)?.[1];
  const history = html.match(/\bvar\s+all_rating\s*=\s*(\[[\s\S]*?\]);/)?.[1];
  if (user?.toLowerCase() !== username.toLowerCase() || !solved || !history) throw new Error('CodeChef profile unavailable');
  const contests = z.array(z.object({ name: z.string(), rating: z.union([z.string().regex(/^\d+$/), z.number().finite()]) })).parse(JSON.parse(history)).map(item => ({ title: item.name, rating: Number(item.rating) }));
  return { username, fetchedAt, available: true, solved: Number(solved), rating: contests.at(-1)?.rating ?? null, source: 'live', contests };
}

export function parseCodeforcesSolves(payload: unknown): number {
  const value = z.object({ status: z.literal('OK'), result: z.array(z.object({ verdict: z.string().optional(), problem: z.object({ contestId: z.number().optional(), index: z.string(), name: z.string() }) })) }).parse(payload);
  return new Set(value.result.filter(item => item.verdict === 'OK').map(item => `${item.problem.contestId ?? item.problem.name}:${item.problem.index}`)).size;
}

export function parsePullRequests(payload: unknown, state: PrState, fetchedAt: string): PrGroup {
  const value = publicPrSchema.parse(payload);
  return { count: value.total_count, fetchedAt, source: 'live', available: true, items: value.items.map(item => ({ title: item.title, url: item.html_url, repository: item.repository_url.replace('https://api.github.com/repos/', ''), date: item.pull_request.merged_at ?? item.updated_at, number: Number(item.html_url.split('/').at(-1)), state })) };
}

const cfSchema = z.object({ status: z.literal('OK'), result: z.array(z.object({ contestId: z.number().int(), contestName: z.string(), handle: z.string(), rank: z.number().int().positive(), ratingUpdateTimeSeconds: z.number().nonnegative(), oldRating: z.number().int(), newRating: z.number().int() })) });
export function parseCodeforces(payload: unknown, username: string, fetchedAt: string): CodeforcesActivity {
  const value = cfSchema.parse(payload);
  if (value.result.some(item => item.handle.toLowerCase() !== username.toLowerCase())) throw new Error('Codeforces profile mismatch');
  return { username, fetchedAt, available: true, contests: value.result.map(item => ({ id: item.contestId, title: item.contestName, date: new Date(item.ratingUpdateTimeSeconds * 1000).toISOString(), rating: item.newRating, previousRating: item.oldRating, rank: item.rank })).sort((a, b) => a.date.localeCompare(b.date)) };
}

export function parseCalendar(html: string): ContributionDay[] {
  const tips = new Map<string, number>();
  for (const match of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)) {
    const id = match[1].match(/\bfor="([^"]+)"/)?.[1];
    const content = match[2].replace(/<[^>]+>/g, '');
    const count = content.match(/([\d,]+) contributions?/);
    if (id && count) tips.set(id, Number(count[1].replaceAll(',', '')));
    else if (id && /No contributions/.test(content)) tips.set(id, 0);
  }
  const days: ContributionDay[] = [];
  for (const match of html.matchAll(/<td\b([^>]*)>/g)) {
    const attributes = match[1];
    const date = attributes.match(/data-date="(\d{4}-\d{2}-\d{2})"/)?.[1];
    const id = attributes.match(/\bid="([^"]+)"/)?.[1];
    const level = attributes.match(/data-level="([0-4])"/)?.[1];
    if (date && id && level && tips.has(id)) days.push({ date, count: tips.get(id)!, level: Number(level) });
  }
  if (days.length < 7) throw new Error('GitHub calendar format unavailable');
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

const number = z.number().finite().nonnegative();
const lcSchema = z.object({
  matchedUser: z.object({
    username: z.string(),
    submitStatsGlobal: z.object({ acSubmissionNum: z.array(z.object({ difficulty: z.string(), count: number })) }),
    userCalendar: z.object({ totalActiveDays: number, streak: number, submissionCalendar: z.string() }).optional(),
  }),
  userContestRanking: z.object({ rating: number, globalRanking: number, topPercentage: number }).nullable(),
  userContestRankingHistory: z.array(z.object({ attended: z.boolean(), rating: number, ranking: number, problemsSolved: number, totalProblems: number, contest: z.object({ title: z.string(), startTime: number }) })),
});

export function parseLeetcode(data: unknown, fetchedAt: string, source: LeetcodeActivity['source']): LeetcodeActivity {
  const value = lcSchema.parse(data);
  if (value.matchedUser.username.toLowerCase() !== 'knowprasad') throw new Error('Profile mismatch');
  const count = (difficulty: string) => value.matchedUser.submitStatsGlobal.acSubmissionNum.find(item => item.difficulty === difficulty)?.count ?? 0;
  let submissions: LeetcodeActivity['submissions'] = [];
  const calendar = value.matchedUser.userCalendar;
  if (calendar) {
    const entries = z.record(z.string().regex(/^\d+$/), number).parse(JSON.parse(calendar.submissionCalendar));
    submissions = Object.entries(entries).map(([timestamp, count]) => ({ date: new Date(Number(timestamp) * 1000).toISOString().slice(0, 10), count })).sort((a, b) => a.date.localeCompare(b.date));
  }
  return {
    username: value.matchedUser.username, fetchedAt, source,
    solved: count('All'), easy: count('Easy'), medium: count('Medium'), hard: count('Hard'),
    activeDays: calendar?.totalActiveDays ?? null, streak: calendar?.streak ?? null, submissions,
    contests: value.userContestRankingHistory.filter(c => c.attended).map(c => ({ title: c.contest.title, date: new Date(c.contest.startTime * 1000).toISOString(), rating: Math.round(c.rating), rank: c.ranking, solved: c.problemsSolved, total: c.totalProblems })),
    rating: value.userContestRanking ? Math.round(value.userContestRanking.rating) : null,
    rank: value.userContestRanking?.globalRanking ?? null, top: value.userContestRanking?.topPercentage ?? null,
  };
}


export const publicPrSchema = z.object({ total_count: number, items: z.array(z.object({ title: z.string(), html_url: z.string().url().startsWith('https://github.com/'), repository_url: z.string().startsWith('https://api.github.com/repos/'), updated_at: z.string(), pull_request: z.object({ merged_at: z.string().nullable().optional() }) })) });
