# Security review

Review date: 26 October 2026. Skills: VibeSec-Skill, security-review, Supabase/Postgres guidance. This is a focused application/dependency review, not a penetration-test certification.

## Public reading and content

Public Next.js pages use server rendering/ISR. The read-only Notion adapter queries only eight configured portfolio data sources and defensively excludes Draft, Archived and trashed pages. The owner-approved read-only publishing connection is configured; 35 existing records were approved for publication. Instructional personal-shelf, place, friend and article starters remain Draft. Queries and article bodies use five-minute caches. API requests use a fixed api.notion.com destination, reject redirects, time out, and retry bounded rate-limit responses. Only published records may authorize body retrieval. Search contains public content only; it is not workspace search.

React escapes text. The article renderer supports selected native blocks and never renders arbitrary HTML, scripts, embeds, synced private blocks or child pages. Content links require public HTTPS URLs without credentials; slugs have a strict lowercase-dash grammar. Covers use a small image-host allowlist matching CSP. Unoptimized remote images load directly from approved hosts; no arbitrary server-side image proxy is exposed. JSON-LD escapes < and has regression coverage.

Activity requests have an explicit host allowlist and HTTPS/port/credential/redirect restrictions. Authorization is allowed only for api.github.com. Schema checks and dated verified snapshots distinguish unavailable data from zero. No private repositories are requested.

## Authentication and messages

Google OAuth credentials are stored only in this portfolio’s Supabase provider. Server application code uses a publishable key, not a service-role key. Auth uses PKCE and server-verified getUser identity; cookies are HTTP-only, SameSite Lax and Secure in production. Authenticated guestbook/callback pages are dynamic, private/no-store and receive a fresh nonce-based script policy. Google login is enabled for production after canonical return URLs and a real sign-in/sign-out flow were verified; Vercel previews keep login disabled.

Guestbook and article comments share one moderated table. Only approved name/text/date are readable anonymously. Authors can read/delete their own submissions; inserts must use their own verified identity and default to approved for immediate publication, as requested by the owner. They cannot change status or impersonate another author. Input limits are enforced both in code and database constraints. A per-user advisory lock and private timestamp ledger enforce at most three posts per rolling ten minutes, including posts the author subsequently deletes. The bounded private ledger has RLS and no client grants; its trigger is SECURITY DEFINER with an empty search path and an authenticated-author check, and is not a public RPC. Submitted article slugs are checked against an actually Published article with comments enabled.

Database regression checks ran inside a rolled-back transaction: impersonation rejected, visitor changes to status/pins rejected, rate limit enforced, own deletion works. No test users/comments were left behind. A real Google login, private pending submission, author deletion and sign-out were also verified against the production portfolio. The test submission was removed without publishing a fake public comment.

## Visitor counter

The browser receives only an approximate total. The database stores an HMAC of a random HTTP-only browser cookie and first-visit time; it does not store raw IP addresses. Server-only VISITOR_WRITE_KEY gates the counter RPC; private tables have RLS and no public table grants. Authenticated-role function grants inherited from Supabase defaults were revoked. The anon RPCs intentionally use SECURITY DEFINER with an empty search path: one returns only a count, the other requires the private write key. These intentional grants produce advisor warnings; private-table RLS-without-policies notices are expected because all table access is denied.

Count writes are disabled locally and in preview, enabled only for production. Different devices, cleared cookies and automated traffic can affect the number. It is not a guaranteed unique-human count or an abuse-proof analytics service. Foreign-origin writes are rejected; public count reads remain available. Supabase outages produce an unavailable state rather than invented totals.

## Browser and credential boundaries

CSP blocks frames, objects, base-tag injection and inline script attributes. Remote images are restricted to GitHub, Notion’s supported S3 hosts and Unsplash. Auth form destinations are fixed to the portfolio Supabase callback/Google. X-Frame-Options, nosniff, Permissions-Policy, Referrer-Policy and production HSTS are configured. Public cached Next.js pages still allow inline bootstrap scripts; this documented compatibility exception is weaker than a strict nonce CSP. unsafe-eval is development-only. Styles allow inline values for Next.js/Motion.

Ignored environment files and Vercel server-only secrets hold tokens. No NEXT_PUBLIC secret or browser service-role key is used. Secrets must never be printed, committed, added to Notion records, or placed in URLs. The owner explicitly approved transfer of the publishable key and visitor-write key to this portfolio’s Vercel project. Google client secrets are not copied to Vercel.

Email/Copy labels hide the address visually, but a functional mailto link remains discoverable. The private contact dock opens an email draft unless Formspree is configured; delivery is never simulated. Theme/sound preferences and contact drafts use browser storage. Avoid sensitive drafts on shared browsers. Cal.com is a fixed external link, with no embedded scheduling credentials.

## Verification limits

Run npm run check and npm run security:audit before releases. Current checks cover source behavior, validation, publishing filters, activity parsing and SEO. The review does not cover Git-history secrets, external service security, DDoS protection, account permissions, or a live production penetration test. Verify CDN headers, authenticated cache isolation and real OAuth flows after deployment. Report issues privately using the contact link.

## Comment pins

Only owner dashboard access can change the pinned flag or moderation status. Public reads include the pinned boolean only for approved messages under existing RLS. Anonymous and authenticated visitors have no INSERT or UPDATE privilege on pinned; pinning does not publish pending/rejected messages. A rolled-back database regression verified approved pinned-first ordering and exclusion of pending pins.

## Immediate publication

The owner selected automatic publication for new guestbook and article comments. The insert policy permits only the authenticated author and the approved default; visitors still cannot supply status/pinned values or update either field. An isolated transaction verified a default authenticated post is immediately readable anonymously, then rolled back all fixture data. User writes/deletes expire the tagged public comment cache to avoid stale lists. Owner dashboard actions can hide or pin comments without a prepublication queue.

## First-party profile image

The profile-photo route resolves only the owner's published CMS photo or fixed GitHub profile; it accepts no arbitrary URL parameter. The optional profile=github value selects the same fixed owner's public GitHub photo. Every redirect is checked against the existing image-host allowlist; embedded credentials/private addresses are rejected. Only raster MIME types are served, bodies are bounded to 1 MB, requests omit credentials and use timeouts. Errors return a generic uncached 502. Public successful bytes have a five-minute shared cache; no auth or Notion token is returned to the browser.
