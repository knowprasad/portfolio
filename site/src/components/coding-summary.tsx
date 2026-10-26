import type { AcceptedHistory, CodechefActivity, CodeforcesActivity, LeetcodeActivity } from '@/lib/activity';
import { combinedCodingSummary } from '@/lib/activity-metrics';

export function CodingSummary({ leetcode, codeforces, codechef, accepted }: { leetcode: LeetcodeActivity; codeforces: CodeforcesActivity; codechef: CodechefActivity; accepted: AcceptedHistory }) {
  const summary = combinedCodingSummary(leetcode, codeforces, codechef, accepted);
  return <div className="coding-summary"><p className="section-intro">One habit, across three platforms.</p><dl className="coding-summary-totals"><div><dt>{summary.partial ? 'Recorded platform solves' : 'Platform solves'}</dt><dd>{summary.solves.toLocaleString()}</dd></div><div><dt>{summary.partial ? 'Known rated contests' : 'Rated contests'}</dt><dd>{summary.contests.toLocaleString()}</dd></div><div><dt>Known best streak</dt><dd>{summary.streak.longest}<span> {summary.streak.longest === 1 ? 'day' : 'days'}</span></dd></div></dl><p className="data-date">Solves may overlap between platforms. Streaks use available accepted-solution history in India time.{summary.partial && ' A platform is unavailable; totals are partial.'}{summary.saved && ' Includes saved public data.'} Source dates and platform details are on the Activity page.</p></div>;
}
