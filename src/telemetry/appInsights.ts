import {
  ApplicationInsights,
  type IEventTelemetry,
  type IExceptionTelemetry,
} from "@microsoft/applicationinsights-web";

// Per-locale connection string is injected at build time via the workflow
// `env:` block (see board/CLAUDE.md). When absent — e.g. local dev — telemetry
// stays disabled and every helper below no-ops.
const connectionString = process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING;

let appInsights: ApplicationInsights | undefined;

/**
 * Initialize Application Insights in the browser. Safe to call more than once
 * (React StrictMode mounts effects twice) and safe to call during static
 * prerender — it returns early when there is no `window` or no connection
 * string, so the App Insights SDK never touches browser globals on the server.
 */
export function initTelemetry(): ApplicationInsights | undefined {
  if (typeof window === "undefined") return undefined;
  if (!connectionString) return undefined;
  if (appInsights) return appInsights;

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

/** Report a custom interaction. No-ops until telemetry is initialized. */
export function trackEvent(
  name: string,
  properties?: IEventTelemetry["properties"],
): void {
  appInsights?.trackEvent({ name, properties });
}

/** Report a caught exception. No-ops until telemetry is initialized. */
export function trackException(
  error: Error,
  properties?: IExceptionTelemetry["properties"],
): void {
  appInsights?.trackException({ exception: error, properties });
}

export { appInsights };
