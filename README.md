# Portfolio — dimasadimo.com

Personal portfolio site. **Next.js 16 (App Router) + React 19 + Tailwind CSS v4**, deployed on Vercel.

## Setup

Requires **Node 20.19+ or 22.12+** — Node 21 is EOL and will not build.

```bash
nvm use          # Node 22 (see .nvmrc)
npm ci
npm run dev      # http://localhost:3000/en
```

## Commands

| Command                 | What it does                                                |
| ----------------------- | ----------------------------------------------------------- |
| `npm run dev`           | Dev server on :3000                                         |
| `npm run build`         | Production build into `dist/`                               |
| `npm run preview`       | Serve the built output                                      |
| `npm run lint`          | ESLint — must be 0 errors, 0 warnings                       |
| `npm run typecheck`     | `tsc --noEmit` under `strict`                               |
| `npm run test`          | Vitest                                                      |
| `npm run test:coverage` | Vitest with v8 coverage                                     |
| `npm run format`        | Prettier                                                    |
| `npm run knip`          | Report unused files, exports and dependencies               |
| `npm run verify`        | lint + typecheck + test + build — **run before committing** |

## Conventions

This repo follows `~/Work/CONVENTIONS.md`. See [CLAUDE.md](CLAUDE.md) for which sections
apply here, which deliberately do not, and the project-specific decisions.

Commits follow [Conventional Commits](https://www.conventionalcommits.org/)
(`feat:`, `fix:`, `chore:` …) — enforced by commitlint on `commit-msg`.
`lint-staged` runs ESLint and Prettier on staged files at `pre-commit`.

## Layout

```
src/
├── app/[locale]/        # routes: layout, page, error, not-found
├── app/globals.css      # Tailwind v4 @theme tokens
├── components/          # kebab-case, one component per file
├── hooks/               # use-*.ts
├── i18n/                # routing, navigation, request config
├── lib/                 # pure utils
├── messages/            # en.json / id.json — add every key to both
├── proxy.ts             # locale middleware
└── test/
```

## i18n

Two locales: `en` (default) and `id`, served at `/en` and `/id`. Every user-facing string
lives in `src/messages/*.json` — **add new keys to both files in the same change.**

Rich text uses next-intl tag syntax — `<role></role>`, not `{role}`.
