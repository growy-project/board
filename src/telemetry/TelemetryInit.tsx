"use client";
import { useEffect } from "react";
import { initTelemetry } from "@/telemetry/appInsights";

/**
 * Renders nothing — it exists only to initialize Application Insights in the
 * browser after hydration, keeping all `window`-touching SDK code out of the
 * static export prerender. Mount once near the root of the app.
 */
export default function TelemetryInit() {
  useEffect(() => {
    initTelemetry();
  }, []);

  return null;
}
