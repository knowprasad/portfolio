import Image from 'next/image';
import { pageMetadata, projectStructuredData, serializeStructuredData } from '@/lib/seo';
import { ProjectIcon } from '@/components/project-icon';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjects } from '@/lib/portfolio-content';
import { getProjectBody } from '@/lib/notion-server';
import { ContentBlocks } from '@/components/content-blocks';
import { groupProjectBlocks, projectSections } from '@/lib/project-detail-sections';
import { getProjectReadme } from '@/lib/project-readme-server';
import { ProjectReadmeContent } from '@/components/project-readme-content';
import { Footer } from '@/components/section';
export const revalidate = 300;
export async function generateStaticParams() { return (await getProjects()).map(p => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{slug: string}> }) { const { slug } = await params; const project = (await getProjects()).find(p => p.slug === slug); if (!project) notFound(); return pageMetadata(`/projects/${project.slug}`, project.name, project.description); }
export default async function Project({ params }: { params: Promise<{slug: string}> }) {
  const { slug } = await params; const project = (await getProjects()).find(p => p.slug === slug); if (!project) notFound();
  const [body, readme] = await Promise.all([getProjectBody(slug), getProjectReadme(project.github)]);
  const sections = groupProjectBlocks(body);
  const visibleSections = projectSections.filter(section => !readme || !['ownership', 'architecture'].includes(section.id) || sections[section.id].length);
  const navigationSections = visibleSections.flatMap(section => section.id === 'overview' && readme ? [section, { id: 'readme', title: 'README' }] : [section]);
  return <><main id="main" tabIndex={-1} className="inner-page project-case-study"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(projectStructuredData(project)) }} /><Link href="/projects" className="back-link">← All projects</Link><h1 className="project-page-heading"><ProjectIcon slug={project.slug} size={42} /><span className="project-title-text">{project.name}<span>.</span></span></h1><p className="page-intro">{project.description}</p>
    <nav className="project-section-nav" aria-label="Project contents">{navigationSections.map(section => <a href={`#${section.id}`} key={section.id}>{section.title}</a>)}</nav>
    <section id="overview" className="project-detail-section article-prose"><h2>Overview & status</h2><p className="project-current-status"><span>Current status</span><strong>{project.status}</strong></p><div className="project-tags detail-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>{sections.overview.length ? <ContentBlocks blocks={sections.overview}/> : <p>{project.detail}</p>}</section>
    {readme ? <ProjectReadmeContent readme={readme}/> : project.github && <p className="readme-unavailable">Repository documentation is unavailable right now. <a href={project.github} target="_blank" rel="noreferrer">Read it on GitHub ↗</a></p>}
    <section id="walkthrough" className="project-detail-section article-prose"><h2>Screens & walkthrough</h2>{project.image && <figure><Image className="detail-media" src={project.image} unoptimized={project.image.startsWith('https:')} alt={`${project.name} ${project.imageKind === 'cover' ? 'project artwork' : 'preview'}`} width={1440} height={950} sizes="(max-width:700px) 92vw,680px"/><figcaption>{project.imageKind === 'cover' ? 'Project artwork.' : 'Project preview.'}</figcaption></figure>}{sections.walkthrough.length ? <ContentBlocks blocks={sections.walkthrough}/> : !project.image && <p className="project-detail-missing">A screen capture or walkthrough has not been published yet.</p>}</section>
    {visibleSections.some(section => section.id === 'ownership') && <section id="ownership" className="project-detail-section article-prose"><h2>My role & ownership</h2>{sections.ownership.length ? <ContentBlocks blocks={sections.ownership}/> : <p className="project-detail-missing">Role and ownership details have not been published yet.</p>}</section>}
    {visibleSections.some(section => section.id === 'architecture') && <section id="architecture" className="project-detail-section article-prose"><h2>Architecture & decisions</h2>{sections.architecture.length ? <ContentBlocks blocks={sections.architecture}/> : <p className="project-detail-missing">Architecture notes and important decisions have not been published yet.</p>}{project.github && <a className="text-link" href={project.github} target="_blank" rel="noreferrer">Inspect the repository ↗</a>}</section>}
    <section id="limitations" className="project-detail-section article-prose"><h2>Limitations & links</h2>{sections.limitations.length ? <ContentBlocks blocks={sections.limitations}/> : <p className="project-detail-missing">Additional limitations have not been documented yet.</p>}<div className="project-detail-links">{project.url && <a className="button primary" href={project.url} target="_blank" rel="noreferrer">{project.status === 'Demo paused' ? 'Project homepage' : 'Visit project'} ↗</a>}{project.github && <a className="button" href={project.github} target="_blank" rel="noreferrer">View source ↗</a>}{!project.url && !project.github && <p>No public demo or source link is available.</p>}</div></section>
  </main><Footer /></>;
}
