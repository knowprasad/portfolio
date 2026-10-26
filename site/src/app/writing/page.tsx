import Link from 'next/link';
import { WritingList } from '@/components/writing-list';
import { Footer } from '@/components/section';
import { getContent } from '@/lib/notion-server';
import { pageMetadata } from '@/lib/seo';
export const revalidate = 300;
export async function generateMetadata() { const posts = await getContent('writing'); return { ...pageMetadata('/writing','Writing','Notes on building software and working through problems.'), robots: { index: Boolean(posts?.length), follow: true } }; }
export default function Writing() { return <><main id="main" tabIndex={-1} className="inner-page"><Link href="/" className="back-link">← Home</Link><h1>Writing<span>.</span></h1><p className="page-intro">Notes on what I build and what I learn.</p><WritingList/></main><Footer/></>; }
