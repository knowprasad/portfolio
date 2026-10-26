import 'server-only';
import { projects, profile, friends, type Project, type Friend } from '@/data/site';
import { getContent } from './notion-server';
import { publicUrl, publicImageUrl, slugSchema } from './content-model';
import { getGithubProfile } from './github-profile-server';
import { projectCollection } from './project-selection';
export async function getProjects(): Promise<Project[]> {
  const entries = await getContent('projects');
  if (entries === null) return projects;
  return entries.filter(e => slugSchema.safeParse(e.values.Slug).success).map(e => {
    const previous = projects.find(p => p.slug === e.values.Slug);
    return { slug:e.values.Slug,name:e.name,description:e.values.Summary || '',detail:e.values.Summary || '',tags:e.tags,url:publicUrl(e.values['Live URL']),github:publicUrl(e.values['Source URL']),image:publicImageUrl(e.values.Image) || previous?.image,imageKind:previous?.imageKind,status:e.values['Project status'] || 'Project',accent:previous?.accent || 'violet',featured:e.featured,collection:projectCollection(e.values.Collection,previous?.collection) };
  });
}
export async function getProfile() {
  const [entries, github] = await Promise.all([getContent('profile'), getGithubProfile()]);
  const entry = entries?.[0];
  // Avatar delivery remains current even when GitHub's metadata API is rate-limited.
  const photo = publicImageUrl(entry?.values.Photo) || github?.avatar || 'https://github.com/knowprasad.png?size=160';
  if (!entry) return { ...profile, photo,location:'India',bio:'',resume:publicUrl(process.env.RESUME_URL) };
  return { ...profile,name:entry.name,photo,location:entry.values.Location || 'India',role:entry.values.Role || profile.role,bio:entry.values.Bio || '',resume:publicUrl(entry.values['Resume PDF']) || publicUrl(process.env.RESUME_URL),github:publicUrl(entry.values.GitHub) || profile.github,linkedin:publicUrl(entry.values.LinkedIn) || profile.linkedin,x:publicUrl(entry.values.X) || profile.x,booking:publicUrl(entry.values.Booking) || profile.booking };
}
export async function getFriends(): Promise<Friend[]> {
  const entries = await getContent('friends');
  return entries === null ? friends : entries.filter(e=>publicUrl(e.values.Website)).map(e=>({name:e.name,url:publicUrl(e.values.Website)!,avatar:publicImageUrl(e.values.Avatar),note:e.values.Summary}));
}
