# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Dev commands

All commands run from the **workspace root** (`Site-Extension/`), not from inside `artifacts/assas-reports/`.

**Install dependencies (first time or after pulling)**
```powershell
pnpm install
```
> The root `package.json` has a `preinstall` guard that rejects `npm`/`yarn`. Always use `pnpm`.
> The `pnpm-workspace.yaml` has a `catalog:` section that defines all pinned versions — this is why `npm install` fails with "catalog:" errors.

**Start the frontend dev server**
```powershell
$env:PORT = "3000"; $env:BASE_PATH = "/"; $env:NODE_ENV = "development"
cd artifacts\assas-reports
.\node_modules\.bin\vite.CMD --config vite.config.ts --host 0.0.0.0
```
> `vite.config.ts` throws hard if `PORT` or `BASE_PATH` are not set — they are not optional.
> App runs at `http://localhost:3000/`.

**Build**
```powershell
pnpm run build
```

**Type-check (frontend only)**
```powershell
pnpm --filter @workspace/assas-reports run typecheck
```

**Windows note**: The workspace `pnpm-workspace.yaml` was originally written for Replit (Linux). The win32 native binary overrides for rollup, esbuild, tailwindcss-oxide, and lightningcss have been commented out to allow local Windows builds.

---

## Architecture

This is a **pnpm monorepo**. The frontend lives entirely in `artifacts/assas-reports/`. There is no active backend or API — all data is static and hardcoded in TypeScript files.

```
Site-Extension/
├── pnpm-workspace.yaml     # workspace + catalog version pins + platform overrides
├── artifacts/
│   └── assas-reports/      # the entire frontend app (React + Vite + Tailwind v4)
│       ├── src/
│       │   ├── App.tsx             # root: providers + wouter router + layout shell
│       │   ├── main.tsx            # entry point
│       │   ├── index.css           # Tailwind v4 config, CSS variables, custom utilities
│       │   ├── data/
│       │   │   └── cementFactories.ts   # ALL cement factory data (prices, market share, etc.)
│       │   ├── i18n/
│       │   │   └── translations.ts      # ALL UI strings for ar / en / zh
│       │   ├── contexts/
│       │   │   └── LanguageContext.tsx  # locale state, dir, persisted to localStorage
│       │   ├── pages/
│       │   │   ├── home.tsx             # main homepage — largest file
│       │   │   ├── contact.tsx
│       │   │   ├── not-found.tsx
│       │   │   └── reports/
│       │   │       ├── index.tsx        # /reports — report cards listing
│       │   │       └── full-report.tsx  # /reports/full-report — full analytics dashboard
│       │   └── components/
│       │       ├── CementPriceTicker.tsx      # sticky animated price ticker
│       │       ├── LanguageSwitcher.tsx        # AR/EN/ZH toggle
│       │       ├── brand/BrandLogo.tsx         # company logo image
│       │       ├── layout/Navbar.tsx           # fixed top nav with scroll effect
│       │       ├── layout/Footer.tsx
│       │       ├── analytics/
│       │       │   ├── AdvancedAnalytics.tsx   # 5-tab recharts dashboard
│       │       │   ├── MarketIntelligence.tsx  # supplier scoring cards
│       │       │   ├── PriceInsights.tsx       # price comparison charts
│       │       │   ├── SaudiMap.tsx            # interactive SVG region map
│       │       │   └── ShippingCalculator.tsx  # cost estimator form
│       │       └── ui/                         # shadcn/ui components (do not modify)
└── lib/
    └── api-client-react/   # workspace package — exports @workspace/api-client-react
                            # currently unused by the frontend
```

### Routing
Client-side only via **wouter**. Four routes: `/`, `/reports`, `/reports/full-report`, `/contact`. The router base is set dynamically from `BASE_PATH` env var (required at vite startup).

### Styling
**Tailwind CSS v4** (via `@tailwindcss/vite` plugin — no `tailwind.config.js`). All theme tokens (colors, fonts, radius) are CSS custom properties defined in `index.css` under `:root`. Brand colors:
- `--color-primary`: navy `hsl(222 70% 28%)`
- `--color-secondary`: gold `hsl(42 90% 52%)` — the dominant accent throughout the UI
- Fonts: Cairo + Tajawal (Arabic-optimized Google Fonts)

Custom utility classes live at the bottom of `index.css`: `.text-gradient-gold`, `.premium-card`, `.glass-card`, `.section-label`, `.pattern-grid`, `.pattern-dots`, `@keyframes ticker` (used by the price ticker scroll animation).

### Internationalization
`useLang()` hook from `LanguageContext` returns `{ t, locale, dir }`. All three locales (`ar`, `en`, `zh`) are defined in `translations.ts` as a single `const` object — no runtime loading. `ar` is default. The `dir` value (`rtl`/`ltr`) is applied to `document.documentElement.dir` on locale change.

**Important**: Some strings in `home.tsx` are NOT in the translation system — they are inline locale ternaries (`locale === "en" ? "..." : locale === "zh" ? "..." : "..."`). This means the same page has two different string-management patterns.

### Data layer
`src/data/cementFactories.ts` exports `CEMENT_FACTORIES` — an array of 17 factory objects. Every chart, table, ticker, and stat on the site reads from this array. There is no API, no database, no backend. The ticker simulates price movement by randomly mutating `stockPrice` in component state — it does not persist.

---

## Key files for editing

| Task | File(s) to edit |
|---|---|
| Change any UI text (navbar, hero, footer, stats) | `src/i18n/translations.ts` |
| Update cement prices, market share, capacity | `src/data/cementFactories.ts` |
| Change the homepage layout or sections | `src/pages/home.tsx` |
| Change the full report / analytics dashboard | `src/pages/reports/full-report.tsx` |
| Change global colors or CSS utilities | `src/index.css` |
| Change navigation links | `src/components/layout/Navbar.tsx` |
| Change the logo image | `src/components/brand/BrandLogo.tsx` (swap the imported asset) |
| Add a new page | Create `src/pages/<name>.tsx` and add a `<Route>` in `src/App.tsx` |
| Add a new translation key | Add to all three locales in `translations.ts`, then use `t.<key>` |

## Files not to touch

- `src/components/ui/` — shadcn/ui primitives. Add new ones with the shadcn CLI, do not hand-edit.
- `vite.config.ts` — requires `PORT` and `BASE_PATH` env vars at runtime; the Replit plugin imports are conditional on `REPL_ID`.
- `pnpm-workspace.yaml` — contains platform override comments for Windows; do not re-enable the excluded linux-only overrides.
- `pnpm-lock.yaml` — auto-managed by pnpm.
- `lib/api-client-react/` — workspace lib, not currently wired into the frontend.

---

## Before adding a backend

The frontend has no API calls — `@tanstack/react-query` is installed but `QueryClient` is configured with defaults and no queries are active. The `@workspace/api-client-react` package exists but is not imported anywhere in the frontend yet. When a backend is added, the integration point will be wiring `useQuery`/`useMutation` calls through that lib.
