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

// Log metrics in development; send to analytics in production
const sendToAnalytics: ReportHandler = (metric) => {
  if (env.NODE_ENV === "production") {
    try {
      const url = env.REACT_APP_ANALYTICS_URL || "/analytics";
      const body = JSON.stringify(metric);
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon(url, blob);
      } else {
        // keepalive allows the request to outlive the page
        fetch(url, {
          method: "POST",
          body,
          keepalive: true,
          headers: { "Content-Type": "application/json" },
        }).catch(() => {
          // Swallow network errors for analytics
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

// Register a tiny mock API in development to accept /analytics beacons
if (env.NODE_ENV !== "production" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/mock-api.js").catch(() => {
      // ignore registration errors in dev
    });
  });
}
