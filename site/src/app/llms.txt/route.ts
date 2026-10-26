import { agentIndex } from '@/lib/seo';
import { getContent } from '@/lib/notion-server';
import { slugSchema } from '@/lib/content-model';
import { siteOrigin } from '@/lib/seo';
import { getProfile, getProjects } from '@/lib/portfolio-content';

export const revalidate = 300;
export async function GET() {
  const [entries, projects, profile] = await Promise.all([getContent('writing'), getProjects(), getProfile()]);
  const posts=(entries || []).filter(p=>slugSchema.safeParse(p.values.Slug).success);
  const writing=posts.length ? '\n## Published writing\n'+posts.map(p=>`- [${p.name}](${siteOrigin}/writing/${p.values.Slug}): ${p.values.Summary}`).join('\n') : '';
  return new Response(agentIndex(projects, profile)+writing, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
