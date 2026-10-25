# Portfolio repository guide

The original Astro portfolio is preserved at the repository root, including its source, content, assets, documentation, lockfile and legacy workflow.

The new website at **https://knowprasad.me/** lives in **[site/](site/)**. Its owner-approved content is managed through the scoped Notion CMS. Vercel must use `site` as this project's Root Directory.

- **[Owner handbook](site/docs/OWNER-HANDBOOK.md)** — how to manage every section, photos, résumé, messages and routine updates.
- **[Developer operations](site/docs/OPERATIONS.md)** — setup, environment variables, deployments, recovery and security boundaries.
- **[Delivery checklist](site/references/HANDOVER-CHECKLIST.md)** — verified features, checks and owner content still needed.

For the new website, open a terminal in `site/`, then use `npm ci`, `npm run dev` and `npm run check`. The commands at the repository root belong to the preserved legacy application.

Do not delete or overwrite the legacy root files when maintaining the new site. New-runtime files and dependencies belong inside `site/`. Secrets and disposable local evidence are excluded from Git.
