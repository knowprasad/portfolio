import type { Project } from '@/data/site';

export function projectCollection(value: string | undefined, fallback?: Project['collection']): NonNullable<Project['collection']> {
  if (value === 'Side quests') return 'side-quest';
  if (value === 'Current projects') return 'current';
  return fallback || 'current';
}

export function homepageProjects(projects: Project[]) {
  // A building project remains in the archive until the owner explicitly features it.
  return projects.filter(p => p.collection !== 'side-quest' && p.featured).slice(0,4);
}
