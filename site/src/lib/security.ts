const activityHosts = new Set(['github.com', 'api.github.com', 'leetcode.com', 'codeforces.com', 'www.codechef.com']);

export function validateActivityRequest(value: string, authenticated = false) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || !activityHosts.has(url.hostname) || url.port || url.username || url.password || url.hash) throw new Error('Unsupported activity source');
  if (authenticated && url.hostname !== 'api.github.com') throw new Error('Unsupported authenticated source');
  return url;
}

export function securityHeaders(production: boolean) {
  // Static/ISR pages contain Next.js inline bootstrap scripts. A nonce requires
  // dynamic rendering; keep this compatibility exception explicit (SECURITY.md).
  const csp = [
    "default-src 'self'", "base-uri 'none'", "object-src 'none'", "frame-ancestors 'none'", "frame-src 'none'",
    `script-src 'self' 'unsafe-inline'${production ? '' : " 'unsafe-eval'"}`, "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline'", "font-src 'self'",
    "img-src 'self' data: https://github.com https://avatars.githubusercontent.com https://raw.githubusercontent.com https://user-images.githubusercontent.com https://img.shields.io https://prod-files-secure.s3.us-west-2.amazonaws.com https://s3.us-west-2.amazonaws.com https://images.unsplash.com",
    `connect-src 'self' https://formspree.io${production ? '' : ' ws://127.0.0.1:3001 ws://localhost:3001'}`,
    "media-src 'self'", "form-action 'self' https://formspree.io https://hhbuhqevmskpuvybiwii.supabase.co https://accounts.google.com",
    ...(production ? ['upgrade-insecure-requests'] : []),
  ].join('; ');
  return [
    { key: 'Content-Security-Policy', value: csp },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
    ...(production ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000' }] : []),
  ];
}
