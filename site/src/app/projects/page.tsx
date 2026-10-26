import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { getProjects } from '@/lib/portfolio-content';
import { ProjectList } from '@/components/project-list';
import { Footer } from '@/components/section';
export const metadata = pageMetadata('/projects', 'Projects', 'Explore Merix, PlateWise, Pulse and YourTomo — projects by Shubham Prasad.');
export const revalidate = 300;
export default async function Projects() { const projects = await getProjects(); return <><main id="main" tabIndex={-1} className="inner-page"><Link href="/" className="back-link">← Home</Link><h1>Projects<span>.</span></h1><p className="page-intro">A few things I’m building, exploring, and putting out into the world.</p><ProjectList projects={projects} eager /></main><Footer /></>; }
