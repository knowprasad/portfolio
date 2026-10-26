# Portfolio operations and developer handover

For maintenance of https://knowprasad.me/. Read OWNER-HANDBOOK.md for ordinary content updates. This document covers code, deployment, credentials, failure recovery and the limits of the implementation.

## Architecture

The application is Next.js App Router with React, TypeScript, Tailwind and npm. Node 24 is the supported runtime. Public pages use server rendering/static regeneration; small client components implement dialogs, filters, calendars, tooltips, theme, sound and the profile reveal.

Notion is a read-only content source at runtime. Eight fixed data-source IDs live in `src/data/notion-sources.json`. The application queries Published records only, and the body adapter validates a Published parent before reading article/project blocks. There is no public workspace-wide Notion search endpoint.

Supabase provides Google authentication, a moderated message table and the approximate visitor counter. The app uses its publishable key on the server, not a service-role key. Google client credentials remain in Supabase's Google provider. Owner moderation uses the Supabase dashboard.

Vercel hosts the website. The `prsdxportfolio` project must use `site` as its Root Directory; the old Astro source was removed with owner approval. Namecheap remains the domain registrar/DNS provider; the registration was not transferred. `www.knowprasad.me` redirects permanently to `knowprasad.me` while preserving the path. No separate paid application server is required for this design.

All application paths below are relative to `site/`, unless explicitly described as repository-root paths. The old Astro portfolio was removed with owner approval and remains recoverable in Git history.

## Source map

| Path | Responsibility |
| --- | --- |
| `src/app/page.tsx` | Homepage composition and section ordering |
| `src/app/layout.tsx`, `globals.css` | Shared shell, fonts, tokens, responsive styles |
| `src/app/projects/` | Project archive and detail routes |
| `src/app/writing/` | Writing archive, article pages and discussions |
| `src/app/[section]/` | Books, articles/papers, watchlist, channels and places |
| `src/app/guestbook/` | Sign-in, posting, sign-out and own-message actions |
| `src/app/auth/callback/` | PKCE code exchange and canonical/local return |
| `src/app/api/search/` | Public content search index |
| `src/app/api/visitors/` | Read/count endpoints |
| `src/components/` | UI components and interactions |
| `src/lib/notion-server.ts`, `content-model.ts` | Scoped Notion reads, caching, validation and safe blocks |
| `src/lib/portfolio-content.ts` | CMS-to-portfolio mapping and verified fallbacks |
| `src/lib/activity-server.ts`, `activity*.ts` | Provider reads, validation, calculations and source labels |
| `src/lib/github-profile*.ts` | Actual public GitHub profile metadata |
| `src/lib/auth-config.ts`, `supabase-server.ts` | Auth configuration and server cookie client |
| `src/lib/security.ts`, `src/proxy.ts` | Browser policy, headers and private auth-page handling |
| `src/data/site.ts` | Verified fallback profile/projects and hard-coded handles |
| `src/data/*snapshot.json` | Dated public provider fallbacks, not invented live responses |
| `public/` | Static images, original marks, fonts and licensed icons |
| `supabase/migrations/` | Reviewed database migrations |
| `docs/` | Client and maintenance handover |
| `references/` | Local research/raw captures; excluded from deployed bundles |
| `test-results/` | Ignored disposable test evidence, never production source |

The old Astro application and scheduled Notion-fetch workflow were removed with owner approval. The Next.js runtime and its dependencies are isolated under `site/`. The new CI workflow at `.github/workflows/portfolio-ci.yml` runs with `site` as its working directory.

## Local setup

1. Clone `https://github.com/knowprasad/portfolio.git` once the rebuild has been synchronized there.
2. Change into the new app directory with `cd portfolio/site` (or `cd site` if already at the repository root). Use Node 24 (`site/.nvmrc` and package engines declare it).
3. Run `npm ci` using the committed lockfile.
4. Copy `.env.example` to `.env.local` and configure only the features you need.
5. Start `npm run dev`; the URL is `http://127.0.0.1:3001`.

