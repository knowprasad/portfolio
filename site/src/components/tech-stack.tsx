import Image from 'next/image';
import { getContent } from '@/lib/notion-server';
import { publicUrl } from '@/lib/content-model';

const tools = [
  ['JavaScript', 'javascript', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', 'Language'],
  ['C++', 'cplusplus', 'https://isocpp.org/', 'Language'],
  ['TypeScript', 'typescript', 'https://www.typescriptlang.org/', 'Language'],
  ['Python', 'python', 'https://www.python.org/', 'Language'],
  ['React', 'react', 'https://react.dev/', 'UI library'],
  ['Next.js', 'nextdotjs', 'https://nextjs.org/', 'Framework'],
  ['Tailwind CSS', 'tailwindcss', 'https://tailwindcss.com/', 'Styling'],
  ['FastAPI', 'fastapi', 'https://fastapi.tiangolo.com/', 'Backend'],
  ['Supabase', 'supabase', 'https://supabase.com/', 'Backend platform'],
  ['PostgreSQL', 'postgresql', 'https://www.postgresql.org/', 'Database'],
  ['Node.js', 'nodejs', 'https://nodejs.org/', 'Runtime'],
  ['Express', 'express', 'https://expressjs.com/', 'Backend'],
  ['MongoDB', 'mongodb', 'https://www.mongodb.com/', 'Database'],
  ['Socket.IO', 'socketio', 'https://socket.io/', 'Real-time'],
  ['LangChain', 'langchain', 'https://www.langchain.com/', 'AI tooling'],
  ['Astro', 'astro', 'https://astro.build/', 'Framework'],
  ['GitHub Actions', 'githubactions', 'https://github.com/features/actions', 'CI/CD'],
  ['Git', 'git', 'https://git-scm.com/', 'Version control'],
  ['GitHub', 'github', 'https://github.com/', 'Collaboration'],
  ['Notion', 'notion', 'https://www.notion.so/', 'Writing & planning'],
  ['Vercel', 'vercel', 'https://vercel.com/', 'Deployment'],
] as const;

export async function TechStack() {
  const entries = await getContent('stack');
  const selectedTools = entries === null ? tools : entries.flatMap(e=>{const match=tools.find(t=>t[1]===e.values['Icon key']);return match ? [[e.name,match[1],publicUrl(e.values.Website) || match[2],e.values.Category || match[3]]] : [];});
  return <div className="stack-symbols" aria-label="Technologies and tools">{selectedTools.map(([name, icon, url, category]) => <a className="stack-symbol" key={icon} href={url} target="_blank" rel="noreferrer" aria-label={name}><Image src={`/stack-icons/${icon}.svg`} width={20} height={20} alt="" /><span className="stack-name" aria-hidden="true"><strong>{name}</strong><small>{category}</small></span></a>)}</div>;
}
