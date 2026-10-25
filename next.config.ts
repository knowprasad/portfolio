import type { NextConfig } from 'next';
import { securityHeaders } from './src/lib/security';
const config: NextConfig = {
  poweredByHeader: false,
  images: { remotePatterns: [{ protocol: 'https', hostname: 'avatars.githubusercontent.com' }, { protocol: 'https', hostname: 'github.com', pathname: '/*.png' }] },
  async redirects() {
    return [{ source: '/:path*', has: [{ type: 'host', value: 'www.knowprasad.me' }], destination: 'https://knowprasad.me/:path*', permanent: true }];
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders(process.env.NODE_ENV === 'production') }];
  }
};
export default config;
