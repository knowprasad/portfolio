import type { MetadataRoute } from 'next';
import { siteOrigin } from '@/lib/seo';
import { getProjects } from '@/lib/portfolio-content';
import { getContent } from '@/lib/notion-server';
import { slugSchema } from '@/lib/content-model';
import { shelves } from '@/data/shelves';
import {libraryKind,collectionSlug} from '@/lib/collection-content';
export const revalidate = 300;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects,writing,library,places] = await Promise.all([getProjects(),getContent('writing'),getContent('library'),getContent('places')]);
  const posts = (writing || []).filter(e=>slugSchema.safeParse(e.values.Slug).success);
  const shelfPaths = Object.entries(shelves).filter(([slug,s])=>slug==='places'?Boolean(places?.length):library?.some(e=>e.values.Shelf===s.shelf || (slug==='articles' && e.values.Shelf==='Papers'))).map(([slug])=>`/${slug}`);
  const notePaths=[...(library||[]).flatMap(entry=>{const kind=libraryKind(entry);return kind?[`/${kind}/${collectionSlug(entry)}`]:[];}),...(places||[]).map(entry=>`/places/${collectionSlug(entry)}`)];
  return ['', '/projects', '/activity', '/privacy', ...projects.map(project => `/projects/${project.slug}`), ...(posts.length?['/writing',...posts.map(p=>`/writing/${p.values.Slug}`)]:[]),...shelfPaths,...notePaths].map(path => ({ url: `${siteOrigin}${path || '/'}` }));
}
