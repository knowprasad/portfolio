import { describe, expect, it } from 'vitest';
import { parseCalendar, parseLeetcode, parseCodeforces, parseCodeforcesSolves, parseCodechef, parsePullRequests, solveStreak, parseCodechefAccepted, parseCodeforcesAcceptedDays, indianDate, monthlySubmissions } from './activity';
import snapshot from '../data/leetcode-snapshot.json';
import { combinedCodingSummary } from './activity-metrics';

describe('combined homepage activity', () => {
  const leetcode = parseLeetcode(snapshot.data, snapshot.fetchedAt, 'snapshot');
  const codeforces = { ...parseCodeforces({ status: 'OK', result: [] }, 'prsdx', '2026-10-26'), solved: 8, acceptedDays: ['2026-10-24', '2026-10-25'] };
  const codechef = parseCodechef('<label>Username:</label><span>prsdx</span><h3>Total Problems Solved: 2</h3><script>var all_rating = [];</script>', 'prsdx', '2026-10-26');

  it('adds per-platform totals without claiming cross-platform uniqueness', () => {
    const summary = combinedCodingSummary(leetcode, codeforces, codechef, { days: [], today: '2026-10-26', source: 'live', fetchedAt: '2026-10-26' });
    expect(summary.solves).toBe(leetcode.solved + 10);
    expect(summary.partial).toBe(false);
    expect(summary.saved).toBe(true);
  });
  it('counts a shared solve day once and joins consecutive days across platforms', () => {
    const summary = combinedCodingSummary(leetcode, codeforces, { ...codechef, acceptedDays: ['2026-10-26'] }, { days: ['2026-10-24'], today: '2026-10-26', source: 'live', fetchedAt: '2026-10-26' });
    expect(summary.streak).toMatchObject({ activeDays: 3, longest: 3, current: 3 });
  });
  it('labels missing platform totals as partial rather than silently reporting zero', () => {
    const summary = combinedCodingSummary(leetcode, { ...codeforces, available: false, solved: null }, codechef, { days: [], today: '2026-10-26', source: 'live', fetchedAt: '2026-10-26' });
    expect(summary.partial).toBe(true);
    expect(summary.solves).toBe(leetcode.solved + 2);
  });
});

describe('public activity integrity', () => {
  it('does not turn a provider error into an empty contribution year', () => { expect(() => parseCalendar('<html>rate limited</html>')).toThrow(); });
  it('joins dates to their own tooltip counts, including zero', () => {
    const html = Array.from({ length: 7 }, (_, i) => `<td data-date="2026-01-0${i + 1}" id="d${i}" data-level="${i ? 1 : 0}"></td><tool-tip for="d${i}">${i ? `${i} contributions` : 'No contributions'} on Jan ${i + 1}.</tool-tip>`).reverse().join('');
    const result = parseCalendar(html); expect(result[0]).toEqual({ date: '2026-01-01', count: 0, level: 0 }); expect(result.at(-1)?.count).toBe(6);
  });
  it('preserves verified solved counts without inventing a rating', () => { const result = parseLeetcode(snapshot.data, snapshot.fetchedAt, 'snapshot'); expect(result.solved).toBe(result.easy + result.medium + result.hard); expect(result.rating).toBeNull(); expect(result.contests).toEqual([]); });
  it('rejects missing or mismatched profiles', () => { expect(() => parseLeetcode({ matchedUser: null }, '', 'live')).toThrow(); expect(() => parseLeetcode({ ...snapshot.data, matchedUser: { ...snapshot.data.matchedUser, username: 'someone-else' } }, '', 'live')).toThrow('Profile mismatch'); });
  it('groups submission attempts without mislabelling them as unique solves', () => { expect(monthlySubmissions([{ date: '2026-01-03', count: 3 }, { date: '2026-01-04', count: 4 }, { date: '2026-02-01', count: 2 }])).toEqual([{ month: '2026-01', count: 7 }, { month: '2026-02', count: 2 }]); });
});

