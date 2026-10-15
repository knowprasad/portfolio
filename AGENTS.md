# Repository agent instructions

## Project

- This is an Astro 5 portfolio site using TypeScript, content collections, and npm.
- Read `CLAUDE.md` before changing project conventions; keep its background-dev-server rule.
- Keep generated blog content under `src/content/blog/` compatible with the collection schema in `src/content/config.ts`.

## Commands

- Install: `npm ci`
- Build: `npm run build`
- Test: `npm test`
- Dev server: `astro dev --background`
- Manage the background server: `astro dev status`, `astro dev logs`, `astro dev stop`
- Notion sync: `npm run fetch-content`

There is no dedicated lint or typecheck script. `npm test` runs the production build as the offline regression check; report any missing external credentials or services separately.

## Content sync

- The Notion sync needs `NOTION_TOKEN` and `NOTION_DATABASE_ID`; use `.env.example` as the variable reference.
- Never print or commit token values. The Notion database must be shared with the integration.
- Preserve the existing Notion property override variables and generated-file format when changing the sync.

## Change safety

- Make focused edits and preserve unrelated working-tree changes.
- Do not commit, push, or alter deployment/account settings unless explicitly requested.
- Before finishing, inspect `git diff` and run the smallest meaningful project check.
