# Portfolio request audit · 26 October 2026

Latest owner choices supersede earlier alternatives. This is a delivery checklist, not a claim that every integration is live.

## Implemented in the application

- [x] Next.js/TypeScript rebuild under site/; old Astro files removed with owner approval, recoverable in Git history; research outside production.
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
- [x] Canonical Supabase site/return URLs configured; real Google sign-in, private pending submission, own deletion and sign-out verified.
- [x] Approved read-only Notion connection scoped to Portfolio CMS; token stored only in ignored/server environments.
- [ ] Verify real draft → Published → edit → Archived cycle; no private/draft leaks.
- [x] Published and verified on Vercel Hobby at https://prsdxportfolio-mauve.vercel.app; required server variables configured.
- [x] Live 320px/390px phone layouts verified with no horizontal overflow; dark/light checks passed. Twenty live routes returned HTTP 200. The site-folder release and GitHub-to-Vercel production deployment were verified.

Account configuration was completed through the in-app browser after Chrome control failed. No paid service or framework reinstall was needed.

## Owner content still needed

- Current résumé PDF (none supplied; never fabricate).
- Chosen friends/URLs (owner said later).
- Real shelf entries and own written posts.

Do not add a separate Achievements section, copied reference achievements, fake comments/ratings, automatic Medium publishing, paid preview service or a custom webring.

## Release evidence

GitHub main commit `9dded1f42d5e2a1b8f1d6ad8a28fee197359784c` automatically deployed through the repository integration as `dpl_8DpDq6oLHiFzKC9vzfxQapT5qAK8`, READY and aliased to https://knowprasad.me/. The production app builds from `site/`; the retired Astro project's Git trigger is disconnected. All 39 tests, lint, TypeScript and the 24-route build passed locally; GitHub CI and Vercel Preview passed before merge. Seventeen representative production routes returned 200 after release.

The live updated form returned an explicit saved/pending receipt, displayed the private submission directly below it, and allowed posting again. Diagnostic posts were deleted and their absence verified in the database. A rolled-back pin regression exposed only approved comments, with pins first; anonymous/authenticated visitors cannot insert or update the pin flag. The existing genuine pending message was left unchanged for owner moderation.

The CMS output previously verified 21 tools and four projects without Draft starters or instructional notes. Mobile lab measurements and 320px/390px overflow checks are recorded in MOBILE-PERFORMANCE-AUDIT.md; these are measurements, not a guarantee for every device/network. Real owner writing, shelves, friends and a resume PDF remain content tasks.
