# CLAUDE.md

## The standard

This repo follows **`~/Work/CONVENTIONS.md`**, and — now that it is a Next.js App Router
project — **`~/Work/Frontend Boilerplate Rules.md`** applies too.

Where the two disagree, **CONVENTIONS.md wins** (its §20 supersedes the older boilerplate).
The boilerplate doc is still the better reference for Next-specific mechanics: `proxy.ts`,
async `params`, server vs client components, Zod 4 syntax.

> Note: both documents live outside this repo. A fresh clone will not have them.

## What this project is

**Next.js 16 (App Router) + React 19 + Tailwind v4 + next-intl**, deployed on Vercel.

Migrated from React + Vite on 2026-11-05. Apply the **Next.js** column of CONVENTIONS.md §17.

## Node version — important

Requires **Node 20.19+ or 22.12+**. Node 21 does NOT work: it is EOL and lacks
`require(esm)`, which Tailwind v4's PostCSS plugin and Vitest 5 both depend on.
`engines` encodes this; `.nvmrc` pins 22.

## Project-specific decisions (CONVENTIONS.md §21)

| Decision           | Answer                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------- |
| Backend auth model | **None.** No login, no session, no API. §9 auth does not apply.                             |
| OpenAPI / codegen  | None. There is no backend.                                                                  |
| Locales            | `en` (default) + `id`, **in the URL**: `/en`, `/id`                                         |
| i18n library       | `next-intl` (replaced `react-intl`)                                                         |
| Formatter          | Prettier (+ `prettier-plugin-tailwindcss`)                                                  |
| Monorepo           | No. Single app.                                                                             |
| Hosting            | Vercel — a normal Next deploy, **not** `output: 'export'` (that would disable `next/image`) |
| Monitoring         | Vercel Analytics + Speed Insights                                                           |

## Structure

```
src/
├── app/
│   ├── globals.css          # Tailwind v4 @theme tokens
│   └── [locale]/
│       ├── layout.tsx       # metadata, OG tags, theme script, providers
│       ├── page.tsx         # thin — renders one feature screen
│       ├── error.tsx        # route error boundary
│       └── not-found.tsx
├── components/              # kebab-case, one component per file
├── hooks/                   # use-*.ts
├── i18n/                    # routing, navigation, request config
├── lib/                     # pure utils
├── messages/                # en.json / id.json — add every key to BOTH
├── proxy.ts                 # next-intl locale middleware (Next 16 name)
└── test/
```

## Sections that do NOT apply

- **§6 Data fetching** — no API, so no TanStack Query, repositories or query keys.
- **§7 Forms** — no forms.
- **§9 Auth & permissions** — no sessions or guards. `proxy.ts` exists only for locale routing.
- **§12 Env validation** — the app reads no env vars. See `.env.example`.
- **Feature-first folders (§3.1)** — adopt `features/<f>/` when a second page with its own
  data appears, and add `eslint-plugin-boundaries` in the same commit.

## Rules enforced here

- **Server Components by default.** Add `'use client'` only for state, effects, event
  handlers or browser APIs, and push it as deep as possible.
- **Naming**: files kebab-case; components PascalCase; hooks `useX`; no `I`/`T` prefixes.
- **Imports**: `@/*` → `src/*`, auto-sorted. Never hand-order.
- **Types**: strict + `noUncheckedIndexedAccess` + `verbatimModuleSyntax`. No `any`, no
  `enum`, no `as` on external data (both lint errors).
- **One way to do each thing**: `motion/react` (never `framer-motion`), `lucide-react`,
  `cn()`, one dark-mode mechanism.
- **Dark mode**: `data-theme` on `<html>`, applied pre-paint by `THEME_INIT_SCRIPT`
  (rendered by the _server_ layout) and read by `useTheme`. Tokens live once in
  `globals.css`. `next-themes` was removed: it injects its script from a client
  component, which React 19 rejects and which broke hydration.
- **i18n**: no hardcoded user-facing strings. Every key goes into `en.json` AND `id.json`.
  Rich text uses next-intl tag syntax (`<role></role>`), not `{role}`.
- **Images**: use `next/image`, never a bare `<img>`.
- `no-console` is a lint error.

## Commands

```bash
npm run dev        # next dev on :3000
npm run lint       # eslint — 0 errors expected
npm run typecheck  # tsc --noEmit
npm run test       # vitest
npm run knip       # unused files / exports / deps
npm run build      # next build
npm run verify     # lint + typecheck + test + build
```

## Enforcement

| Gate                              | Where                                        |
| --------------------------------- | -------------------------------------------- |
| ESLint + Prettier on staged files | `pre-commit` (lint-staged)                   |
| Conventional Commits              | `commit-msg` (commitlint)                    |
| lint + typecheck + test + build   | `npm run verify`, `.github/workflows/ci.yml` |
| `npm audit --audit-level=high`    | CI `audit` job                               |
| Unused files / exports / deps     | `npm run knip`                               |

## Two non-obvious things

**1. `overrides` in package.json.** Turbopack's PostCSS sandbox cannot `require()` an
ESM-only module, and `@tailwindcss/node`'s `^1.1.0` range resolves to an ESM-only
`magic-string`. The override pins it to `0.30.17` **for Tailwind only** — Vitest keeps its
own. Remove it once Tailwind tightens that range. Without it, use `next build --webpack`.

**2. No `<head>` element in the layout.** App Router owns `<head>`; rendering one yourself
causes hydration failures. Use the `metadata` / `viewport` exports instead.

**3. The theme script is a static file, not inline JSX.** Three options were tried:
an inline `<script dangerouslySetInnerHTML>` works but React 19 warns about `<script>`
children; `next/script` with `beforeInteractive` silences the warning but defers the
script into Next's `__next_s` queue, which runs too late to prevent a theme flash.
`public/theme-init.js` loaded via a blocking `<script src>` is warning-free AND runs
before paint, at the cost of one small cached request. Because that file lives outside
the bundle it cannot import `src/lib/theme.ts`, so `theme.test.ts` asserts the two stay
in sync.

**4. `suppressHydrationWarning` on `<html>` and `<body>`.** The first is for the theme
attribute; the second is for browser extensions (Grammarly, password managers) that
inject attributes before hydration. It is one level deep only — real mismatches inside
the tree still surface.

## Known gaps

- **`public/images/uob.png` is still 3.6 MB on disk.** It is now served through
  `next/image` (resized + AVIF/WebP), so visitors no longer download the full file — but
  shrinking the source would still speed up builds.
- **Orphaned i18n groups**: `nav`, `hero`, `projects`, `animation`, `game` — left over from
  components deleted on 2026-11-05. `sections`, `intro`, `exp`, `proj`, `experience`,
  `meta` are live.
- **Tests are logic-only** (26 tests): `lib/`, `useTheme`, routing config, error boundary.
  The i18n-dependent components are untested.
- No E2E (Playwright), no Sentry, no security headers (`vercel.json`).
