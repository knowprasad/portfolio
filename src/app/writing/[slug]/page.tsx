import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticle } from '@/lib/notion-server';
import { slugSchema, plainBlocks, publicUrl } from '@/lib/content-model';
import { ContentBlocks, headingId } from '@/components/content-blocks';
import { Footer } from '@/components/section';
import { pageMetadata, serializeStructuredData, siteOrigin } from '@/lib/seo';
import { ArticleComments } from '@/components/article-comments';
import { ArticleActions } from '@/components/article-actions';
export const revalidate = 300;
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) { const {slug} = await params; if (!slugSchema.safeParse(slug).success) notFound(); const post = await getArticle(slug); if (!post) notFound(); const canonical = publicUrl(post.values['Canonical URL']) || `${siteOrigin}/writing/${slug}`; return { ...pageMetadata(`/writing/${slug}`,post.name,post.values.Summary), alternates: { canonical }, openGraph: { ...pageMetadata(`/writing/${slug}`,post.name,post.values.Summary).openGraph, type: 'article' as const, publishedTime: post.values['Published date'] || undefined } }; }
export default async function Article({ params }: Props) {
  const {slug} = await params; if (!slugSchema.safeParse(slug).success) notFound(); const post = await getArticle(slug); if (!post) notFound();
  const minutes = Math.max(1, Math.ceil(plainBlocks(post.blocks).split(/\s+/).length / 220));
  const headings = post.blocks.filter(b => b.type.startsWith('heading_'));
  return <><main id="main" className="inner-page article-page"><Link className="back-link" href="/writing">← All writing</Link><article><header><h1>{post.name}</h1><p className="page-intro">{post.values.Summary}</p><p className="article-meta">{post.values['Published date']?.slice(0,10)} · {minutes} min read</p><ArticleActions/></header>{headings.length > 2 && <details className="article-toc"><summary>On this page</summary><nav aria-label="Article contents">{headings.map(h => <a key={h.id} href={`#${headingId(h)}`}>{h.text.map(t => t.text).join('')}</a>)}</nav></details>}<div className="article-prose"><ContentBlocks blocks={post.blocks}/></div><script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeStructuredData({'@context':'https://schema.org','@type':'BlogPosting',headline:post.name,description:post.values.Summary,datePublished:post.values['Published date'] || undefined,author:{'@type':'Person',name:'Shubham Prasad',url:siteOrigin},mainEntityOfPage:`${siteOrigin}/writing/${slug}`})}}/>{post.values.Comments === 'true' && <ArticleComments slug={slug}/>}<Link className="text-link" href="/writing">Read more writing →</Link></article></main><Footer/></>;
}
