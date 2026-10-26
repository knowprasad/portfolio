import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { getProjects } from '@/lib/portfolio-content';
import { ProjectList, SideQuestList } from '@/components/project-list';
import { Footer } from '@/components/section';
import styles from './projects.module.css';
export const metadata = pageMetadata('/projects', 'Projects', 'Current projects and side quests by Shubham Prasad.');
export const revalidate = 300;
export default async function Projects() {
  const projects = await getProjects();
  const current = projects.filter(p=>p.collection !== 'side-quest');
  const sideQuests = projects.filter(p=>p.collection === 'side-quest');
  return <><main id="main" tabIndex={-1} className={styles.page}><header><h1>Projects</h1><p>What I’m building now, and the smaller things I make along the way.</p></header>{current.length > 0 && <section id="current" className={styles.group}><h2>Current projects <span>/ {String(current.length).padStart(2,'0')}</span></h2><ProjectList projects={current} eager archive/></section>}{sideQuests.length > 0 && <section id="side-quests" className={styles.group}><h2>Side quests <span>/ {String(sideQuests.length).padStart(2,'0')}</span></h2><p className={styles.note}>Smaller experiments, tools, and things built for the fun of it.</p><SideQuestList projects={sideQuests}/></section>}<Link href="/#projects" className={styles.back}>← Back home</Link></main><Footer/></>;
}
