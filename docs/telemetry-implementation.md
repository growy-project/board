Implementation Plan: Client-Side Telemetry Integration via Azure Static Web Apps
This document outlines the technical specifications and deployment steps to enable client-side application monitoring for a standalone React application hosted on Azure Static Web Apps (SWA). The strategy utilizes a minimal, low-overhead JavaScript API placeholder to bypass Azure Portal infrastructure constraints and unlock native portal telemetry mapping without incurring runtime infrastructure fees.

Architecture Overview
By default, the Azure Portal limits native Application Insights linking within the SWA blade to instances that contain at least one integrated backend route. To satisfy this validation without migrating the existing custom Web API backend into Azure Functions, a lightweight JavaScript HTTP trigger is introduced into the repository.

[ Browser / React App ] ───(Direct Telemetry HTTPS)───> [ Application Insights ]
         │
         ├───(Static Content Requests)───────────────> [ Azure Static Web App ]
         │                                                      │
         └───(Portal Validation Bypass)─────────────────────────└──> [ /api Placeholder ]
The React architecture initializes the Application Insights JavaScript SDK client-side during the application boot phase. Performance metrics, exceptions, and user interactions are securely streamed from the user's browser straight to the provisioned Azure Log Analytics workspace.

## Phase 1: Repository Infrastructure Additions
1. API Endpoint Definition
A new directory named api/telemetry-ping/ must be generated at the repository root. This directory contains the necessary configuration and script execution contexts required by the Kudu/Oryx build engines during deployment.

File: /api/telemetry-ping/function.json

JSON
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get"]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
File: /api/telemetry-ping/index.js

JavaScript
module.exports = async function (context, req) {
  context.res = {
    status: 200,
    body: "SWA Telemetry placeholder active."
  };
};


2. CI/CD Workflow Modification
The automation pipeline configuration file (e.g., GitHub Actions workflow file located at .github/workflows/azure-static-web-apps-*.yml) must be updated to include the targeted API directory location. This instructs the builder to compile and deploy the function runtime alongside the static assets.

YAML
with:
  azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
  repo_token: ${{ secrets.GITHUB_TOKEN }}
  action: "upload"
  app_location: "/"          # Target directory for the React source code
  api_location: "api"        # Target directory for the placeholder function
  output_location: "dist"    # Production build output directory (Vite standard)



## Phase 2: Azure Resource Provisioning & Linking
Once the updated code repository has been merged and the CI/CD pipeline executes successfully, the portal constraints resolve.

Navigate to the Azure Portal and select the target Static Web App instance.

Under the Monitoring menu category, select Application Insights.

Toggle the selection to Yes to enable integration.

Select or provision a target log analytics workspace and click Save.

Open the newly linked Application Insights resource instance and retrieve the Connection String from the global Overview metadata panel.

## Phase 3: Frontend SDK Integration

> **Stack note:** the frontend is **Next.js 14/15 (App Router) + TypeScript,
> statically exported** (`output: 'export'`) — not Vite/CRA. So browser env vars
> must be prefixed `NEXT_PUBLIC_*` and read via `process.env` (there is no
> `import.meta.env`), and any code that touches `window` must be guarded so it
> does not run during the static-export prerender. The steps below reflect that.

1. Dependency Installation
The Microsoft Application Insights web tracking module must be added to the frontend dependency array.

Bash
npm install @microsoft/applicationinsights-web

2. Environment Configuration
The connection string is supplied at **build time** through `NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING`. Because the site ships as **two locale builds on two domains**, each build needs its own App Insights resource:

| Build (locale) | Domain | GitHub Secret |
|---|---|---|
| `en` (momentum-scanner resource) | momentum-scanner.com | `NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING_EN` |
| `es` (cedear-scanner resource) | cedear-scanner.com | `NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING_ES` |

