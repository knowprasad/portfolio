import Image from 'next/image';
import Link from 'next/link';
import { ProjectIcon } from './project-icon';
import { ArrowUpRight, GithubLogo } from '@/components/icons';
import type { Project } from '@/data/site';

export function ProjectList({ projects, eager = false }: { projects: Project[]; eager?: boolean }) {
  return <div className="projects-list">{projects.map(project => <article className={`project-card ${project.accent}`} key={project.slug}>
    {project.image && <div className="project-media-wrap"><Link className="project-media" href={`/projects/${project.slug}`} aria-label={`Explore ${project.name} project details`}><Image src={project.image} unoptimized={project.image.startsWith('https:')} loading={eager && project.slug === projects[0]?.slug ? 'eager' : 'lazy'} alt={`${project.name} ${project.imageKind === 'cover' ? 'project artwork' : 'public homepage'}`} width={1200} height={750} sizes="(max-width: 600px) 92vw, 330px" /><span className="media-caption">Explore {project.name}<ArrowUpRight size={16}/></span></Link></div>}
    <div className="project-summary"><Link className="project-main" href={`/projects/${project.slug}`}><span className="project-logo"><ProjectIcon slug={project.slug}/></span><span className="project-name">{project.name}<ArrowUpRight size={13}/></span></Link><span className="project-status">{project.status}</span></div>
    <p className="project-description">{project.description}</p>
    <div className="project-bottom"><div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="project-quick-links">{project.url && <a href={project.url} target="_blank" rel="noreferrer" aria-label={`Visit ${project.name}`} title="Visit project"><ArrowUpRight size={17}/></a>}{project.github && <a href={project.github} target="_blank" rel="noreferrer" aria-label={`${project.name} source on GitHub`} title="View source"><GithubLogo size={17}/></a>}</div></div>
  </article>)}</div>;
}
