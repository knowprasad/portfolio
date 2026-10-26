import Link from 'next/link';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getProfile } from '@/lib/portfolio-content';
import { Footer } from '@/components/section';
import { pageMetadata } from '@/lib/seo';
export const revalidate = 300;
export const metadata = {...pageMetadata('/resume','Résumé','Work, projects and skills by Shubham Prasad.'),robots:{index:false,follow:true}};
export default async function Resume() { const profile = await getProfile(); const url = profile.resume || (existsSync(join(process.cwd(),'public','resume.pdf')) ? '/resume.pdf' : null); return <><main id="main" className="inner-page"><Link href="/" className="back-link">← Home</Link><h1>Résumé<span>.</span></h1>{url ? <><p className="page-intro">A concise look at my work and skills.</p><a className="button primary" href={url} target="_blank" rel="noreferrer">Open résumé PDF ↗</a></> : <><p className="page-intro">I’m preparing the current version of my résumé.</p><p>In the meantime, explore my projects and campus experience, or find me on LinkedIn.</p><div className="resume-links"><Link className="button primary" href="/projects">Explore projects</Link><Link className="text-link" href="/#work">Work & experience</Link><a className="text-link" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></div></>}</main><Footer/></>; }
