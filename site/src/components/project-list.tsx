import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ProjectIcon } from './project-icon';
import { ArrowUpRight } from './icons';
import type { Project } from '@/data/site';
import styles from './project-list.module.css';
const accents: Record<string,string> = {violet:'#a991f7',orange:'#e5aa75',blue:'#8bb8f5',green:'#98bd8c'};
export function ProjectList({ projects, eager = false, archive = false }: { projects: Project[]; eager?: boolean; archive?: boolean }) {
  return <ul className={`${styles.list} ${archive ? styles.archive : styles.home}`}>{projects.map((project,index) => <li key={project.slug}>
    <article className={styles.card} style={{'--project-accent':accents[project.accent] || accents.blue} as CSSProperties}>
      {project.image && <div className={styles.preview}><Image src={project.image} unoptimized={project.image.startsWith('https:')} loading={eager && index === 0 ? 'eager' : 'lazy'} alt={`${project.name} ${project.imageKind === 'cover' ? 'project artwork' : 'public homepage'}`} width={1200} height={500} style={{objectPosition:project.imageKind === 'cover' ? 'center' : 'top'}} sizes={archive ? '(max-width:680px) 100vw,640px' : '(max-width:600px) 100vw,330px'}/></div>}
      <div className={styles.body}><div className={styles.heading}><span className={styles.icon} aria-hidden="true"><ProjectIcon slug={project.slug}/></span><div className={styles.titleGroup}><div className={styles.name}><h3><Link className={styles.mainLink} href={`/projects/${project.slug}`}>{project.name}</Link></h3><span className={styles.status}>{project.status}</span></div><ProjectLinks project={project}/></div></div><div className={styles.description}><p>{archive ? project.detail || project.description : project.description}</p><ProjectTags tags={project.tags}/></div></div>
    </article>
  </li>)}</ul>;
}
function ProjectTags({tags}:{tags:string[]}) { return tags.length > 0 && <ul className={styles.tags} aria-label="Built with">{tags.map(tag=><li key={tag}>{tag}</li>)}</ul>; }
function ProjectLinks({project}:{project:Project}) { return <div className={styles.links}>{project.url && <a href={project.url} target="_blank" rel="noreferrer" aria-label={`Site: ${project.name}`}>Site<ArrowUpRight size={12}/></a>}{project.github && <a href={project.github} target="_blank" rel="noreferrer" aria-label={`${project.name} on GitHub`}>GitHub<ArrowUpRight size={12}/></a>}</div>; }
export function SideQuestList({projects}:{projects:Project[]}) {
  return <ul className={styles.sideQuests}>{projects.map(project=><li className={styles.quest} key={project.slug}><span className={styles.icon} aria-hidden="true"><ProjectIcon slug={project.slug}/></span><div className={styles.questBody}><div className={styles.questHeading}><h3><Link href={`/projects/${project.slug}`}>{project.name}</Link></h3><ProjectLinks project={project}/></div><p>{project.description}</p><ProjectTags tags={project.tags}/></div></li>)}</ul>;
}
