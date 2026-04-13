# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Current Artifacts

- **API Server** (`artifacts/api-server`) — shared Express API service at `/api`.
- **أساس الإعمار - صفحات التقارير** (`artifacts/assas-reports`) — Arabic RTL React/Vite website at `/` with landing page, reports hub, detailed cement/statistics report page, and contact/locations page.
- **Canvas** (`artifacts/mockup-sandbox`) — design/mockup preview sandbox.

## Assas Reports Artifact

The `artifacts/assas-reports` app is an Arabic RTL website for أساس الإعمار with Tajawal typography and deep blue/orange branding. It now includes:

- Homepage with prominent أساس الإعمار identity, slogan, operating statistics, services, leadership context, locations, and nationwide coverage.
- Reports hub listing detailed report categories for cement company sales, local/export sales, clinker inventory, monthly company sales, market share, financial reports, sustainability, and Assas identity/locations.
- Full report page modeled after cement statistics report flows, with filters for first/second year, month, region, and report type, plus tabs for company sales, period comparison, monthly sales, clinker movements, market share, and Assas identity/locations.
- Contact page with verified operating locations from the public Assas site: Riyadh main office, Dammam distribution branch, and Hafar Al-Batin operating point, plus a request/inquiry form.
- Static Arabic data for report tables and charts; no backend or database is currently used by this artifact.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Frontend**: React + Vite + Tailwind CSS
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/assas-reports run dev` — run the Assas reports frontend locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
