# Portfolio agent instructions

The approved rebuild uses Next.js App Router, React, TypeScript and npm. Read PRODUCT.md and prd.md for product decisions. The old Astro app was deliberately removed.

- Keep public content server-rendered; isolate interactive client components.
- Read CLAUDE.md for background-server operation. Commands live in package.json.
- Runtime source belongs in src/. Research and disposable previews stay under references/, outside production bundles.
- Query the existing Graphify graph for focused architecture questions; rebuild against src/ after source changes. Exclude raw reference captures.
- Never invent personal achievements, posts, ratings or activity. Distinguish unavailable data from zero; dated verified public snapshots may be used during failures.
- Keep server tokens out of browser bundles and logs. Notion must publish only approved entries once connected.
- Preserve unrelated edits. No commits or pushes unless requested. Day-one Vercel deployment and free-tier services are authorized; ask before paid upgrades.
- Run meaningful tests, typecheck, lint and production build for application changes. Inspect the diff and verify relevant browser flows before handoff.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
