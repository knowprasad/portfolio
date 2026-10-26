import { getArticle } from '@/lib/notion-server';
import { slugSchema } from '@/lib/content-model';
import { articleMarkdown } from '@/lib/article-markdown';
export const revalidate = 300;
export async function GET(_request: Request, { params }: { params: Promise<{ slug:string }> }) {
  const { slug } = await params;
  if (!slugSchema.safeParse(slug).success) return new Response('Not found', { status:404 });
  const article = await getArticle(slug);
  if (!article) return new Response('Not found', { status:404 });
  return new Response(`# ${article.name}\n\n${articleMarkdown(article.blocks)}\n`, { headers:{ 'Content-Type':'text/plain; charset=utf-8','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex','Cache-Control':'public, s-maxage=300, stale-while-revalidate=300' } });
}
