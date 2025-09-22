import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";
import type { ReportHandler } from "web-vitals";
import { env } from "./config/env";

const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Log metrics by default; send to analytics in production or when an explicit URL is provided
const sendToAnalytics: ReportHandler = (metric) => {
  const shouldSend =
    env.NODE_ENV === "production" || Boolean(env.REACT_APP_ANALYTICS_URL);

  if (shouldSend) {
    try {
      const url = env.REACT_APP_ANALYTICS_URL || "/analytics";

      // If posting to Grafana annotations API, transform payload accordingly
      const isGrafanaAnnotations = url.includes("/api/annotations");
      const payload = isGrafanaAnnotations
        ? {
            time: Date.now(),
            tags: ["web-vitals", metric.name],
            // Compact text to keep annotation readable; full metric is embedded
            text: JSON.stringify({
              summary: `${metric.name}=${Math.round(metric.value)}`,
              id: metric.id,
              value: metric.value,
              delta: (metric as any).delta,
              navigationType: (metric as any).navigationType,
            }),
          }
        : metric;

      const body = JSON.stringify(payload);

      // Prepare headers; include Grafana token when provided
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      const hasGrafanaToken = Boolean(env.REACT_APP_GRAFANA_API_TOKEN);

      if (hasGrafanaToken) {
        headers["Authorization"] = `Bearer ${env.REACT_APP_GRAFANA_API_TOKEN}`;
      }

      // Use fetch when we need custom headers (e.g., Authorization); otherwise prefer sendBeacon
      const canUseBeacon = "sendBeacon" in navigator && !hasGrafanaToken;
      if (canUseBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon(url, blob);
      } else {
        fetch(url, {
          method: "POST",
          body,
          keepalive: true,
          headers,
        })
          .then((res) => {
            if (!res.ok) {
              // Log non-2xx to help diagnose API-level errors (e.g., 401/403/400)
              console.error("[Analytics] non-2xx response", {
                url,
                status: res.status,
                statusText: res.statusText,
              });
            }
          })
          .catch((err) => {
            // Network-level errors (CORS, connection, navigation abort)
            console.error("[Analytics] fetch error", { url, err });
          });
      }
    } catch {
      // No-op: never let analytics crash the app
    }
  } else {
    // Helpful during local development
    // eslint-disable-next-line no-console
    console.log("[Web Vitals]", metric.name, Math.round(metric.value), metric);
  }
};

reportWebVitals(sendToAnalytics);

// Register a tiny mock API in development to accept /analytics beacons,
// but only when no explicit analytics URL is configured
if (
  env.NODE_ENV !== "production" &&
  !env.REACT_APP_ANALYTICS_URL &&
  "serviceWorker" in navigator
) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/mock-api.js").catch(() => {
      // ignore registration errors in dev
    });
  });
}
