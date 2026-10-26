import type { AcceptedHistory, CodechefActivity, CodeforcesActivity, LeetcodeActivity } from './activity';

export function combinedCodingSummary(leetcode: LeetcodeActivity, codeforces: CodeforcesActivity, codechef: CodechefActivity, accepted: AcceptedHistory) {
  const solves = [leetcode.solved, codeforces.available ? codeforces.solved : null, codechef.available ? codechef.solved : null];
  return {
    solves: solves.reduce<number>((sum, value) => sum + (value ?? 0), 0),
    partial: solves.some(value => value == null),
    contests: leetcode.contests.length + codeforces.contests.length + codechef.contests.length,
    streak: solveStreak([...accepted.days, ...(codeforces.acceptedDays ?? []), ...(codechef.acceptedDays ?? [])], accepted.today),
    saved: [leetcode.source, codeforces.source, codeforces.acceptedSource, codechef.source, accepted.source].includes('snapshot'),
  };
}

export function indianDate(timestamp: number) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(timestamp * 1000));
}


export function solveStreak(days: string[], today: string) {
  const sorted = [...new Set(days.filter(day => /^\d{4}-\d{2}-\d{2}$/.test(day) && day <= today))].sort();
  const set = new Set(sorted);
  const previous = (day: string) => new Date(Date.parse(`${day}T00:00:00Z`) - 86400000).toISOString().slice(0, 10);
  let current = 0, longest = 0, run = 0, last = '';
  for (const day of sorted) { run = last && previous(day) === last ? run + 1 : 1; longest = Math.max(longest, run); last = day; }
  let cursor = set.has(today) ? today : previous(today);
  while (set.has(cursor)) { current++; cursor = previous(cursor); }
  return { current, longest, activeDays: sorted.length, days: sorted };
}


export function monthlySubmissions(submissions: LeetcodeActivity['submissions']) {
  const months = new Map<string, number>();
  for (const item of submissions) { const month = item.date.slice(0, 7); months.set(month, (months.get(month) ?? 0) + item.count); }
  return [...months].sort(([a], [b]) => a.localeCompare(b)).slice(-12).map(([month, count]) => ({ month, count }));
}