On this Windows workspace, development servers run in a hidden background process with logs/PID under ignored `test-results/`. Check for the existing server before starting a second one. CLAUDE.md explains the rule. Stop only this project's process, not arbitrary Node processes.

Use one local hostname consistently during a sign-in flow. `127.0.0.1` and `localhost` have separate cookies. The callback now preserves the incoming allowed local host. Production returns to the configured SITE_URL instead of trusting forwarded host values.

Without a Notion token, verified local project/profile/tool defaults are used. With a working token, an empty Published project/work/tool/library collection stays empty. The site keeps its permanent verified identity when no Published Profile override exists; archiving Profile clears its custom overrides, not the owner brand or domain. This behavior prevents private drafts from silently turning into public fallback content. Do not enable a fresh CMS before reviewing and publishing its intended initial records.

## Environment variables

Set variables in Vercel project Settings → Environment Variables. Production/Preview are separate deployment environments, even when one variable entry covers both. Changing a variable does not rewrite an already-built deployment; redeploy after configuration changes.

| Variable | Purpose | Exposure/notes |
| --- | --- | --- |
| `SITE_URL` | Canonical origin and safe production auth return | `https://knowprasad.me`; not a secret |
| `NOTION_TOKEN` | Read-only CMS access | Secret, server only; share only Portfolio CMS with this connection |
| `GITHUB_TOKEN` | Optional higher public API rate limit | Secret, server only; use minimum suitable read access |
| `SUPABASE_URL` | Portfolio Supabase API URL | Configuration; use the portfolio project |
| `SUPABASE_PUBLISHABLE_KEY` | RLS-controlled public reads/auth | Stored server-side here; never substitute a service-role key |
| `GOOGLE_AUTH_ENABLED` | Whether the app offers Google login | Enable after callback/provider checks; app disables login in Vercel Preview deployments |
| `VISITOR_WRITE_KEY` | Authorizes count writes to the database RPC | Secret, server only; must match database-side configuration |
| `VISITOR_COUNT_ENABLED` | Enables real count writes | true in Production; false locally and in Preview |
| `RESUME_URL` | Optional résumé URL fallback | Public HTTPS PDF; CMS Resume PDF takes precedence |
| `NEXT_PUBLIC_FORMSPREE_ID` | Optional Formspree form identifier | Public; omitted means the contact dock uses a mail draft |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional contact destination override | Public if used; not an email secrecy mechanism |
| `NOTION_DATABASE_ID` | Legacy reference only | New adapter uses the fixed data-source map, not this old Astro variable |

Never paste secret values into this document, commits, comments, test artifacts, screenshots, URL query strings or NEXT_PUBLIC variables. `.env.local`, deployment metadata and raw test results are ignored. `.env.example` contains names and blank/example-safe values only.

## Code-change workflow

1. Fetch the repository and start from the current source branch.
2. Create a focused branch, normally `codex/short-description` for agent work.
3. Keep runtime changes in `site/src/`; put disposable experiments outside the production source.
4. Make the smallest change that addresses the requirement. Preserve the existing visual identity unless a redesign is requested.
5. Run the checks below and inspect the diff, including new files.
6. Push the branch and inspect a Vercel Preview when Git deployment is connected.
7. Review behavior on mobile and desktop before merging into the configured production branch.
8. Verify the production deployment rather than assuming a successful push means a successful release.

Do not force-push the production branch as a routine update. Do not commit account credentials to make a deploy work. A Git commit backs up source, not content stored in Notion or database rows.

## Required checks

```text
npm run lint
npm run typecheck
npm test
npm run build
npm run security:audit
```

`npm run check` combines lint, TypeScript, tests and production build. Dependency auditing requires access to the npm registry. A registry/network failure is not a clean audit; report/retry it separately. Tests validate parsing, content publication, security boundaries, SEO, auth return origins and input rules. They do not replace an actual OAuth/browser flow.

Production builds explicitly use webpack because of the observed Windows Turbopack issue. Do not change the build engine incidentally while fixing unrelated UI. Consult the installed Next.js documentation before altering caching, routing, cookies or server actions.