describe('Codeforces public history', () => {
  it('distinguishes a valid unrated profile from a provider failure', () => {
    expect(parseCodeforces({ status: 'OK', result: [] }, 'knowprasad', '2026-10-25').available).toBe(true);
    expect(() => parseCodeforces({ status: 'FAILED', comment: 'User not found' }, 'knowprasad', '2026-10-25')).toThrow();
  });
  it('rejects history from a different handle', () => {
    expect(() => parseCodeforces({ status: 'OK', result: [{ handle: 'other', contestId: 1, contestName: 'Round', rank: 10, ratingUpdateTimeSeconds: 1700000000, oldRating: 0, newRating: 100 }] }, 'knowprasad', '2026-10-25')).toThrow('profile mismatch');
  });
});

describe('multi-platform and PR data integrity', () => {
  it('counts accepted Codeforces problems once across repeat submissions', () => {
    const problem = { contestId: 12, index: 'A', name: 'Example' };
    expect(parseCodeforcesSolves({ status: 'OK', result: [{ verdict: 'OK', problem }, { verdict: 'OK', problem }, { verdict: 'WRONG_ANSWER', problem: { ...problem, index: 'B' } }] })).toBe(1);
  });
  it('keeps a verified unrated CodeChef profile distinct from a blocked page', () => {
    const html = '<label>Username:</label><span> prsdx </span><h3>Total Problems Solved: 2</h3><script>var all_rating = [];</script>';
    expect(parseCodechef(html, 'prsdx', '2026-10-25')).toMatchObject({ solved: 2, rating: null, contests: [] });
    expect(() => parseCodechef('<html>Access denied</html>', 'prsdx', '')).toThrow();
    expect(() => parseCodechef(html, 'someone-else', '')).toThrow();
  });
  it('normalizes reviews separately from authored merged requests', () => {
    const payload = { total_count: 1, items: [{ title: 'Example review', html_url: 'https://github.com/org/repo/pull/12', repository_url: 'https://api.github.com/repos/org/repo', updated_at: '2026-10-25', pull_request: {} }] };
    expect(parsePullRequests(payload, 'reviewed', '2026-10-25').items[0]).toMatchObject({ state: 'reviewed', number: 12, repository: 'org/repo' });
    expect(() => parsePullRequests({ ...payload, items: [{ ...payload.items[0], html_url: 'https://example.com/fake' }] }, 'merged', '')).toThrow();
  });
});

describe('cross-platform solve streaks', () => {
  it('merges same-day solves and carries yesterday through an unfinished today', () => {
    expect(solveStreak(['2026-10-22','2026-10-23','2026-10-23','2026-10-24'], '2026-10-25')).toMatchObject({ current: 3, longest: 3, activeDays: 3 });
  });
  it('breaks a streak on missed days and ignores future dates', () => {
    expect(solveStreak(['2026-10-20','2026-10-21','2026-10-23','2026-10-26'], '2026-10-25')).toMatchObject({ current: 0, longest: 2, activeDays: 3 });
  });
  it('converts timestamps to India time at the date boundary', () => {
    expect(indianDate(Date.parse('2026-10-24T20:00:00Z') / 1000)).toBe('2026-10-25');
  });
  it('never counts Codeforces failed attempts as accepted days', () => {
    expect(parseCodeforcesAcceptedDays({ status: 'OK', result: [{ verdict: 'WRONG_ANSWER', creationTimeSeconds: 1792872000 }] })).toEqual([]);
  });
  it('uses CodeChef verdicts instead of all-submission heatmap counts', () => {
    const content = `<table class="dataTable"><tr><td title='08:58 PM 28/01/26'></td><td><span title='wrong answer'></span></td></tr><tr><td title='08:52 PM 28/01/26'></td><td><span title='accepted'style='x'></span></td></tr></table>`;
    expect(parseCodechefAccepted({ content, max_page: 1 })).toEqual({ acceptedDays: ['2026-01-28'], historyComplete: true });
    expect(() => parseCodechefAccepted({ content: 'Access denied', max_page: 1 })).toThrow();
  });
});
