# Portfolio — dimasadimo.com

Personal portfolio site. **React 19 + Vite 6 + Tailwind CSS v4**, deployed as a static SPA.

## Setup

```bash
nvm use          # Node 22 (see .nvmrc)
npm ci
npm run dev      # http://localhost:3000
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
├── app.tsx              # root composition
├── main.tsx             # entry — mounts the root ErrorBoundary
├── components/          # kebab-case, one component per file
├── hooks/               # use-*.ts
├── lib/                 # pure utils, context definitions
├── messages/            # en.json / id.json — add every key to both
├── test/                # test setup
└── index.css            # Tailwind v4 @theme tokens
```

## i18n

Two locales: `en` (default) and `id`. Every user-facing string lives in
`src/messages/*.json` — **add new keys to both files in the same change.**
