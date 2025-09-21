/* eslint-env serviceworker */
/* eslint-disable no-restricted-globals */
// Lightweight mock API service worker
// Intercepts POST /analytics and returns 204 to simulate an analytics endpoint.
// Loaded only in development via registration in src/index.tsx

self.addEventListener("install", (event) => {
  // Activate immediately after installation
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Become the active service worker for all clients immediately
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  try {
    const url = new URL(event.request.url);
    const isAnalytics =
      url.pathname === "/analytics" && event.request.method === "POST";
    if (isAnalytics) {
      // Consume the request body to avoid warnings in some browsers
      event.respondWith(
        (async () => {
          try {
            // Best-effort read to drain the stream; ignore the content
            if (event.request.body) {
              await event.request
                .clone()
                .arrayBuffer()
                .catch(() => {});
            }
          } catch {}
          return new Response(null, { status: 204 });
        })()
      );
    }
  } catch (e) {
    // Ignore URL parsing errors for non-HTTP(S) requests
  }
});
