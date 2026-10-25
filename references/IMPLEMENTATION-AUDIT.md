# Portfolio request audit · 25 October 2026

Latest owner choices supersede earlier alternatives. This is a delivery checklist, not a claim that every integration is live.

## Implemented in the application

- [x] Next.js/TypeScript rebuild; preserve research outside production.
- [x] Fresher order: hero → tools → projects → work/experience → highlights.
- [x] Geist/Paper Mono typography, larger readable headings/body; black/white circular theme reveal.
- [x] Theme-specific shadows; paired dashed separators; no pointer ring/section glow.
- [x] Compact filled tool icons with hover/focus names, based on verified own GitHub work.
- [x] Always-visible project previews, subtle mouse/focus feedback, own marks and project archive/details.
- [x] Expandable work/experience; achievements inside Highlights only; show all/less on homepage.
- [x] GitHub/LinkedIn/X/Instagram/Substack profile hover/focus previews; broken icon assets fixed.
- [x] Green contribution calendar, organization/individual symbols, more/less, merged/open/closed/peer-reviewed PR views and sliding hover surface.
- [x] All/LeetCode/Codeforces/CodeChef views; accepted-solution cross-platform streak with history caveats.
- [x] Arman-style guestbook sign-in panel and avatar/comment bubbles; full-list page.
- [x] Google server actions, PKCE callback, HTTP-only sessions, private/no-store authenticated pages.
- [x] Moderated persistent messages, database rate limit, own-submission list/deletion; per-article discussions.
- [x] Original anime favicon/avatar, click nudge/photo reveal; opt-in reveal/interface sounds.
- [x] Expanding Book a call stays in HERO, linked to cal.com/knowprasad.
- [x] Friends/footer/contact; Email/Copy labels; no invented friends or webring membership.
- [x] Xevrion-style collage: books, watchlist, places, articles/papers, channels; real shelf routes and Visited/Want to go.
- [x] Writing index/full article pages, contents, reading time, copy/share and discussion.
- [x] Whole-site fuzzy dock search indexes published article bodies, projects and sections.
- [x] Résumé route supports a real PDF from Notion, RESUME_URL or public/resume.pdf; useful fallback without fake PDF.
- [x] Canonicals, structured data, social previews, sitemap, robots and optional agent reading index.
- [x] Server-only Notion adapter; eight fixed data sources; Published-only queries/defensive filters; five-minute caches.
- [x] Private Notion CMS hub, eight databases, starter drafts and owner guide created.
- [x] Visitor-count database/RPC/API/UI; no simulated total; local counting intentionally disabled.

## Account connection and release verification

- [x] Free portfolio Supabase project; Merix paused only after explicit owner authorization.
- [x] Guestbook, article discussions and visitor-counter migrations applied.
- [x] Approved Google OAuth client created; credentials stored only in Supabase provider; provider shows ENABLED.
- [ ] Finish Supabase site/return URLs; exercise actual Google login/post/moderation.
- [ ] Create approved read-only Notion connection, scope to Portfolio CMS, store token in ignored server environment.
- [ ] Verify real draft → Published → edit → Archived cycle; no private/draft leaks.
- [x] Published and verified on Vercel Hobby at https://prsdxportfolio-mauve.vercel.app; required server variables configured.
- [x] Live 320px/390px phone layouts verified with no horizontal overflow; dark/light checks passed. Fourteen live routes returned HTTP 200. Final OAuth/publishing checks remain separately pending.

Chrome page control began timing out after reconnecting. Account setup is not complete until verified. No paid service or framework reinstall is needed.

## Owner content still needed

- Current résumé PDF (none supplied; never fabricate).
- Chosen friends/URLs (owner said later).
- Real shelf entries and own written posts.

Do not add a separate Achievements section, copied reference achievements, fake comments/ratings, automatic Medium publishing, paid preview service or a custom webring.

## Release evidence

Deployment dpl_8nv2bXrB3xsddrSfr2NDX4xrWUyY is READY. The first deployment used an incorrect Other framework preset and returned 404; vercel.json now explicitly selects Next.js. Canonicals and same-origin checks use the actual assigned alias. npm audit found 0 known vulnerabilities; lint, TypeScript and 29 tests passed.
