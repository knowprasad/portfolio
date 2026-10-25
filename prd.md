# Shubham's portfolio — PRD

Planning history. Current implementation decisions are in PRODUCT.md; owner instructions are in docs/OWNER-HANDBOOK.md and docs/OPERATIONS.md.

Version 0.2 · 24 October 2026. Supersedes the initial interview draft. This cleanup records decisions; it does not scaffold the application or configure service accounts.

## Outcome and design

Build an original, readable portfolio using Xevrion's structure and dock, Arnesh's typography clarity, Arman's stack/tools presentation and Mohit's competitive-programming section. Prioritize internship/fresher job visitors and verified evidence of work. No Ansh-specific additions.

Review three closely related homepage treatments before full visual implementation. Use restrained animation, dark/light themes, self-hosted licensed fonts and accessible visible navigation. Keep projects, stack/tools, competitive programming and writing prominent; publish work history only where genuine.

## Public structure

Homepage: introduction/contact, selected projects, stack/tools, competitive programming, genuine work, highlights, open source, recent writing, off-the-clock previews, contributions, guestbook and friends. Hide empty homepage sections rather than fabricate content.

Destinations: project index/details where justified; writing index/articles; weekly journal/archive; art/photos, games and travel; guestbook; resume and booking access. Keep meaningful collection empty states. Only show working resume downloads and booking destinations.

The shared dock supports closed, search and compose states, keyboard/touch operation, slash and Ctrl/Cmd+K shortcuts, arrows, Escape and focus restoration. Search uses local fuzzy matching and predefined intents, not a paid AI chatbot. Add theme, resume, time, booking and supported content/activity commands. Contact starts with a real email link, then Formspree when configured; never simulate delivery.

Copy/share, article headings/TOC, rich reading content, related writing and derived reading time belong in the reading experience. Add persistent likes/comments in their integration phase. Defer article fun mode, sound, Konami/death effects and a separate interaction lab. A webring requires genuine membership and endpoints.

The 67-item discovery catalog is preserved at references/xevrion/FEATURE-CATALOG.md. It describes the reference, not automatic approval of every optional experiment. See references/REA-REVIEW.md for comparative evidence.

## Content and data

- Dedicated Notion Portfolio Content hub: profile, projects, experience, highlights, stack, writing/weekly, collections and friends. Do not repurpose existing personal notes or the old blog database.
- Stable source IDs, slugs, ordering, featured flags and Draft/Published status. Only Published entries enter public pages or search.
- Target five-minute request-triggered cached refresh; this is not a scheduled exact-time guarantee. Retain successful content during failures and refresh expiring Notion asset URLs.
- Render supported text, headings, lists, images, code, tables, quotes and callouts. Treat unsupported blocks explicitly and safely.
- Draft initial factual content from verified public work for owner review. No fabricated results, credentials or dates.
- Cache GitHub and competitive-programming data approximately hourly. Show source and freshness; distinguish missing/stale data from zero. LeetCode: knowprasad, automatic adapter with dated Notion backup. Codeforces: prsdx provisionally, verify before publication. Do not assume an official LeetCode API contract.
- Booking, music and cached weather are phased enhancements with honest unavailable states and valid link fallbacks where possible.

## Architecture and visitor features

Next.js App Router, React, TypeScript and Tailwind on Vercel. Keep public content rendering separate from interactive client components, server-only source adapters and authenticated writes. Select exact maintained package versions during scaffolding and commit the lockfile when commits are authorized.

Supabase supplies GitHub/Google sign-in, guestbook, comments and likes. Public entries require owner approval; authors can delete their own submissions; allow one like per visitor/article. Use server-verified identity, row-level security, validated input, escaped rendering and rate limits. Never place auth-dependent responses in a shared public cache. Moderate in the provider dashboard; no custom admin editor.

## Delivery and acceptance

1. Update requirements and review visual alternatives before full implementation.
2. Deploy the responsive foundation on day one once access/content are ready, using a free Vercel subdomain. Include navigation, verified introductory content, project structure and working direct contact.
3. Connect Notion, approved content and complete route structure.
4. Add dock/search and cached public activity adapters.
5. Add auth, moderated interactions, Formspree delivery, booking/music and remaining utility integrations. Review deployment previews before production updates.

Check production build, mobile/desktop layout, real links, metadata, keyboard/focus, contrast and reduced motion. Exercise long articles, draft exclusion, publishing refresh, upstream failure and expired media handling. Before enabling writes, verify authorization, moderation, deletion ownership, duplicate likes and failed submissions. Keep test tooling proportional to actual behavior; do not claim commands exist before scaffolding.

## Constraints and remaining inputs

Zero-recurring-cost target, free tiers and no automatic paid upgrades. Custom domain optional. Supabase free inactivity pauses must not break core portfolio reading. Reassess provider terms if use becomes commercial. Account credentials remain outside chat, Git and browser bundles.

Remaining owner inputs: selected visual treatment, approved identity/project text/assets, public contact address, resume, verified profile links and integration accounts when needed. These do not reopen settled framework/content/dock choices.

Apply the workflow reviewed in references/planning-sources/REVIEW.md: PRD first, challenge assumptions, review design alternatives, use small working layers and minimal maintained dependencies. Historical research records may describe decisions as pending at the time; this PRD records the current choices.