## Deployment

Project name: `prsdxportfolio`. Public primary URL: https://knowprasad.me/. The former assigned alias `prsdxportfolio-mauve.vercel.app` may remain a secondary access URL, but canonical/auth traffic uses the custom domain.

There are two valid deployment methods:

**Vercel CLI:** from the repository root, link to `prsdxportfolio`, verify that its Vercel Root Directory is `site`, authenticate with the owner account and run `npx vercel --prod`. The CLI uploads local source directly, then Vercel installs/builds it. This does not require a Git push and does not automatically synchronize GitHub. It explains how the first live versions were deployed while the repository still held the old source.

**Git integration:** once the Vercel project is connected to `knowprasad/portfolio`, pushes to the configured production branch create production builds; other branches/PRs normally create previews. Check the final handover checklist for whether that connection has actually been verified. Never connect the project to an old branch and assume its source matches a locally uploaded deployment.

For a failed deploy, inspect Vercel Build Logs, confirm Node 24/framework Next.js/root directory/build command, check the required variable names, and run the same checks locally. Do not expose secret values while collecting logs.

## Preview behavior

Preview deployments use the same Published content if configured, but do not accept routine Google sign-in and do not increment the production visitor count. This prevents a preview-host cookie/production-callback mismatch and avoids inflating the counter during review. Test the complete Google flow on the canonical production domain or an explicitly configured local host.

Vercel Deployment Protection can restrict preview URLs. Use the owner's authorized Vercel access; do not disable authentication or TLS verification to make automated tests pass.

## Google sign-in configuration and verification

Supabase project: `hhbuhqevmskpuvybiwii`. Google Cloud project: `reference-lens-512706-t9` (Shubham Portfolio). OAuth client: Portfolio web sign-in.

The Google client's redirect URI is exactly:

```text
https://hhbuhqevmskpuvybiwii.supabase.co/auth/v1/callback
```

The Google authorized JavaScript origin is the actual website origin, `https://knowprasad.me`. Supabase's Site URL is also this origin. Its redirect allow-list includes the portfolio `/auth/callback` path and the narrow callback-prefix variants for article query parameters and local development. Do not add unrestricted wildcard domains for all Vercel tenants.

To investigate login: confirm GOOGLE_AUTH_ENABLED, provider enabled status, Google audience/public availability, correct Google callback, Supabase Site/redirect URLs, and canonical host. A stale tab may still contain the old disabled button after a deployment; reload the actual public page. Test signed-in form visibility, pending submission privacy, own-message deletion and sign-out. Use a disposable private pending test message and remove it afterward; do not populate the public guestbook with fake comments.

Only identity/email/profile is requested. Changes involving Gmail, Drive, new credential grants or broader scopes are separate security-sensitive changes. If Google requires MFA or a manual account action, the account owner completes it. Do not bypass Google/browser security screens.

## Notion operations

The runtime connection is named **Portfolio publishing (read-only)**. Its content capability is Read only; update/insert/comments/user-info/agent access are disabled. It is shared with the Portfolio CMS root and inherited child databases, not the wider private workspace. The adapter still queries only the eight fixed configured sources.

For a permission error, verify the token belongs to this connection and the CMS is shared with it. For a renamed/replaced database, update the correct source mapping rather than searching the whole workspace from a public request. A new integration/token may need to be shared again. Do not print tokens when troubleshooting.

For an urgent content fix, first change the record's Publish state, then invalidate/redeploy if cached content must disappear immediately. Redeploying old code does not revert Notion records. Back up/export Notion separately.

## Supabase and message moderation

The database schema is recorded under `supabase/migrations/`. Review changes before applying them to the actual portfolio project. RLS must remain enabled. The authenticated role may submit only its own pending messages and delete its own rows; it cannot self-approve or impersonate another author. Anonymous reads expose approved public fields only.

Never use editable `user_metadata` as an authorization role. Public display names are presentation, not permissions. The app verifies the server-side user identity before writes. The posting limit is enforced using a private per-account timestamp ledger that is independent of deletable message rows. Deleting a message does not reset the three-post rolling ten-minute quota.

