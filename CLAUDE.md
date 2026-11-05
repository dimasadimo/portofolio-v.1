# CLAUDE.md

## The standard

This repo follows **`~/Work/CONVENTIONS.md`** — the framework-agnostic frontend standard.

It does **not** follow `~/Work/Frontend Boilerplate Rules.md`. That document is the older
`cms-boilerplate` standard which CONVENTIONS.md §20 explicitly supersedes, and it is
Next.js-only (App Router, `proxy.ts`, server components, async `params`) — none of which
exists here. Where the two disagree, CONVENTIONS.md wins.

## What this project is

A **React 19 + Vite 6 + Tailwind v4 SPA** — a single-page personal portfolio.
Not Next.js. Apply the **"React + Vite"** column of CONVENTIONS.md §17.

## Project-specific decisions (CONVENTIONS.md §21)

| Decision           | Answer                                                                      |
| ------------------ | --------------------------------------------------------------------------- |
| Backend auth model | **None.** No login, no session, no API. §9 auth/permissions does not apply. |
| OpenAPI / codegen  | None. There is no backend.                                                  |
| Locales            | `en` (default) + `id`, in `src/messages/*.json`                             |
| Formatter          | **Prettier** (+ `prettier-plugin-tailwindcss`)                              |
| Monorepo           | No. Single app until a second one exists.                                   |
| Hosting            | Vercel (static SPA build)                                                   |
| Monitoring         | Vercel Analytics + Speed Insights                                           |

## Sections that do NOT apply here

Do not introduce this machinery into a static portfolio. Adding it would be a regression,
not compliance:

- **§6 Data fetching** — no HTTP client, no TanStack Query, no repositories, no query-key
  factory. There is no API. `axios` is in `package.json` but unused by `src/`.
- **§7 Forms** — no forms, so no React Hook Form, no Zod resolver.
- **§9 Auth & permissions** — no routes, no router, no guards, no sessions.
- **§12 Env validation** — `src/` reads no env vars, so there is no env module to
  validate. See `.env.example` for the rules when the first one is added.
- **§18 Feature checklist** — there are no CRUD features.
- **Feature-first folders (§3.1)** — 12 components do not need `features/<f>/{model,api,
application,ui}`. Promote to that layout only when a real business feature with its own
  data and routes appears.

## Structure in force now

```
src/
├── app.tsx              # root composition
├── main.tsx             # entry
├── components/          # kebab-case, one component per file (incl. error-boundary)
├── hooks/               # use-*.ts
├── lib/                 # pure utils + context definitions
├── test/                # test setup
├── messages/            # en.json / id.json
└── index.css            # Tailwind v4 @theme tokens
```

## Rules that ARE enforced here

- **Naming (§4)**: files and folders **kebab-case**, always. Components PascalCase, hooks
  `useX`, types PascalCase with no `I`/`T` prefix, booleans `is/has/can/should`.
- **Imports (§13)**: `@/*` → `src/*`. Use `@/` for anything outside the current folder.
  Import order is auto-sorted — never hand-order or add comment labels.
- **Types (§10)**: `strict` + `noUncheckedIndexedAccess` + `verbatimModuleSyntax`.
  No `any` (lint error). No `enum` (lint error) — use `as const` + derived union.
  No `as` casts on external data; validate instead (see `isLocale` in
  `src/lib/language-context.ts` for the pattern on a storage read).
- **Components (§5)**: named exports. Props typed in the same file. React 19 passes `ref`
  as a normal prop — no `forwardRef` in new code.
- **One way to do each thing (§1.6)**: one animation library (`motion/react` — never
  `framer-motion`), one icon set (`lucide-react`), one class helper (`cn()` from
  `@/lib/utils`), one dark-mode mechanism.
- **Dark mode (§8)**: `data-theme` on `<html>` via `next-themes`, tokens defined once in
  `src/index.css`. Never add a `prefers-color-scheme` block for a token `data-theme` sets.
- **i18n (§11)**: no hardcoded user-facing strings. Every new key goes into **both**
  `en.json` and `id.json` in the same change.
- **Logging (§11)**: `no-console` is a lint error.

## Commands

```bash
npm run dev        # vite dev server on :3000
npm run lint       # eslint (0 errors, 0 warnings expected)
npm run typecheck  # tsc --noEmit
npm run test       # vitest
npm run knip       # unused files / exports / dependencies
npm run build      # production build
npm run format     # prettier --write
npm run verify     # lint + typecheck + test + build
```

`npm run verify` must pass before any commit.

## Enforcement

| Gate                              | Where                                                                   |
| --------------------------------- | ----------------------------------------------------------------------- |
| ESLint + Prettier on staged files | `pre-commit` (lint-staged)                                              |
| Conventional Commits              | `commit-msg` (commitlint)                                               |
| lint + typecheck + test + build   | `npm run verify`, and `.github/workflows/ci.yml`                        |
| `npm audit --audit-level=high`    | CI `audit` job                                                          |
| Unused files / exports / deps     | `npm run knip` — advisory in CI until the dead files below are resolved |

## Known gaps (not yet done)

- **Test coverage is logic-only.** `lib/`, `hooks/use-language`, and the error boundary are
  covered (21 tests). Feature components in `components/` are not.
- **No E2E.** §14 wants Playwright on critical flows. Not set up.
- **No Sentry.** `ErrorBoundary.componentDidCatch` logs to console; §11 wants a real
  reporter in production.
- **No security headers.** §15 wants CSP, HSTS, `X-Content-Type-Options`,
  `Referrer-Policy`, `frame-ancestors`. A static Vercel deploy ships none by default —
  they belong in `vercel.json`.
- **8 moderate npm advisories** remain, all in dev tooling with no non-breaking fix.
  High and critical are clear.

## Orphaned i18n keys

`src/messages/*.json` still contains three groups no component reads: **`nav`**,
**`animation`**, **`game`** (the last two belonged to components deleted on 2026-11-05).
`hero` and `projects` ARE still used — by `experience.tsx` — so do not remove those.
