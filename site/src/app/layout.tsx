import type { Metadata } from 'next';
import { siteOrigin, siteDescription } from '@/lib/seo';
import localFont from 'next/font/local';
import { SiteChrome } from '@/components/site-chrome';
import { Dock } from '@/components/dock';
import { themeScript } from '@/lib/theme-script';
import './globals.css';

// A slow font download must not reflow the already-visible mobile page.
const body = localFont({ src: '../../public/fonts/Geist-Variable.woff2', variable: '--font-body', display: 'optional', weight: '100 900' });
const mono = localFont({ src: '../../public/fonts/paper-mono.woff2', variable: '--font-mono', display: 'optional', weight: '100 800' });
export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: { default: 'Shubham Prasad · Developer', template: '%s · Shubham Prasad' },
  description: siteDescription,
  applicationName: 'Shubham Prasad', authors: [{ name: 'Shubham Prasad', url: siteOrigin }],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  openGraph: { title: 'Shubham Prasad', description: siteDescription, type: 'website', siteName: 'Shubham Prasad', images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Shubham Prasad — developer portfolio' }] },
  twitter: { card: 'summary_large_image', creator: '@knowprasad', images: ['/og.png'] },
  icons: { icon: { url: '/icon.png?v=shadow-1', type: 'image/png', sizes: '64x64' }, apple: '/apple-touch-icon.png?v=shadow-1' },
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en" data-theme="dark" suppressHydrationWarning className={`${body.variable} ${mono.variable}`}><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body><SiteChrome /><div className="page">{children}</div><Dock /></body></html>;
}
