import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticle, getContent } from '@/lib/notion-server';
import { getProfile } from '@/lib/portfolio-content';
import { slugSchema, plainBlocks, publicUrl } from '@/lib/content-model';
import { ContentBlocks, headingId } from '@/components/content-blocks';
import { Footer } from '@/components/section';
import { pageMetadata, serializeStructuredData, siteOrigin } from '@/lib/seo';
import { ArticleComments } from '@/components/article-comments';
import { ArticleActions } from '@/components/article-actions';
import { ReaderContents, ReaderHighlights, ReaderImage } from '@/components/reader-controls';
import styles from '@/components/reader.module.css';
export const revalidate = 300;
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (!slugSchema.safeParse(slug).success) notFound();
  const post = await getArticle(slug);
  if (!post) notFound();
  const metadata = pageMetadata(`/writing/${slug}`, post.name, post.values.Summary);
  return { ...metadata, alternates: { canonical: publicUrl(post.values['Canonical URL']) || `${siteOrigin}/writing/${slug}` }, openGraph: { ...metadata.openGraph, type:'article' as const, publishedTime:post.values['Published date'] || undefined } };
}
export default async function Article({ params }: Props) {
  const { slug } = await params;
  if (!slugSchema.safeParse(slug).success) notFound();
  const [post, entries, author] = await Promise.all([getArticle(slug), getContent('writing'), getProfile()]);
  if (!post) notFound();
  const minutes = Math.max(1, Math.ceil(plainBlocks(post.blocks).trim().split(/\s+/).length / 220));
  const headings = post.blocks.filter(b => b.type.startsWith('heading_')).map(b => ({ id:headingId(b),text:b.text.map(t => t.text).join(''),nested:b.type === 'heading_3' }));
  const first = post.blocks[0];
  const cover = first?.type === 'image' && first.url ? first : undefined;
  const body = cover ? post.blocks.slice(1) : post.blocks;
  const posts = (entries || []).filter(e => slugSchema.safeParse(e.values.Slug).success).sort((a,b) => (b.values['Published date'] || '').localeCompare(a.values['Published date'] || ''));
  const index = posts.findIndex(e => e.values.Slug === slug);
  const previous = posts[index + 1], next = index > 0 ? posts[index - 1] : undefined;
  const related = posts.filter(e => e.values.Slug !== slug && e.tags.some(tag => post.tags.includes(tag))).slice(0,3);
  const canonical = publicUrl(post.values['Canonical URL']);
  return <><main id="main" tabIndex={-1} className={styles.reader}><Link className={styles.back} href="/writing">← Writing</Link><article data-reader>
    <header className={styles.header}><h1>{post.name}</h1>{post.values.Summary && <p className={styles.summary}>{post.values.Summary}</p>}<div className={styles.meta}><Link href="/#intro">{author.name}</Link>{post.values['Published date'] && <time dateTime={post.values['Published date']}>{new Date(post.values['Published date']).toLocaleDateString('en-US',{ month:'short',day:'numeric',year:'numeric',timeZone:'UTC' })}</time>}<span>{minutes} min read</span><a href={`/writing/${slug}/raw`}>view raw ↗</a></div><div className={styles.tags}>{post.tags.map(tag => <Link key={tag} href={`/writing?tag=${encodeURIComponent(tag)}`}>#{tag.toLowerCase().replaceAll(' ','-')}</Link>)}<ReaderHighlights/></div></header>
    {cover?.url && <ReaderImage src={cover.url} alt={post.name} priority/>}
    <div className={styles.readingArea}>{headings.length > 0 && <ReaderContents headings={headings}/>}<div className={styles.prose}><ContentBlocks blocks={body} reader/></div></div>
    <div className={styles.endActions}><ArticleActions/>{canonical && <a className={styles.original} href={canonical} target="_blank" rel="noreferrer">Originally published on {new URL(canonical).hostname} ↗</a>}</div>
    {post.values.Comments === 'true' && <ArticleComments slug={slug}/>}
    {(previous || next) && <nav className={styles.adjacent} aria-label="More posts">{previous && <Link href={`/writing/${previous.values.Slug}`}><small>← Previous</small><span>{previous.name}</span></Link>}{next && <Link href={`/writing/${next.values.Slug}`}><small>Next →</small><span>{next.name}</span></Link>}</nav>}
    {related.length > 0 && <section className={styles.related}><h2>Related <span>{String(related.length).padStart(2,'0')}</span></h2>{related.map(p => <Link href={`/writing/${p.values.Slug}`} key={p.id}><span>{p.name}</span><span aria-hidden="true">↗</span></Link>)}</section>}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html:serializeStructuredData({ '@context':'https://schema.org','@type':'BlogPosting',headline:post.name,description:post.values.Summary,datePublished:post.values['Published date'] || undefined,author:{ '@type':'Person',name:author.name,url:siteOrigin },mainEntityOfPage:`${siteOrigin}/writing/${slug}` }) }}/>
  </article></main><Footer/></>;
}
