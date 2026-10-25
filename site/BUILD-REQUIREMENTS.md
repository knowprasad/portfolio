# Build requirements

Original planning record. Consult package.json and docs/OPERATIONS.md for the installed stack and current commands; docs/OWNER-HANDBOOK.md explains owner maintenance.

Current decisions · 24 October 2026. Target: zero recurring cost; deploy the foundation on day one once account access and reviewed public content are available.

## Stack and installation boundary

| Capability | Selection | When needed |
|---|---|---|
| Application | Next.js App Router, React, TypeScript, npm | Foundation |
| Styling | Tailwind CSS, self-hosted licensed fonts, CSS animation | Foundation |
| Accessible UI and icons | Radix primitives as needed; Phosphor icons | Relevant components only |
| Dock search | Fuse.js and predefined local commands | Dock phase |
| Content | Official Notion SDK; dedicated Portfolio Content hub | Content phase |
| Visitor auth/data | Supabase SDK and SSR helpers; GitHub/Google OAuth | Persistent features phase |
| Input validation | Zod | External content/write boundaries |
| Contact | Email link first; Formspree free tier | Delivery phase |
| Public activity | GitHub, Codeforces, best-effort LeetCode adapter | Public data phase |
| Booking/music/weather | Cal.com link/integration, Spotify if viable, Open-Meteo | Later integrations |
| Checks | Vitest and Playwright for meaningful behavior tests | As behavior is implemented |
| Navigation tooling | Installed Graphify | Index new source after it exists |

Install only what the current milestone needs. Inspect maintained versions and compatibility first. Avoid overlapping UI kits, state libraries, AI APIs and additional services without a concrete requirement. No new dependency or skill was installed during cleanup.

## Accounts and owner content

Initially: GitHub repository access, Vercel account, approved name/introduction/contact address and real project content. Review the visual treatment before the full build.

Content phase: Notion integration shared with the dedicated hub; verified property mapping, publish states and assets. Existing notes remain untouched. Routine content edits happen in Notion; layouts and new integrations require code changes.

Later: Supabase project and GitHub/Google OAuth applications with production redirects; moderation owner; Formspree account/recipient; calendar event URL; supported music credentials if used. Configure secrets in protected host settings and ignored local environment files. Never paste tokens into chat.

Confirmed handles: LeetCode knowprasad, Codeforces prsdx, CodeChef prsdx. All three public profiles are verified. Accepted-only combined streaks use available public submission history and disclose gaps. Public contact: prsdx.dev@gmail.com. Friends will be supplied later. Verify GitHub identity, resume, project outcomes, dates, image rights and public location precision. Missing facts stay unpublished. Do not copy reference achievements.

## Costs and limits

- Vercel Hobby and a vercel.app address for the personal portfolio. No custom domain purchase required. Hobby usage is subject to personal/non-commercial terms and usage limits.
- Supabase Free for visitor features; its free projects may pause after a week of inactivity. Core content must continue working without it.
- Formspree Free: 50 submissions/month; keep direct email available.
- Open-Meteo free non-commercial API, cached to limit requests. No paid weather API or AI-powered dock.
- Use existing Notion free capabilities and optimize images rather than adding paid media hosting. Do not assume unlimited storage or traffic.
- Request approval before any paid subscription, domain purchase, upgrade or service substitution that changes costs.

Official references checked during planning: https://vercel.com/docs/plans/hobby, https://supabase.com/pricing, https://help.formspree.io/articles/account-management/account-limits, https://open-meteo.com/en/pricing. Recheck terms when configuring services.

## Proof before each deployment

Production build, meaningful milestone tests, checked public links/metadata and a bounded desktop/mobile visual review. Verify draft exclusion and fallback behavior for content/data integrations. Test identity, permissions, moderation and error paths before enabling writes. Keep account-dependent failures separate from offline build results.

## Repository hygiene

Keep source, tests and configuration small and purposeful. Preserve references separately from runtime code. Exclude build output, local environment files, test artifacts and generated Graphify output from version control. Do not index large raw REA captures or minified reference bundles as application source. Never claim measured token savings before a real graph/query comparison exists.

Use the relevant installed skills per task, not every overlapping design skill at once. No global tool cleanup, hooks, account changes, commits or pushes are implied by repository cleanup.
