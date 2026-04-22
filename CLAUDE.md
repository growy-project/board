# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Board — Frontend Subagent

## Stack
- **Framework**: Next.js 14 (App Router), **statically exported** (`output: 'export'` in `next.config.js`)
- **Language**: TypeScript 5
- **UI library**: MUI v5 (`@mui/material`, `@mui/icons-material`, `@mui/lab`, `@mui/x-charts`, `@mui/x-date-pickers`)
- **HTTP client**: Axios
- **Date utility**: Day.js (with `AdapterDayjs` for MUI DatePicker)
- **Charts**: Prefer `@mui/x-charts` for new charts. `apexcharts` / `react-apexcharts` are also installed (legacy); avoid adding new usages.

## Common Commands

```bash
npm run dev    # Start dev server on http://localhost:3000
npm run build  # Production build — emits static site to ./out/
npm run lint   # ESLint
```

## Static Export Implications
Because `next.config.js` sets `output: 'export'` and `images: { unoptimized: true }`:
- **No SSR, no API routes, no middleware.** Do not add server-only features (`route.ts`, server actions, `getServerSideProps`-style flows).
- **All env vars used in code must be `NEXT_PUBLIC_*`** and are baked into the JS bundle at build time.
- `next/image` runs unoptimized — plain `<img>` and MUI components are fine.

## Environment Variables
`.env.local` (local dev) and the GitHub Actions workflow (prod build) must both define:
- `NEXT_PUBLIC_API_BASE_URL` — backend origin (prod: `https://growy-api.eastus.cloudapp.azure.com`)
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` — Google OAuth client ID used by `@react-oauth/google`

Service modules read the API URL with a hardcoded fallback:
```ts
process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://growy-api.eastus.cloudapp.azure.com"
```

## Deployment
Deploys to Azure Static Web Apps via `.github/workflows/azure-static-web-apps-gentle-stone-0ea32490f.yml` on push to `main`. Build-time env vars are injected through the `env:` block on the `Build And Deploy` step and must exist as GitHub Secrets. SWA Application Settings in the Azure portal do **not** reach the static build — always set build-time vars in the workflow.

## Project Structure

```
src/
  app/
    (DashboardLayout)/
      components/dashboard/   # Feature components (ProductPerformance is the main one)
      components/shared/      # DashboardCard, BlankCard wrappers
      components/container/   # PageContainer
      layout/                 # Header, Sidebar, NavItem, NavGroup
      services/               # API service modules (axios calls)
      utilities/, icons/      # Misc helpers and icon components
      page.tsx                # Dashboard home — renders ProductPerformance
    authentication/login/     # Google OAuth login page
    context/AuthContext.tsx   # Auth state + useAuth hook
    layout.tsx                # Root layout (wraps AuthProvider)
```

## Key Conventions
- All API calls go through service modules in `src/app/(DashboardLayout)/services/`. Never call the backend directly from a page or component.
- Use MUI components for all UI — do not introduce other component libraries.
- Follow existing file naming: `PascalCase` for components, `camelCase` for utilities/services.
- TypeScript strict mode is enabled — avoid `any`.

## Authentication
- Auth is Google OAuth. The login page exchanges a Google ID token via `POST /Auth/google-login`.
- `AuthContext` (`src/app/context/AuthContext.tsx`) stores `{ user, token }` in state and persists to `localStorage` under keys `growy_user` and `growy_token`.
- Use the `useAuth()` hook to access the current user and token anywhere inside `AuthProvider`.
- Admin-only actions are gated client-side by comparing `user.email` against the hardcoded `ADMIN_EMAIL = "growyserver@gmail.com"` in `ProductPerformance.tsx`. **This is cosmetic** — real authorization is enforced by the API. Do not rely on the client-side check for security-sensitive logic.

## Main Dashboard (`ProductPerformance`)
The primary view is a paginated, sortable stock performance table. Key data flows:
1. On mount, calls `getExchangeDateRange(exchange)` to set the default date range.
2. User triggers `startStatisticJob(params)` → backend returns a `jobId`.
3. Component polls `getJobStatus(jobId)` until the job completes, then renders results.
4. Results are paginated client-side; sorting state is managed locally.

## Service Modules
| File | Endpoints |
|---|---|
| `statisticJobService.ts` | `POST /Statistics/start`, `GET /Statistics/status/:jobId`, `GET /Statistics/history/:symbol` |
| `symbolService.ts` | `PUT /Symbol/:symbol/top-growth`, `PUT /Symbol/:symbol/toxic`, `POST /Symbol/request-tag`, `GET /Symbol/date-range` |
| `authService.ts` | `POST /Auth/google-login` |

## Adding a New Page
1. Create `src/app/(DashboardLayout)/<page-name>/page.tsx`.
2. Add an entry to `src/app/(DashboardLayout)/layout/sidebar/MenuItems.tsx` (uses `@tabler/icons-react` for icons).
