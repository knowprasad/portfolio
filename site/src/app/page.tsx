import Image from 'next/image';
import { pageMetadata, profileStructuredData, serializeStructuredData, siteDescription } from '@/lib/seo';
import { LinkPreview } from '@/components/link-preview';
import { TechStack } from '@/components/tech-stack';
import { BookingLink } from '@/components/booking-link';
import { ProfileReveal } from '@/components/profile-reveal';
import { SocialLinks } from '@/components/social-links';
import { Experience, Highlights } from '@/components/experience';
import { CodingProfiles } from '@/components/coding-profiles';
import { OpenSource } from '@/components/open-source';
import { LeaveMessage } from '@/components/leave-message';
import Link from 'next/link';
import { ArrowUpRight, GitPullRequest, SquaresFour } from '@/components/icons';
import { getGithubActivity, getLeetcodeActivity, getCodeforcesActivity, getCodechefActivity, getPullRequestActivity, getAcceptedLeetcodeDays, getContributorOwners } from '@/lib/activity-server';
import { getProjects, getProfile } from '@/lib/portfolio-content';
import { OffClock } from '@/components/off-clock';
import { WritingList } from '@/components/writing-list';
import { Section, Footer } from '@/components/section';
import { LocalTime } from '@/components/site-chrome';
import { ContactButton } from '@/components/dock';
import { ProjectList } from '@/components/project-list';

export const revalidate = 3600;
export const metadata = { ...pageMetadata('/', 'Shubham Prasad · Developer', siteDescription), title: { absolute: 'Shubham Prasad · Developer' } };
export default async function Home() {
  const [github, leetcode, codeforces, codechef, activity, acceptedDays] = await Promise.all([getGithubActivity(), getLeetcodeActivity(), getCodeforcesActivity(), getCodechefActivity(), getPullRequestActivity(), getAcceptedLeetcodeDays()]);
  const [projects, profile] = await Promise.all([getProjects(), getProfile()]);
  const selectedProjects = (projects.some(p=>p.featured) ? projects.filter(p=>p.featured) : projects).slice(0,4);
  const owners = await getContributorOwners(activity);
  return <><main id="main"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(profileStructuredData()) }} /><section className="hero" id="intro"><div className="identity"><ProfileReveal photo={profile.photo} /><div><h1>{profile.name}<span className="name-period">.</span></h1><p className="role">{profile.role}</p></div></div><LocalTime /><div className="intro">{profile.bio ? <p>{profile.bio}</p> : <><p>I build software, work through hard problems, and write down what I learn. Right now, I’m exploring <LinkPreview href="/projects/merix" preview={{ title: 'Merix', description: 'Resume-to-job matching, with the reasoning behind each match.', image: '/projects/merix.jpg', label: 'Project' }}>AI applications</LinkPreview>, web development, and competitive programming.</p><p>This is a home for my projects, <LinkPreview href="#open-source" preview={{ title: 'Open-source contributions', description: `${activity.merged.count} merged pull requests in public projects, with contribution history and peer reviews.`, label: 'On this page' }}>open-source contributions</LinkPreview>, and the things I’m learning along the way. Some are finished. Most are still becoming.</p></>}</div><div className="hero-stats"><a href="#contributions"><span className="stat-icon green"><Image src="/icons/github.svg" width={19} height={19} alt="" className="stat-github-mark" /></span><strong>{github.total.toLocaleString()}</strong><span>GitHub contributions</span></a><a href="#open-source"><span className="stat-icon violet"><GitPullRequest size={17} /></span><strong>{activity.merged.count}</strong><span>PRs merged upstream</span></a><a href="#problem-solving"><span className="stat-icon amber"><span className="stat-platform-marks">{['leetcode', 'codeforces', 'codechef'].map(platform => <Image key={platform} src={`/icons/${platform}.svg`} width={18} height={18} alt="" />)}</span></span><strong>{leetcode.solved + (codeforces.solved ?? 0) + (codechef.solved ?? 0)}</strong><span>Platform solves</span></a><Link href="/projects"><span className="stat-icon blue"><SquaresFour size={17} /></span><strong>{projects.length}</strong><span>Projects & experiments</span></Link></div><div className="hero-actions"><Link href="/resume" className="button primary">Résumé <ArrowUpRight size={13} /></Link><ContactButton /><BookingLink /><SocialLinks iconsOnly /></div></section>
    <Section id="stack" title="Tech stack & tools"><TechStack /></Section>
    <Section id="projects" title="Projects" count={String(projects.length).padStart(2, '0')} href="/projects" action="All projects"><ProjectList projects={selectedProjects} /></Section>
    <Section id="work" title="Work & experience"><Experience /></Section>
    <Section id="highlights" title="Highlights"><Highlights activity={activity} /></Section>
    <Section id="problem-solving" title="Problem solving" count="03 platforms"><CodingProfiles leetcode={leetcode} codeforces={codeforces} codechef={codechef} accepted={acceptedDays} /></Section>
    <Section id="open-source" title="Open source" count={`${activity.merged.count} merged`}><OpenSource github={github} activity={activity} owners={owners} /></Section>
    <Section id="writing" title="Writing" href="/writing" action="All writing"><WritingList compact /></Section>
    <Section id="off-clock" title="Off the clock"><OffClock /></Section>
    <Section id="leave-message" title="Leave a message"><LeaveMessage /></Section>
  </main><Footer /></>;
}
