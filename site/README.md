# Shubham Prasad’s portfolio

Next.js App Router, React, TypeScript and Tailwind. Reference decisions: PRODUCT.md. Delivery checklist: references/IMPLEMENTATION-AUDIT.md.

Live website: https://knowprasad.me/ · Source: https://github.com/knowprasad/portfolio

## Handover documentation

- [Owner handbook](docs/OWNER-HANDBOOK.md): step-by-step content management for every section, photos, résumé, moderation, backups and troubleshooting.
- [Operations](docs/OPERATIONS.md): development, environments, deployments, authentication, security boundaries and recovery.
- [Handover checklist](references/HANDOVER-CHECKLIST.md): verified delivery status and owner-supplied content still needed.

## Development

Run the following commands from `site/`, the new app directory. The old Astro application was removed with owner approval and remains recoverable in Git history.

Node 24; npm ci. Run npm run dev in a hidden background process on port 3001 (CLAUDE.md). Checks: npm run lint, npm run typecheck, npm test, npm run build. Production builds use webpack because of a Windows Turbopack issue. npm run security:audit checks known dependency advisories.

## Edit content in Notion

Private Portfolio CMS: https://app.notion.com/p/40442b1c345e815c9edbdf10ac50db93
Owner guide: https://app.notion.com/p/40442b1c345e81eb9bcdda4143b12000

Eight databases cover profile/résumé, work/highlights, projects, writing, personal library, places, friends and stack. Duplicate a starter, fill its properties and set Publish to Published. Draft and Archived entries are excluded from public pages and search. Source IDs are in src/data/notion-sources.json; the runtime token is a read-only connection shared only with this hub. Keep NOTION_TOKEN in the server environment, never in Git or NEXT_PUBLIC variables. The owner approved publishing the 35 existing profile/project/work/highlight/tool records; personal shelf/friend/place/article starters remain Draft.

Caching is request-driven, approximately five minutes. It is not an exact scheduler. Supported blocks: paragraphs, headings, lists, quotes, callouts, code, images, tables and toggles. Embeds, synced private blocks, child pages and arbitrary HTML/scripts are not followed. Stable HTTPS covers must use approved hosts: GitHub, Notion’s us-west-2 S3 file hosts, or images.unsplash.com. Unsupported images are omitted rather than proxied.

Missing configuration/source failures retain verified local project/profile defaults or honest empty collections. Successful empty Published collections are respected; the permanent owner identity is retained when no published Profile override exists. For first connection, review/publish existing seeded drafts before switching the token on, otherwise those sections intentionally become empty.

## Writing and search

Write your original article in a Writing record body, set a unique lowercase-dash Slug, Summary, Published date, Comments and Publish=Published. It appears at /writing/slug and in /writing. The dock searches published article text as well as projects and sections; / and Ctrl/Cmd+K open it. Linked reading recommendations belong in the Articles/Papers personal shelf, not Writing.

To cross-post on Medium, publish on your site first, then use Medium’s import/canonical controls. This project does not automatically publish to Medium. Discussion comments are stored in Supabase, separate from Notion.

## Public messages and moderation

Google OAuth credentials are stored only in the portfolio Supabase Google provider. Google login is enabled in Production after callback/origin configuration and a real login test; Preview remains disabled. Sessions use HTTP-only cookies; authenticated pages are private/no-store. Supabase project: hhbuhqevmskpuvybiwii.

Messages publish immediately after Google sign-in. In Supabase Table Editor > guestbook_messages, set status=rejected to hide an unwanted comment, or approved to restore it. article_slug=null means guestbook; a slug identifies its article discussion. Set pinned=true on an approved row to pin it above other messages; set it false to unpin. Public changes can take about a minute to refresh. Only approved messages are public; signed-in authors can see/delete their own submissions. Database rules prevent impersonation or visitor moderation changes, limit posting to three messages per ten minutes, and keep identity/email private.

Apply only reviewed migrations in supabase/migrations. The browser receives no service-role or visitor-write key. The approximate visitor counter stores HMAC browser identifiers, not IP addresses. VISITOR_COUNT_ENABLED stays false locally; production enabling requires the matching private VISITOR_WRITE_KEY. Cleared cookies/devices may count again.

## Résumé, friends and shelves

Add the real PDF URL to Notion Profile > Resume PDF, or set RESUME_URL, or add public/resume.pdf. Until supplied, /resume links to real projects/work/LinkedIn. Do not fabricate a PDF.

Add friends in Notion Friends with name and HTTPS website, optional avatar and note, Publish=Published. No webring is required. Books, articles/papers, watchlist and channels use Personal Library’s Shelf/Format fields; travel uses Places’ Visited/Want to go. Only share recommendations you choose to make public.

## Activity, icons and privacy

Public GitHub/LeetCode/Codeforces/CodeChef data refreshes automatically about hourly on requests. Upstream failures use dated verified snapshots or explicit unavailable states; accepted-only streak history is partial where the provider limits submissions. No private repository data is fetched.

The original anime avatar is used for navigation/favicon and reveals the real photo on click. The real photo follows the public GitHub avatar unless Profile > Photo overrides it. GitHub profile metadata has a five-minute server cache. Interface symbols use local free IconScout Unicons; tool logos use local Skill Icons; licenses remain in public/. Custom project marks are original. Sound defaults off. The contact dock opens a mail draft; optional Formspree needs its own configured form. Email/Copy labels hide the address visually, not cryptographically.

SECURITY.md records actual controls and limits. Public HTML includes canonical URLs, JSON-LD and social metadata; only substantive published pages enter the sitemap. llms.txt is an optional reading index, not a ranking guarantee. Research, retired prototypes, tests/artifacts and secrets are excluded from deployment. Do not commit/push without owner instruction.
