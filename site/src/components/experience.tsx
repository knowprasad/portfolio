import { getContent } from '@/lib/notion-server';
import { publicUrl } from '@/lib/content-model';
import { LinkPreview } from './link-preview';
import type { PrActivity } from '@/lib/activity';
import { CaretDown, ArrowUpRight, Code, UsersThree, GraduationCap } from '@/components/icons';

const experience = [
  { role: 'GDG Web Lead', organization: 'Google Developer Groups · IIITM Gwalior', period: 'Oct 2026 – Present', type: 'Campus leadership', Icon: Code, details: ['Web lead for the GDG community at IIITM Gwalior.', 'A campus role bringing my web development interests into the developer community.'], url: 'https://www.linkedin.com/company/69827636/' },
  { role: 'Operations Team Member', organization: 'Rotaract Club of IIIT Gwalior', period: 'Dec 2024 – Jun 2026', type: 'Campus involvement', Icon: UsersThree, details: ['Part of the operations team at the Rotaract Club of IIIT Gwalior.', 'Experience in team management, coordination and working with a student community.'], url: 'https://www.linkedin.com/company/14592664/' },
  { role: 'Technical Team Member', organization: 'IEEE Student Branch · IIITM', period: 'Mar 2025 – Jan 2026', type: 'Technical community', Icon: Code, details: ['Technical team member at the IEEE Student Branch, IIITM.', 'Contributed as part of the campus technical community.'], url: 'https://www.linkedin.com/company/66305792/' },
  { role: 'Project Contributor', organization: 'GirlScript Summer of Code', period: 'Jul 2025 – Oct 2025', type: 'Open-source program', Icon: GraduationCap, details: ['Participated as a project contributor in GirlScript Summer of Code 2025.', 'Worked with open-source codebases, version control and community collaboration.'], url: 'https://www.linkedin.com/company/14488336/' },
];

export async function Experience() {
  const content = await getContent('work');
  const items = content === null ? experience : content.filter(e=>e.values.Kind==='Experience').map(e=>({role:e.name,organization:e.values.Organization || '',period:[e.values.Start?.slice(0,7), e.values.Current==='true'?'Present':e.values.End?.slice(0,7)].filter(Boolean).join(' – '),type:e.values.Category || 'Experience',Icon:Code,details:[e.values.Summary].filter(Boolean),url:publicUrl(e.values.Source) || 'https://www.linkedin.com/in/knowprasad/'}));
  return <div className="experience-list">{items.map(({ role, organization, period, type, Icon, details, url }, index) => <details className="experience-item" key={role} open={index === 0}><summary><span className="experience-icon"><Icon size={21} /></span><span className="experience-summary"><strong>{role}</strong><span>{organization}</span><small>{period}</small></span><CaretDown className="experience-caret" size={15} /></summary><div className="experience-details"><span className="experience-kind">{type}</span><ul>{details.map(detail => <li key={detail}>{detail}</li>)}</ul><LinkPreview href={url} className="text-link" target="_blank" rel="noreferrer" preview={{ title: organization, description: `${role} · ${period}. ${type}.`, label: 'LinkedIn' }}>Organization <ArrowUpRight size={12} /></LinkPreview></div></details>)}</div>;
}

export async function Highlights({ activity }: { activity: PrActivity }) {
  const content = await getContent('work');
  const defaults = [
    { title: `${activity.merged.count} pull requests merged into public projects`, context: 'GitHub', url: 'https://github.com/search?q=author%3Aknowprasad+is%3Apr+is%3Amerged+is%3Apublic+-user%3Aknowprasad&type=pullrequests' },
    { title: `Reviewed ${activity.reviewed.count} public pull requests from other developers`, context: 'GitHub', url: 'https://github.com/search?q=reviewed-by%3Aknowprasad+-author%3Aknowprasad+is%3Apr+is%3Apublic&type=pullrequests' },
    { title: 'Foundation for Excellence Scholar', context: 'Scholarship', url: 'https://www.linkedin.com/in/knowprasad/details/experience/' },
    { title: 'Siemens Scholar', context: 'Scholarship', url: 'https://www.linkedin.com/in/knowprasad/details/experience/' },
    { title: 'Reliance Foundation Scholar', context: 'Scholarship', url: 'https://www.linkedin.com/in/knowprasad/details/experience/' },
    { title: 'Smart India Hackathon · Institute-level selection', context: 'SIH 2024', url: 'https://www.linkedin.com/in/knowprasad/' },
    { title: 'My first DevFest · Noida 2026', context: 'LinkedIn', url: 'https://www.linkedin.com/feed/update/urn:li:activity:7517655707249393664/' },
  ];
  const entries = content === null ? defaults : [...defaults.slice(0,2), ...content.filter(e=>e.values.Kind==='Highlight').map(e=>({title:e.name,context:e.values.Category || 'Highlight',url:publicUrl(e.values.Source) || 'https://www.linkedin.com/in/knowprasad/'}))];
  const list = (items: typeof entries) => <ul className="highlights-list editorial-highlights">{items.map(entry => <li key={entry.title}><LinkPreview href={entry.url} className="highlight-link" target="_blank" rel="noreferrer" preview={{ title: entry.title, description: entry.context === 'GitHub' ? 'Public contribution activity, linked to the underlying pull requests on GitHub.' : 'From my public profile and updates. Open the source for context.', label: entry.context }}>{entry.title}</LinkPreview><span className="highlight-context">{entry.context}</span></li>)}</ul>;
  return <>{list(entries.slice(0, 4))}{entries.length > 4 && <details className="highlights-more"><summary><span className="when-collapsed">Show all {entries.length} highlights</span><span className="when-expanded">Show less</span><CaretDown size={13} /></summary><div className="extra-highlights">{list(entries.slice(4))}</div></details>}</>;
}
