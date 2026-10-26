import { getProfile } from '@/lib/portfolio-content';
import { getGithubProfile } from '@/lib/github-profile-server';
import { loadPublicProfileImage } from '@/lib/public-profile-image';

export async function GET(request: Request) {
  try {
    // A fixed owner and two supported sources; request-supplied URLs are never read.
    // Source bytes also use the fetch data cache, so arbitrary query strings cannot
    // multiply reads to GitHub or the owner's selected image host.
    const github = new URL(request.url).searchParams.get('profile') === 'github';
    const source = github ? (await getGithubProfile())?.avatar || 'https://github.com/knowprasad.png?size=160' : (await getProfile()).photo;
    const image = await loadPublicProfileImage(source);
    return new Response(image.body, { headers: { 'Content-Type': image.type, 'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=60', 'X-Content-Type-Options': 'nosniff' } });
  } catch {
    return new Response('Profile photo unavailable', { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
