import type { ContentBlock } from './content-model';

export const projectSections = [
  { id: 'overview', title: 'Overview & status' },
  { id: 'walkthrough', title: 'Screens & walkthrough' },
  { id: 'ownership', title: 'My role & ownership' },
  { id: 'architecture', title: 'Architecture & decisions' },
  { id: 'limitations', title: 'Limitations & links' },
] as const;
type SectionId = typeof projectSections[number]['id'];
const aliases: Record<SectionId, string[]> = {
  overview: ['overview', 'overview and status', 'about the project', 'about', 'current status'],
  walkthrough: ['screens and walkthrough', 'screenshots and walkthrough', 'screens', 'screenshots', 'walkthrough', 'demo'],
  ownership: ['my role and ownership', 'role and ownership', 'my role', 'role', 'ownership'],
  architecture: ['architecture and decisions', 'architecture and important decisions', 'architecture', 'technical architecture', 'important decisions', 'technical decisions'],
  limitations: ['limitations and links', 'limitations and working links', 'limitations', 'current service note', 'working links', 'links'],
};

// Group existing content without rewriting it or mutating the CMS response.
export function groupProjectBlocks(blocks: ContentBlock[]): Record<SectionId, ContentBlock[]> {
  const grouped: Record<SectionId, ContentBlock[]> = { overview: [], walkthrough: [], ownership: [], architecture: [], limitations: [] };
  let current: SectionId = 'overview';
  for (const block of blocks) {
    if (/^heading_[123]$/.test(block.type)) {
      const title = block.text.map(part => part.text).join('').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
      const matched = projectSections.find(section => aliases[section.id].includes(title));
      if (matched) {
        current = matched.id;
        grouped[current].push(...block.children);
        continue;
      }
      grouped[current].push({ ...block, type: 'heading_3' });
    } else grouped[current].push(block);
  }
  return grouped;
}
