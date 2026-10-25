export function authConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' || !parsed.hostname.endsWith('.supabase.co') || parsed.username || parsed.password) throw new Error('Invalid auth service configuration');
  return { url: parsed.origin, key };
}
export const googleSignInReady = () => Boolean(authConfig() && process.env.GOOGLE_AUTH_ENABLED === 'true' && process.env.VERCEL_ENV !== 'preview');

export function safeAppOrigin(candidate: string | null) {
  const origin = new URL(process.env.SITE_URL || 'https://knowprasad.me').origin;
  return candidate && [origin, 'http://127.0.0.1:3001', 'http://localhost:3001'].includes(candidate) ? candidate : origin;
}

export function callbackOrigin(host: string | null, production: boolean) {
  // Keep the PKCE/session cookie on the same local host. Production always uses
  // the configured canonical origin, never an untrusted forwarded host.
  return safeAppOrigin(!production && host ? `http://${host}` : null);
}
