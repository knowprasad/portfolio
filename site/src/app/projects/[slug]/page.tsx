import Image from 'next/image';
import { pageMetadata, projectStructuredData, serializeStructuredData } from '@/lib/seo';
import { ProjectIcon } from '@/components/project-icon';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjects } from '@/lib/portfolio-content';
import { getProjectBody } from '@/lib/notion-server';
import { ContentBlocks } from '@/components/content-blocks';
import { Footer } from '@/components/section';
export const revalidate = 300;
export async function generateStaticParams() { return (await getProjects()).map(p => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{slug: string}> }) { const { slug } = await params; const project = (await getProjects()).find(p => p.slug === slug); if (!project) notFound(); return pageMetadata(`/projects/${project.slug}`, project.name, project.description); }
export default async function Project({ params }: { params: Promise<{slug: string}> }) {
  const { slug } = await params; const project = (await getProjects()).find(p => p.slug === slug); if (!project) notFound();
  const body = await getProjectBody(slug);
  return <><main id="main" className="inner-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(projectStructuredData(project)) }} /><Link href="/projects" className="back-link">← All projects</Link><h1 className="project-page-heading"><ProjectIcon slug={project.slug} size={42} />{project.name}<span>.</span></h1><p className="page-intro">{project.description}</p><div className="project-tags detail-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>{project.image && <Image className="detail-media" src={project.image} unoptimized={project.image.startsWith('https:')} alt={`${project.name} ${project.imageKind === 'cover' ? 'project artwork' : 'homepage'}`} width={1440} height={950} priority sizes="(max-width:700px) 92vw,680px" />}<div className="article-prose"><h2>About the project</h2>{body.length ? <ContentBlocks blocks={body}/> : <p>{project.detail}</p>}</div><div className="dialog-links">{project.url && <a className="button primary" href={project.url} target="_blank" rel="noreferrer">Visit project ↗</a>}{project.github && <a className="button" href={project.github} target="_blank" rel="noreferrer">View source ↗</a>}</div></main><Footer /></>;
}
