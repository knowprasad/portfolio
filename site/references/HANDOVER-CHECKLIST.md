# Portfolio handover checklist

Owner: Shubham Prasad · Domain: https://knowprasad.me/ · Updated 26 October 2026.

This checklist distinguishes shipped functionality from personal content the owner still needs to choose. The owner handbook and operations guide are the primary maintenance documentation.

## Implemented

- Next.js rebuild; old Astro source removed with owner approval, recoverable in Git history; new runtime isolated in site/; no paid infrastructure upgrade.
- Hero with anime-to-real-photo reveal, nudge, sound opt-in and automatic GitHub photo fallback; optional Notion Photo override.
- Larger readable headings, subtle dark/light contrast, paired dashed separators, keyboard focus and reduced-motion handling.
- Sticky section navigation, scroll progress and searchable dock.
- Tech stack icons with tooltips; project cards, previews, quick-view dialogs and archive/detail pages.
- Work dropdowns below projects/tools; Highlights with achievements and Show all/less.
- LeetCode/Codeforces/CodeChef views plus combined accepted-solve streak/activity.
- Green GitHub contribution calendar/skyline, organization/individual icon groups and merged/open/closed/reviewed PR filters.
- Writing archive/detail renderer, contents, reading controls, search indexing and moderated article discussion structure.
- Off the Clock collage and separate books, articles/papers, watchlist, channels and places pages.
- Arman-style Leave a message layout; Google login, private pending receipts next to the form, author deletion, sign-out and owner-managed pinned approved comments.
- Hero booking link to Cal.com; generic Email/Copy contact links; social previews; friends/footer structure.
- Approximate private-hash visitor counter, public count read and restricted server write function.
- Canonical metadata, social cards, structured data, sitemap, robots and machine-readable reading index.
- Owner handbook, operations guide, security review, performance audit and source CI workflow.

## Connected and verified

- Domain apex and www verified by Vercel; valid public HTTPS; www redirects to apex preserving paths.
- Google provider enabled in portfolio Supabase project; canonical origin and callback URLs saved.
- Real production sign-in, pending test submission privacy, own deletion and sign-out verified. Test message removed; no fake public comments added.
- Google OAuth audience changed from Testing to In production after adding real homepage/privacy links; no Gmail/Drive scopes added.
- Read-only Portfolio CMS connection scoped to its root/children; all eight runtime sources readable.
- Owner approved 35 existing content records: 1 profile, 4 projects, 9 work/highlight records and 21 tools. These are Published; book/article/watchlist/place/friend starters stay Draft.
- Archived-to-Published lifecycle verified using an existing tool record before live publishing activation.
- NOTION_TOKEN stored only in ignored local server environment and the portfolio's Vercel server environments.
- GitHub main commit 9dded1f42d5e2a1b8f1d6ad8a28fee197359784c automatically deployed to production as dpl_8DpDq6oLHiFzKC9vzfxQapT5qAK8. Canonical guestbook receipt and private pending visibility were rechecked after release; diagnostic messages were removed.

## Quality evidence

- ESLint, TypeScript, 39 tests and production build passed after the auth callback repair and CMS preparation.
- npm dependency audit: zero known vulnerabilities at the latest successful check.
- Mobile performance audit: Slow 4G, 4× CPU, 390×844; post-fix median LCP 2.1s, CLS 0.00 across three cold loads. These are lab measurements, not a field guarantee.
- 320px/390px checks found no horizontal page overflow; footer items have a verified 20px gap. Header/controls and complete flow checks are part of the final release pass.
- Security checks cover scoped content reads, publication filtering, input validation, safe redirects, RLS ownership/moderation and secret exclusions. No claim of absolute bug-free or penetration-test certification.

## Owner content still needed

| Item | How to supply it |
| --- | --- |
| Résumé PDF | Profile → Resume PDF, RESUME_URL, or public/resume.pdf |
| Friends | Chosen Name/Website records in Friends |
| Books and recommendations | Personal Library entries with Shelf/Format/Progress |
| Watchlist and channels | Personal Library entries; only your real choices |
| Travel places | Places → Visited or Want to go |
| Original writing | Full Writing record body, metadata and publication choice |

No extra webring, separate Achievements page, fake comments, invented reading list or automatic Medium publishing was added. These were explicitly excluded or depend on owner choices.

## Owner update: automatic comments

New signed-in guestbook and article comments publish immediately. Posting and author deletion invalidate the shared message cache immediately; owner hiding/pinning remains available in Supabase. The earlier pending-message tests above describe the former moderation mode.

## Homepage inspection update

The homepage now uses a compact three-platform coding summary linking to /activity. Detailed platform tabs, accepted-solution streaks and contest histories remain on that route. Open source shows three real merged PRs across repositories before the GitHub calendar; filters and expansion remain available. Project pages share five inspection sections, retain existing content, and clearly identify missing ownership/design notes. Added grouping/selection regressions bring the suite to 43 tests. Responsive checks verified 320px Activity and 390px project-page layouts without horizontal page overflow.
