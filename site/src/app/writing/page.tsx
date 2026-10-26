import Link from 'next/link';
import { WritingList } from '@/components/writing-list';
import { Footer } from '@/components/section';
import { getContent } from '@/lib/notion-server';
import { pageMetadata } from '@/lib/seo';
export const revalidate = 300;
export async function generateMetadata() { const posts = await getContent('writing'); return { ...pageMetadata('/writing','Writing','Notes on building software and working through problems.'), robots: { index: Boolean(posts?.length), follow: true } }; }
export default async function Writing({ searchParams }: { searchParams: Promise<{ tag?:string | string[] }> }) {
  const { tag: input } = await searchParams;
  const posts = await getContent('writing');
  const tags = [...new Set((posts || []).flatMap(p => p.tags))];
  const tag = typeof input === 'string' && tags.includes(input) ? input : undefined;
  return <><main id="main" tabIndex={-1} className="inner-page writing-archive"><Link href="/" className="back-link">← Home</Link><h1>Writing</h1><p className="page-intro">Notes on what I build and what I learn.</p><nav className="writing-filters" aria-label="Filter writing"><Link href="/writing" aria-current={!tag ? 'page' : undefined}>All</Link>{tags.map(t => <Link key={t} href={`/writing?tag=${encodeURIComponent(t)}`} aria-current={tag === t ? 'page' : undefined}>{t}</Link>)}</nav><WritingList tag={tag}/></main><Footer/></>;
}
