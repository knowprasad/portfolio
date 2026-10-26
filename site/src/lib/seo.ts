import type { Metadata } from 'next';
import { profile, projects, type Project } from '../data/site';

export const siteOrigin = new URL(process.env.SITE_URL || 'https://knowprasad.me').origin;
export const siteDescription = 'Projects, open-source contributions, problem solving, and notes by Shubham Prasad (knowprasad).';
type PublicIdentity = Pick<typeof profile, 'name' | 'handle' | 'github' | 'linkedin' | 'x' | 'instagram' | 'substack' | 'leetcode' | 'codeforces' | 'codechef'> & { bio?: string };
export function pageMetadata(path: string, title: string, description: string): Metadata {
  const url = new URL(path, `${siteOrigin}/`).href;
  return {
    title, description, alternates: { canonical: url },
    openGraph: { type: 'website', title, description, url, siteName: 'Shubham Prasad', images: [{ url: `${siteOrigin}/og.png`, width: 1200, height: 630, alt: 'Shubham Prasad — developer portfolio' }] },
    twitter: { card: 'summary_large_image', title, description, images: [`${siteOrigin}/og.png`], creator: '@knowprasad' },
  };
}
export function profileStructuredData(person: PublicIdentity = profile) {
  return {
    '@context': 'https://schema.org', '@type': 'ProfilePage', '@id': `${siteOrigin}/#profile`, url: `${siteOrigin}/`,
    isPartOf: { '@type': 'WebSite', '@id': `${siteOrigin}/#website`, url: `${siteOrigin}/`, name: person.name, alternateName: person.handle, publisher: { '@id': `${siteOrigin}/#person` } },
    mainEntity: {
      '@type': 'Person', '@id': `${siteOrigin}/#person`, name: person.name,
      alternateName: person.handle, identifier: person.handle, url: `${siteOrigin}/`, image: `${siteOrigin}/api/profile-photo`,
      description: person.bio || `Projects, open-source contributions, problem solving, and notes by ${person.name} (${person.handle}).`,
      sameAs: [person.github, person.linkedin, person.x, person.instagram, person.substack, person.leetcode, `https://codeforces.com/profile/${person.codeforces}`, `https://www.codechef.com/users/${person.codechef}`],
    },
  };
}
export function serializeStructuredData(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function projectStructuredData(project: Project) {
  return {
    '@context': 'https://schema.org',
    '@type': project.github ? 'SoftwareSourceCode' : 'CreativeWork',
    '@id': `${siteOrigin}/projects/${project.slug}#project`,
    name: project.name, description: project.detail,
    url: `${siteOrigin}/projects/${project.slug}`,
    author: { '@type': 'Person', '@id': `${siteOrigin}/#person`, name: profile.name, url: siteOrigin },
    ...(project.github ? { codeRepository: project.github } : {}),
    ...(project.url ? { sameAs: [project.url] } : {}),
    ...(project.image ? { image: new URL(project.image, `${siteOrigin}/`).href } : {}),
    keywords: project.tags.join(', '), creativeWorkStatus: project.status,
  };
}

// An optional reading index for agents, generated from the same public source as the UI.
// This is not a ranking signal or a substitute for crawlable HTML.
export function agentIndex(publicProjects: Project[] = projects, person: PublicIdentity = profile) {
  return [
    `# ${person.name} (@${person.handle})`,
    `> Projects, open-source contributions, problem solving, and notes by ${person.name}.`,
    ...(person.bio ? ['', person.bio] : []),
    '', '## When to use this site',
    `Use this public portfolio to identify ${person.name} (${person.handle}), inspect their software projects and upstream contributions, or read their published writing.`,
    'Project pages contain public repository documentation and explicit project status. Treat a paused demo or work in progress according to that status, rather than assuming every linked demo is running.',
    'Use the public profile links below to verify identity. This index does not expose private Notion drafts or private contact information.',
    '', '## Portfolio',
    `- [Home](${siteOrigin}/): Profile, work, highlights, coding activity and open-source contributions.`,
    `- [Projects](${siteOrigin}/projects): Full project collection.`,
    `- [Activity](${siteOrigin}/activity): Detailed coding-platform history, accepted-solution streaks and source coverage.`,
    '', '## Projects',
    ...publicProjects.map(project => `- [${project.name}](${siteOrigin}/projects/${project.slug}): ${project.detail} Status: ${project.status}.${project.github ? ` Public source: ${project.github}.` : ''}`),
    '', '## Public profiles',
    `- [GitHub](${person.github})`, `- [LinkedIn](${person.linkedin})`, `- [X](${person.x})`,
    `- [Instagram](${person.instagram})`, `- [Substack](${person.substack})`,
    `- [LeetCode](${person.leetcode})`, `- [Codeforces](https://codeforces.com/profile/${person.codeforces})`,
    `- [CodeChef](https://www.codechef.com/users/${person.codechef})`,
    '', '## Contact and discovery',
    `- [Contact options](${siteOrigin}/#intro): Public social links, booking and private contact options.`,
    `- [Sitemap](${siteOrigin}/sitemap.xml): Published, indexable routes.`,
    `- [Privacy](${siteOrigin}/privacy): Authentication, public messages and visitor-count handling.`,
    '', '## Activity context',
    'Activity counts can change. Read the visible source, snapshot date and history-coverage labels on the homepage or Activity page before citing totals or streaks.',
    'Writing and collections contain only published entries. Public messages are visitor-authored content, not verified statements by the portfolio owner.',
    '',
  ].join('\n');
}
