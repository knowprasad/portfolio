import type { Metadata } from 'next';
import { profile, projects, type Project } from '../data/site';

export const siteOrigin = new URL(process.env.SITE_URL || 'https://knowprasad.me').origin;
export const siteDescription = 'Projects, open-source contributions, problem solving, and notes by Shubham Prasad.';
export function pageMetadata(path: string, title: string, description: string): Metadata {
  const url = new URL(path, `${siteOrigin}/`).href;
  return {
    title, description, alternates: { canonical: url },
    openGraph: { type: 'website', title, description, url, siteName: 'Shubham Prasad', images: [{ url: `${siteOrigin}/og.png`, width: 1200, height: 630, alt: 'Shubham Prasad — developer portfolio' }] },
    twitter: { card: 'summary_large_image', title, description, images: [`${siteOrigin}/og.png`], creator: '@knowprasad' },
  };
}
export function profileStructuredData() {
  return {
    '@context': 'https://schema.org', '@type': 'ProfilePage', url: `${siteOrigin}/`,
    mainEntity: {
      '@type': 'Person', '@id': `${siteOrigin}/#person`, name: profile.name,
      alternateName: profile.handle, url: `${siteOrigin}/`, image: `${siteOrigin}/avatar.png`,
      description: siteDescription,
      sameAs: [profile.github, profile.linkedin, profile.x, profile.leetcode, `https://codeforces.com/profile/${profile.codeforces}`, `https://www.codechef.com/users/${profile.codechef}`],
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
    ...(project.image ? { image: `${siteOrigin}${project.image}` } : {}),
    keywords: project.tags.join(', '), creativeWorkStatus: project.status,
  };
}

// An optional reading index for agents, generated from the same public source as the UI.
// This is not a ranking signal or a substitute for crawlable HTML.
export function agentIndex() {
  return [
    `# ${profile.name}`,
    `> ${siteDescription}`,
    '', '## Portfolio',
    `- [Home](${siteOrigin}/): Profile, work, highlights, coding activity and open-source contributions.`,
    `- [Projects](${siteOrigin}/projects): Full project collection.`,
    `- [Activity](${siteOrigin}/activity): Detailed coding-platform history, accepted-solution streaks and source coverage.`,
    '', '## Projects',
    ...projects.map(project => `- [${project.name}](${siteOrigin}/projects/${project.slug}): ${project.detail} Status: ${project.status}.${project.github ? ` Public source: ${project.github}.` : ''}`),
    '', '## Public profiles',
    `- [GitHub](${profile.github})`, `- [LinkedIn](${profile.linkedin})`, `- [X](${profile.x})`,
    `- [LeetCode](${profile.leetcode})`, `- [Codeforces](https://codeforces.com/profile/${profile.codeforces})`,
    `- [CodeChef](https://www.codechef.com/users/${profile.codechef})`,
    '', '## Activity context',
    'Activity counts can change. Read the visible source, snapshot date and history-coverage labels on the homepage or Activity page before citing totals or streaks.',
    'Projects in progress are labeled Building. Writing and public messages are empty until real entries are published.',
    '',
  ].join('\n');
}
