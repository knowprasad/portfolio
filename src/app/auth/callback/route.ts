import { NextResponse, type NextRequest } from 'next/server';
import { authClient } from '@/lib/supabase-server';
import { slugSchema } from '@/lib/content-model';
import { callbackOrigin } from '@/lib/auth-config';
export async function GET(request: NextRequest) {
  const client = await authClient(true);
  const code = request.nextUrl.searchParams.get('code');
  const article = slugSchema.safeParse(request.nextUrl.searchParams.get('article'));
  const destination = `${callbackOrigin(request.headers.get('host'), process.env.NODE_ENV === 'production')}/guestbook${article.success ? `?article=${article.data}` : ''}`;
  if (client && code) {
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(destination, { headers: { 'Cache-Control': 'private, no-store' } });
  }
  return NextResponse.redirect(`${destination}${article.success ? '&' : '?'}auth=error`, { headers: { 'Cache-Control': 'private, no-store' } });
}
