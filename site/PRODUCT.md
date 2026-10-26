# Portfolio product decisions

Current owner decisions · 25 October 2026. Supersedes historical alternatives in references/.

- Personal portfolio for fresher/internship opportunities. Show verified projects, skills, campus roles, highlights, writing and public activity. Never borrow another person’s achievements or invent personal content.
- Next.js App Router, React, TypeScript and Tailwind; keep public content server-rendered and interactive components small. No paid services/upgrades.
- Section order: hero, tech stack/tools, projects, work/experience, highlights, problem solving, open source, writing, off the clock, leave a message, friends/footer.
- Xevrion structure and Geist/Paper Mono type, black/white circular theme reveal, searchable dock and footer. Arman’s compact filled tools, work disclosures, booking expansion, avatar nudge/reveal and opt-in sound. Readable section headings, paired dashed separators and subtle neutral contrast; no pointer ring or section glow.
- Off the Clock follows Xevrion’s asymmetric collage. Own books, articles/papers, watchlist (movies/series/anime/videos), channels and places. Places separates Visited and Want to go. Do not invent recommendations.
- Leave a message follows Arman’s centered Google sign-in panel and avatar/comment bubbles. Preview three approved messages and link to the complete guestbook. No fake comments.
- Achievements belong inside Highlights, not a separate section or page. Show all/less on the homepage. Projects and writing have archive/detail pages.
- GitHub activity stays green in both themes. Group contribution owners by organizations/individuals, with icon links and more/less. Merged/open/closed/peer-reviewed filters use actual public activity.
- All/LeetCode/Codeforces/CodeChef views; LeetCode knowprasad, Codeforces/CodeChef prsdx. Streaks require accepted solutions on consecutive days in Asia/Kolkata. Label partial history and stale snapshots.
- Hero Book a call expands on hover/focus and links to cal.com/knowprasad. Footer has friends, navigation and generic Email/Copy labels. The owner will supply friends later; no custom webring is needed.
- Original anime avatar/favicon, click to reveal the owner’s photo. Sound defaults off, remembers choice, and plays only after explicit opt-in. Keyboard and reduced motion are required.
- Notion Portfolio CMS is the editor for routine content. Exactly eight scoped data sources; Draft/Published/Archived, ordering and featured flags. Public routes/search may read only Published records. Five-minute request-driven caches, not instant scheduled publishing.
- Writing supports full safe article bodies, contents, reading time, copy/share and moderated comments. Notion and Medium are separate publishing destinations; canonical links support manual cross-posting, not automatic Medium publishing.
- Supabase handles Google auth, immediately published public messages/comments with owner removal/pinning and an approximate hashed-browser visitor count. Enforce row-level authorization and posting limits; private email and pending messages stay private.
- Real résumé PDF only: Notion Profile > Resume PDF, RESUME_URL, or public/resume.pdf. No document was supplied yet.
- SEO: server HTML, canonical URLs, truthful JSON-LD, social previews, sitemap/robots and optional llms.txt. No promise of ranking in search/chat apps.
- Deploy through the existing authorized Vercel Hobby account after checks; no commit/push unless explicitly requested. Account-blocked integrations must be labeled honestly.

See references/IMPLEMENTATION-AUDIT.md for actual delivery/verification status and the private Notion owner guide for editing instructions.

## Inspection-focused content structure

- Homepage problem solving shows combined platform solves, rated contests and known best streak with an Explore activity link to /activity; the complete All/LeetCode/Codeforces/CodeChef dashboard lives on that route.
- Open source begins with a few actual merged upstream PRs across repositories, followed by full filters, contribution context and the calendar.
- Every project detail page keeps its explicit status and preview, with public repository README content as the primary documentation. Published Notion body content provides optional ownership, architecture and limitation notes. Empty ownership/architecture sections are omitted when README content is available; missing repository documentation keeps the curated fallback page usable. Source reads are public, credential-free and cached for 15 minutes.
