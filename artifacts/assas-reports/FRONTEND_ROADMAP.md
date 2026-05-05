# Frontend Roadmap

## Current Frontend State

This app is a Vite + React 19 frontend for Assas Reports, positioned as a Saudi cement pricing and market intelligence platform. It uses Wouter routing, Tailwind CSS v4, shadcn/ui primitives, Recharts, Framer Motion, static factory data, and a custom language context for Arabic, English, and Chinese.

The current product direction is strong: live-looking cement prices, supplier comparison, Saudi regional analytics, reports, charts, shipping calculation, and company identity are already present. The main issue is not missing feature volume. The issue is product focus, information architecture, visual discipline, and future data boundaries.

The frontend currently feels like a premium cement intelligence prototype with many strong modules, but it does not yet fully feel like an institutional Saudi Cement Exchange. It still mixes corporate supplier website content with market-index platform content, has too many dense sections on the homepage, and has several hardcoded Arabic-only areas outside the translation system.

## Key Strengths

- Clear sector-specific static dataset in `src/data/cementFactories.ts`.
- Strong B2B visual direction: navy, gold, dense data cards, dashboards, charts, and tables.
- Useful analytical surfaces: price comparison, market share, production/capacity, regional map, shipping calculator, and reports tabs.
- Good foundation for RTL through `src/contexts/LanguageContext.tsx`, which updates `document.documentElement.dir` and `lang`.
- shadcn/ui primitives are available and should remain untouched.
- Typecheck passes.

## Main Gaps

- Homepage is overloaded and should be reorganized into a sharper institutional narrative.
- Many sections are hardcoded Arabic in page/component files instead of `src/i18n/translations.ts`.
- Some data is duplicated across homepage analytics, reports, and full report modules.
- "Live" behavior is simulated with random values, which must be visually labeled as indicative until backend data exists.
- Reports pages need stronger report-library UX, clearer disabled states, and future subscription/readiness patterns.
- Visual system overuses rounded 24-28px cards, glow effects, and dark sections, reducing institutional restraint.
- Large bitmap assets create performance risk. Production build produced a JS chunk above 1 MB and multiple 6-8 MB image assets.

## Priority Tasks

### Phase 1: Quick Visual Wins

Files:
- `src/index.css`
- `src/pages/home.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/CementPriceTicker.tsx`

Tasks:
- Reduce card radius from frequent `rounded-3xl`/`rounded-[28px]` to a more enterprise 8-16px range in custom sections.
- Make the ticker sit below the fixed navbar instead of competing at `top-0`.
- Add a compact "indicative/static data" status treatment until live backend data exists.
- Reduce decorative glows and pattern density.
- Improve hero hierarchy so the platform promise is clearer than the company slogan.

Impact: High.
Risk: Low.

### Phase 2: Homepage Restructuring

Files:
- `src/pages/home.tsx`
- `src/components/CementPriceTicker.tsx`
- `src/components/analytics/PriceInsights.tsx`
- `src/components/analytics/MarketIntelligence.tsx`
- `src/components/analytics/SaudiMap.tsx`

Tasks:
- Reorder homepage as: hero, ticker/index snapshot, market summary, supplier comparison, regional visibility, report preview, CTA.
- Move logistics-heavy and company-gallery content lower or to contact/about later.
- Reduce repeated price analytics between the top table, `PriceInsights`, and full report.
- Make "Saudi Cement Price Index" the dominant first-viewport product signal.

Impact: Very high.
Risk: Medium.

### Phase 3: Reports Experience

Files:
- `src/pages/reports/index.tsx`
- `src/pages/reports/full-report.tsx`

Tasks:
- Convert report cards into a structured report library with category, update period, access status, and primary action.
- Replace `#` links with explicit disabled button states.
- Add report metadata model before backend work: id, slug, title, summary, category, frequency, status, accessLevel.
- Improve full-report filters so each selection affects visible data or is visibly marked as pending backend.
- Add empty states for zero results by region/filter.

Impact: High.
Risk: Medium.

### Phase 4: Data Presentation

Files:
- `src/data/cementFactories.ts`
- `src/components/analytics/*`
- `src/pages/reports/full-report.tsx`

Tasks:
- Centralize derived metrics: averages, sorted lists, regional totals, price spread, utilization.
- Avoid hardcoded average bag price where computed data exists.
- Add source/date/confidence fields to cement pricing data.
- Keep display components accepting data props instead of importing global static arrays directly.

Impact: High.
Risk: Medium.

### Phase 5: Backend Readiness

Files:
- New future files under `src/lib/marketMetrics.ts`, `src/types/market.ts`, `src/data/reportCatalog.ts`.
- Existing static files remain as mock adapters.

Tasks:
- Define frontend data contracts before API work.
- Separate data fetching/adapters from display components.
- Prepare access metadata for future subscriptions without implementing auth.
- Add loading, empty, error, and stale data states to every future dynamic area.

Impact: Very high.
Risk: Medium.

## Safe Edit Files

Safe for upcoming frontend work:
- `src/pages/home.tsx`
- `src/pages/reports/index.tsx`
- `src/pages/reports/full-report.tsx`
- `src/pages/contact.tsx`
- `src/components/CementPriceTicker.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/LanguageSwitcher.tsx`
- `src/components/analytics/AdvancedAnalytics.tsx`
- `src/components/analytics/MarketIntelligence.tsx`
- `src/components/analytics/PriceInsights.tsx`
- `src/components/analytics/SaudiMap.tsx`
- `src/components/analytics/ShippingCalculator.tsx`
- `src/data/cementFactories.ts`
- `src/i18n/translations.ts`
- `src/index.css`

## Do Not Touch Now

- `src/components/ui/*`
- `package.json`
- `pnpm-workspace.yaml`
- `vite.config.ts`
- `tsconfig.json`
- `components.json`
- Deployment and Vercel settings
- Authentication/backend/database code

## Backend Preparation Notes

Prepare these concepts in the frontend before backend implementation:
- `CementFactory`
- `CementPricePoint`
- `CementIndexSnapshot`
- `RegionMarketSummary`
- `ReportCatalogItem`
- `ReportDataset`
- `AccessLevel`
- `DataFreshness`

Every market component should eventually support:
- loading state
- empty state
- error state
- stale data badge
- source/date label
- restricted/premium access state

## Recommended Editing Order

1. Fix visual system discipline in `src/index.css` and repeated custom card styles.
2. Fix navbar/ticker stacking and mobile header behavior.
3. Restructure homepage information architecture in `src/pages/home.tsx`.
4. Move untranslated homepage strings into `src/i18n/translations.ts`.
5. Improve reports index into a real report catalog.
6. Refine full report filters, tabs, tables, and states.
7. Extract metric helpers and static report catalog data.
8. Optimize image usage and consider route-level code splitting.