The visitor counter's public functions are intentionally narrow. One returns only a number; the write function requires the private server key. Private count tables are not public query tables. Do not grant table access or remove RLS merely to silence an advisor notice. Review intentional SECURITY DEFINER/function permissions in context.

Rotating VISITOR_WRITE_KEY requires updating both the protected database configuration and the Vercel server variable. Changing only one breaks writes. Request developer help for this operation. Google client secrets are rotated in Google Cloud/Supabase, not in browser code or the repository.

Merix was paused with owner approval to free the free Supabase project slot. Pulse is a separate application. Changing portfolio infrastructure must not silently restart, pause or delete another application's backend.

## Security and external data boundaries

React escapes text. The Notion renderer supports a safe subset of native blocks and does not execute arbitrary HTML, embeds or synced private content. Public URLs and slugs are validated. Images use a small host allow-list matching CSP. GitHub profile reads use a fixed endpoint and validate that the returned account is `knowprasad`.

Auth pages use private/no-store responses, HTTP-only cookies and a nonce-based script policy. Public cached Next.js pages have a documented inline-bootstrap compatibility exception; see SECURITY.md. Do not treat this application review as a penetration-test certification or promise that no unknown vulnerability can exist.

## Assets, fonts and icons

Real-photo fallback: `public/avatar.png`. Anime identity asset: `public/site-avatar.webp`. Browser icon route: `src/app/icon.png` and the metadata in `src/app/layout.tsx`; Apple icon: `public/apple-touch-icon.png`. Social card: `public/og.png`. Project marks: `public/project-icons/`. Tool logos: `public/stack-icons/`. Interface symbols and license notices: `public/icons/`, `public/licenses/`.

Changing one avatar file does not automatically regenerate all favicon/Apple/social-card sizes. Update the full identity asset set intentionally and check browser caching. Preserve third-party license notices. Do not copy another person's profile photo, achievements or proprietary project branding into this owner's portfolio.

Fonts are self-hosted WOFF2. `font-display: optional` prevents a late font swap from moving the already-visible mobile page; a slow first load may keep a fallback font while later cached loads use the chosen typeface. Keep explicit image dimensions. Avoid adding heavyweight scripts merely for decorative previews.

## Performance verification

The mobile audit used official Chrome DevTools MCP in an isolated headless browser: 390×844, Slow 4G and 4× CPU slowdown. It recorded a post-fix median LCP of 2.1 seconds across three cold loads and CLS 0.00, compared with a pre-fix observed CLS of about 0.20. These are lab results, not a field-data guarantee or Lighthouse score; no INP score was established.

When testing a new release, use the same conditions and report multiple runs if network variability matters. Also inspect 320px layout, keyboard focus, reduced motion, both themes and the actual public production URL. Do not claim all devices are fast from one successful desktop load.

## Recovery and rollback

For a bad code release, use the previous verified deployment in Vercel and its rollback/promote controls. Confirm the live domain afterward. Then fix/revert the source commit so the next Git-triggered deployment does not reintroduce the bad code.

A code rollback does not restore database rows, Notion edits, credentials or DNS. Restore those from their corresponding service backups or history. Database schema rollback may require a reviewed forward repair migration rather than running destructive SQL.

For domain problems, inspect only the intended website records. The verified apex A records were `216.198.79.1` and `64.29.17.1`; `www` pointed to the apex and Vercel handled its redirect. Keep Namecheap nameservers, email MX/SPF and verification records unless a deliberate migration requires changes. Re-check Vercel's current domain-specific recommendations before any future DNS change; do not assume an IP is permanent.

## What is outside a source backup

Back up Notion content, original media/PDFs, moderation data and owner account recovery information separately. Store recovery codes/passwords in a password manager, not Git. Keep the Vercel variable names documented but their values in the secure service configuration. A clean checkout should install/build without private credentials using the verified fallback/empty states; it cannot reproduce live account configuration by itself.
