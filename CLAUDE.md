# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Board — Frontend Subagent

## Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **UI library**: MUI v5 (`@mui/material`, `@mui/icons-material`, `@mui/lab`, `@mui/x-charts`, `@mui/x-date-pickers`)
- **HTTP client**: Axios
- **Date utility**: Day.js (with `AdapterDayjs` for MUI DatePicker)

## Common Commands

```bash
npm run dev    # Start dev server on http://localhost:3000
npm run build  # Production build
npm run lint   # ESLint
```

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
      about/page.tsx
      page.tsx                # Dashboard home — renders ProductPerformance
    authentication/login/     # Google OAuth login page
    context/AuthContext.tsx   # Auth state + useAuth hook
    layout.tsx                # Root layout (wraps AuthProvider)
```

## Key Conventions
- All API calls go through service modules in `src/app/(DashboardLayout)/services/`. Never call the backend directly from a page or component.
- **Backend base URL**: `http://20.51.170.82:5000` (HTTPS, not HTTP).
- Use MUI components for all UI — do not introduce other component libraries.
- Follow existing file naming: `PascalCase` for components, `camelCase` for utilities/services.
- TypeScript strict mode is enabled — avoid `any`.

## Authentication
- Auth is Google OAuth. The login page exchanges a Google ID token via `POST /Auth/google-login`.
- `AuthContext` stores `{ user, token }` in state and persists to `localStorage` under keys `growy_user` and `growy_token`.
- Use the `useAuth()` hook to access the current user and token anywhere inside `AuthProvider`.
- Admin-only actions are gated by comparing `user.email` against the hardcoded `ADMIN_EMAIL = "growyserver@gmail.com"` in `ProductPerformance.tsx`.

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
