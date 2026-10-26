import Link from 'next/link';
export default function NotFound() { return <main id="main" tabIndex={-1} className="inner-page"><span className="source-tag">404</span><h1>A small detour.</h1><p className="page-intro">This page isn’t here. Let’s find your way back.</p><Link className="button primary" href="/">Back home ↗</Link></main>; }
