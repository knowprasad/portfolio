import Link from 'next/link';
import { CodingProfiles } from '@/components/coding-profiles';
import { Footer } from '@/components/section';
import { getAcceptedLeetcodeDays, getCodechefActivity, getCodeforcesActivity, getLeetcodeActivity } from '@/lib/activity-server';
import { pageMetadata } from '@/lib/seo';

export const revalidate = 3600;
export const metadata = pageMetadata('/activity', 'Activity', 'Problem-solving history across LeetCode, Codeforces and CodeChef, with source dates and history coverage.');
export default async function ActivityPage() {
  const [leetcode, codeforces, codechef, accepted] = await Promise.all([getLeetcodeActivity(), getCodeforcesActivity(), getCodechefActivity(), getAcceptedLeetcodeDays()]);
  return <><main id="main" tabIndex={-1} className="inner-page activity-page"><Link href="/#problem-solving" className="back-link">← Home</Link><span className="section-eyebrow">Practice log</span><h1>Activity<span>.</span></h1><p className="page-intro">Accepted solutions, contest history and the habit behind them. Source dates and partial histories are shown alongside the charts.</p><section id="problem-solving" aria-labelledby="activity-dashboard-heading"><h2 id="activity-dashboard-heading" className="activity-dashboard-heading">Problem solving</h2><CodingProfiles leetcode={leetcode} codeforces={codeforces} codechef={codechef} accepted={accepted}/></section><p className="activity-backlink"><Link href="/#open-source" className="text-link">Explore upstream contributions ↗</Link></p></main><Footer/></>;
}
