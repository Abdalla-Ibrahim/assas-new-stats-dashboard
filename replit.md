# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Current Artifacts

- **API Server** (`artifacts/api-server`) — shared Express API service at `/api`.
- **أساس الإعمار - صفحات التقارير** (`artifacts/assas-reports`) — Arabic RTL React/Vite website at `/` for cement supply company.
- **Canvas** (`artifacts/mockup-sandbox`) — design/mockup preview sandbox.

## Assas Reports Artifact

The `artifacts/assas-reports` app is a **trilingual** (Arabic/English/Chinese) website for **أساس الإعمار التجارية** — a Saudi cement supply company. Dark/navy + gold visual system. Arabic is RTL, English and Chinese are LTR (direction is toggled on `<html>`).

### Internationalization (i18n)
- `src/i18n/translations.ts` — all translated strings for 3 locales (`ar`, `en`, `zh`), `as const`
- `src/contexts/LanguageContext.tsx` — React context with `locale`, `setLocale`, `t`, `dir`; persists to `localStorage`; updates `document.documentElement.dir` and `lang` on change
- `src/components/LanguageSwitcher.tsx` — flag/label toggle in the Navbar
- All key pages/components use `useLang()` hook for translations

### Key features:

### Pages & Sections
- **Home page** (`/`) with:
  - Live animated ticker for cement company stock prices
  - Hero: "مؤشر سعر الاسمنت السعودي" + "شركة أساس الإعمار التجارية"
  - Stats band (actual min price 13.10 ريال, 13 ريال average)
  - Price comparison table sorted by bag price with visual color bars (green/amber/red)
  - **PriceInsights section** — rich charts: horizontal bar chart of all 16 companies by bag price, bulk price bar chart, delta-from-average table, and price trend 2020–2025
  - Visual gallery, services (cement supply only — no logistics/spare parts)
  - Saudi map with interactive regions
  - Shipping calculator
  - Advanced Analytics (5 tabs)
  - Identity/locations, CTA

- **Full Report** (`/reports/full-report`) with:
  - Filters (year, month, region, report type)
  - KPI cards (total sales, local, export, production, clinker inventory)
  - Tabs: مبيعات الشركات, المبيعات خلال فترة, المبيعات الشهرية, الكلنكر, **مقارنة الأسعار** (new — with charts from CEMENT_FACTORIES), الحصة السوقية, هوية أساس

- **Reports hub** (`/reports`) listing report categories
- **Contact** (`/contact`) page

### Data
- `src/data/cementFactories.ts` — **17** Saudi cement factories with realistic price spread:
  - Bag prices range 13.10 ريال (السعودية/حفر الباطن) → 16.40 ريال (العلا)
  - Bulk prices range 190 → 230 ريال/ton
  - Market share, production, capacity, stock price/change, color per factory
  - 17th company: شركة أسمنت جازان (3099)

### Analytics Components
- `SaudiMap.tsx` — geographically accurate SVG map (viewBox 0 0 820 680), 13 regions, factory pins, utilization badge
- `AdvancedAnalytics.tsx` — 5 tabbed sections (overview/production/prices/market/quarterly) using Recharts
- `PriceInsights.tsx` — standalone price comparison section with 4 charts + delta table (new)
- `ShippingCalculator.tsx` — shipping cost estimator
- `CementPriceTicker.tsx` — live animated price ticker

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Frontend**: React + Vite + Tailwind CSS, RTL
- **Charts**: Recharts
- **Routing**: wouter
- **UI**: shadcn-style components
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Fonts**: Cairo, Tajawal (Google Fonts)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/assas-reports run dev` — run the Assas reports frontend locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
