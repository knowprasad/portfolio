# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Project commands

Use Node `22.12.0` (the version is pinned in `.nvmrc`) and install the locked dependencies:

```sh
npm ci
npm run dev
npm run build
npm test
```

The background development-server workflow is documented in `CLAUDE.md`:

```sh
astro dev --background
astro dev status
astro dev logs
astro dev stop
```

## Notion content sync

The blog sync reads published pages from Notion and writes generated MDX files to `src/content/blog/`:

```sh
npm run fetch-content
```

Set `NOTION_TOKEN` and `NOTION_DATABASE_ID` first. Optional `NOTION_PROP_*` variables in `.env.example` override the expected Notion property names. The Notion database must be shared with the integration. Never commit or print the token.

The scheduled GitHub Action requires repository secrets with the same two names. It can also be run manually from the Actions tab after the secrets and database access are configured.

`npm test` is the offline regression check and runs the production build. The equivalent repository command is `make test`. There is no dedicated lint or typecheck script yet.

## Container

Build and run the pinned production image locally:

```sh
docker build -t portfolio:local .
docker run --rm -p 4321:4321 portfolio:local
```

The same commands are available as `make docker-build` and `make docker-run`.

## Deploy

For Vercel, connect the repository to a Vercel project and deploy the `main` branch, or authenticate the Vercel CLI and run:

```sh
npx vercel --prod
```

Set the Notion secrets in GitHub Actions separately from any Vercel environment variables. The deploy account, domain, and DNS configuration are intentionally not stored in this repository.
