import { NextResponse } from 'next/server';
import { getContent, getArticle } from '@/lib/notion-server';
import { getProjects } from '@/lib/portfolio-content';
import { slugSchema, plainBlocks } from '@/lib/content-model';
import { shelves } from '@/data/shelves';
export const revalidate = 300;
export async function GET() {
  const [writing,projects,work,library,places,friends] = await Promise.all([getContent('writing'),getProjects(),getContent('work'),getContent('library'),getContent('places'),getContent('friends')]);
  const entries = (writing || []).filter(e=>slugSchema.safeParse(e.values.Slug).success);
  const posts = [];
  // Bound body retrieval; caches are shared with the reading routes.
  for (const entry of entries.slice(0,100)) { const post = await getArticle(entry.values.Slug); if (post) posts.push({title:post.name,subtitle:post.values.Summary,body:plainBlocks(post.blocks),href:`/writing/${post.values.Slug}`}); }
  const libraryEntries=(library || []).map(e=>({title:e.name,subtitle:e.values.Summary || e.values.Creator || '',href:`/${e.values.Shelf==='Books'?'books':e.values.Shelf==='Watchlist'?'watchlist':e.values.Shelf==='Channels'?'channels':'articles'}`}));
  return NextResponse.json([...projects.map(p=>({title:p.name,subtitle:p.description,body:p.detail,href:`/projects/${p.slug}`})),...posts,...libraryEntries,...(places || []).map(e=>({title:e.name,subtitle:e.values.Summary || e.values.Country || '',href:'/places'})),...(friends || []).map(e=>({title:e.name,subtitle:e.values.Summary || 'Around the web',href:'/#friends'})),...(work || []).map(w=>({title:w.name,subtitle:w.values.Summary,body:w.values.Organization,href:w.values.Kind==='Highlight'?'/#highlights':'/#work'})),...Object.entries(shelves).map(([slug,s])=>({title:s.title,subtitle:s.description,href:`/${slug}`})),{title:'Tech stack & tools',subtitle:'TypeScript JavaScript Python React Next.js FastAPI Supabase Git',href:'/#stack'},{title:'Open source',subtitle:'GitHub contributions merged open closed pull requests peer reviews',href:'/#open-source'},{title:'Problem solving',subtitle:'LeetCode Codeforces CodeChef accepted problems streak calendar',href:'/#problem-solving'},{title:'Highlights',subtitle:'Achievements scholarships contributions and personal milestones',href:'/#highlights'}],{headers:{'Cache-Control':'public, s-maxage=300, stale-while-revalidate=600'}});
}
