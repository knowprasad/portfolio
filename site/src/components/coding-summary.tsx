import Image from 'next/image';
import type { CodechefActivity, CodeforcesActivity, LeetcodeActivity } from '@/lib/activity';

export function CodingSummary({ leetcode, codeforces, codechef }: { leetcode: LeetcodeActivity; codeforces: CodeforcesActivity; codechef: CodechefActivity }) {
  const platforms = [
    { id: 'leetcode', name: 'LeetCode', solved: leetcode.solved },
    { id: 'codeforces', name: 'Codeforces', solved: codeforces.solved },
    { id: 'codechef', name: 'CodeChef', solved: codechef.solved },
  ];
  const saved = [leetcode.source, codeforces.source, codechef.source].includes('snapshot');
  return <div className="coding-summary"><p className="section-intro">Practice across three platforms.</p><ul className="coding-summary-list">{platforms.map(platform => <li key={platform.id}><Image src={`/icons/${platform.id}.svg`} width={21} height={21} alt=""/><span>{platform.name}</span><strong>{platform.solved ?? '—'}</strong><span className="coding-summary-unit">{platform.solved == null ? 'unavailable' : 'solved'}</span></li>)}</ul><p className="data-date">{saved ? 'Includes saved public data. Source dates and history coverage are on the Activity page.' : 'Platform totals can include overlapping problems. History and source dates are on the Activity page.'}</p></div>;
}