The connection strings are stored as the GitHub Secrets above (the actual values live in the Azure portal under each App Insights resource's Overview → Connection String; they are **not** committed to this repo). Each workflow injects the matching secret into its `Build And Deploy` step's `env:` block — SWA portal Application Settings do **not** reach the static build, so this must be done in the workflow:

YAML
env:
  NEXT_PUBLIC_LOCALE: en
  NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING: ${{ secrets.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING_EN }}

For local dev, set (or leave blank in) `.env.local`:

Code snippet
NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING=

A blank/missing value disables telemetry, so dev runs send nothing by default.

3. Telemetry Subsystem Initialization
A TypeScript module initializes the tracking instance with SPA auto-route tracking. Initialization is **browser-guarded** so the SDK never touches `window` during prerender, and idempotent so React StrictMode's double-mount does not initialize twice. It also exposes thin helpers for Phase 4.

File: src/telemetry/appInsights.ts

TypeScript
import {
  ApplicationInsights,
  type IEventTelemetry,
  type IExceptionTelemetry,
} from "@microsoft/applicationinsights-web";

const connectionString = process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING;

let appInsights: ApplicationInsights | undefined;

export function initTelemetry(): ApplicationInsights | undefined {
  if (typeof window === "undefined") return undefined; // no SSR/prerender
  if (!connectionString) return undefined;             // telemetry disabled
  if (appInsights) return appInsights;                 // already initialized

  appInsights = new ApplicationInsights({
    config: {
      connectionString,
      enableAutoRouteTracking: true,
      maxAjaxCallsPerView: 50,
    },
  });
  appInsights.loadAppInsights();
  appInsights.trackPageView();
  return appInsights;
}

export function trackEvent(name: string, properties?: IEventTelemetry["properties"]): void {
  appInsights?.trackEvent({ name, properties });
}

export function trackException(error: Error, properties?: IExceptionTelemetry["properties"]): void {
  appInsights?.trackException({ exception: error, properties });
}

export { appInsights };

4. Entry Point Execution
There is no `main.jsx`/`index.js` in the App Router. Instead, a tiny `"use client"` component runs `initTelemetry()` in a `useEffect` (post-hydration, browser only) and is mounted once in the root layout. Do **not** use a top-level `import './telemetry'` side-effect — it would execute during the static prerender and crash the build.

File: src/telemetry/TelemetryInit.tsx

TypeScript
"use client";
import { useEffect } from "react";
import { initTelemetry } from "@/telemetry/appInsights";

export default function TelemetryInit() {
  useEffect(() => {
    initTelemetry();
  }, []);
  return null;
}

File: src/app/layout.tsx (mount it inside the existing provider tree)

TypeScript
import TelemetryInit from "@/telemetry/TelemetryInit";
// ...
<body>
  <TelemetryInit />
  {/* existing providers */}
</body>


## Phase 4: Telemetry Instrumentation Standards
Developers can leverage the exported tracking reference to report custom transactional boundaries or process failures. Custom events appear in the portal under **Usage → Events** and the `customEvents` table; the `properties` passed to `trackEvent` land in **customDimensions**.

### Currently instrumented events
| Event name | Fires when | Properties | Source |
|---|---|---|---|
| `SearchClicked` | User clicks the Search/Buscar button | `exchange`, `minPercentageChange`, `startDate`, `endDate` | `src/app/(DashboardLayout)/components/dashboard/ProductPerformance/components/StockFilterToolbar.tsx` |
| `ExchangeChanged` | User picks a different exchange in the filter dropdown | `exchange` (new value) | `src/app/(DashboardLayout)/components/dashboard/ProductPerformance/components/StockFilterToolbar.tsx` |
| `WatchlistAdd` | A symbol is **successfully** added to the watchlist (not fired on 409/already-added or errors) | `symbol`, `exchange` | `src/app/(DashboardLayout)/components/dashboard/ProductPerformance/hooks/useSymbolActions.ts` |

All three call the browser-guarded `trackEvent` helper from `src/telemetry/appInsights.ts`, so they no-op when telemetry is disabled (e.g. local dev with a blank connection string) and never block the underlying action.

### How to add more
Pattern A: Custom Interaction Logs
TypeScript
import { trackEvent } from "@/telemetry/appInsights";

const logUserInteraction = (eventName: string, analyticalProperties: Record<string, unknown> = {}) => {
  trackEvent(eventName, analyticalProperties);
};

Pattern B: Exception Ingestion
TypeScript
import { trackException } from "@/telemetry/appInsights";

try {
  // Runtime or External Network API logic execution
} catch (error) {
  trackException(error instanceof Error ? error : new Error(String(error)));
}