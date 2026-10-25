import { createHash, randomUUID } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { authConfig } from './lib/auth-config';
import { securityHeaders } from './lib/security';
import { themeScript } from './lib/theme-script';

// Authenticated pages are dynamic and receive fresh nonces. Public ISR stays cached.
export async function proxy(request: NextRequest) {
  const nonce = Buffer.from(randomUUID()).toString('base64');
  const hash = createHash('sha256').update(themeScript).digest('base64');
  const production = process.env.NODE_ENV === 'production';
  let policy = securityHeaders(production).find(header => header.key === 'Content-Security-Policy')!.value.replace(/script-src [^;]+/, `script-src 'self' 'nonce-${nonce}' 'sha256-${hash}' 'strict-dynamic'${production ? '' : " 'unsafe-eval'"}`);
  const headers = new Headers(request.headers);
  headers.set('x-nonce', nonce);
  headers.set('Content-Security-Policy', policy);
  let response = NextResponse.next({ request: { headers } });
  const config = authConfig();
  if (config && request.cookies.getAll().some(cookie => cookie.name.startsWith('sb-'))) {
    const supabase = createServerClient(config.url, config.key, {
      cookieOptions: { httpOnly: true, sameSite: 'lax', secure: production, path: '/' },
      cookies: { getAll: () => request.cookies.getAll(), setAll(values, cacheHeaders) {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        headers.set('cookie', request.cookies.toString());
        response = NextResponse.next({ request: { headers } });
        values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(cacheHeaders).forEach(([key, value]) => response.headers.set(key, value));
      } },
    });
    await supabase.auth.getUser();
  }
  if (config) policy = policy.replace(/form-action [^;]+/, `form-action 'self' ${config.url} https://accounts.google.com`);
  response.headers.set('Content-Security-Policy', policy);
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  return response;
}
export const config = { matcher: ['/guestbook', '/auth/:path*'] };
