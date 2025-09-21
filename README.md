# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Web Vitals & Analytics

This app includes optional Web Vitals reporting (CLS, FID, FCP, LCP, TTFB).

- In development, metrics are logged to the console by default. If `REACT_APP_ANALYTICS_URL` is set, metrics are POSTed there and the mock API service worker is not registered.
- In production, metrics are always sent to the endpoint defined by `REACT_APP_ANALYTICS_URL` (falls back to `/analytics` if not set).

Configure the endpoint by setting an environment variable before build:

```bash
# macOS/Linux (zsh/bash)
export REACT_APP_ANALYTICS_URL="https://your-analytics.example.com/collect"

# then build or start
npm start
# or
npm run build
```

Alternatively, copy the example env file and edit it:

```bash
cp .env.example .env
echo "REACT_APP_ANALYTICS_URL=https://your-analytics.example.com/collect" >> .env
```

Implementation details:
- The handler uses `navigator.sendBeacon` when available and no custom headers are required, with a `fetch(..., { keepalive: true })` fallback. If an Authorization header is needed, `fetch` is used.
- The endpoint receives a JSON payload with the Web Vitals metric object.
- To disable reporting entirely, remove the `reportWebVitals(sendToAnalytics)` call in `src/index.tsx`.

Environment management:
- Environment variables are centralized in `src/config/env.ts` and validated with [`zod`](https://github.com/colinhacks/zod) when available (falls back to simple coercion if zod isn't installed yet).
- Preferred variables:
	- `NODE_ENV`: `development` | `test` | `production` (injected by CRA)
	- `REACT_APP_ANALYTICS_URL`: URL to receive metrics (dev and prod when set). In dev, a relative path is proxied via CRA `proxy`.
	- `REACT_APP_GRAFANA_API_TOKEN` (optional): Bearer token added when sending to protected endpoints like Grafana.

### Sending metrics to Grafana

Two simple options:

1) Grafana Annotations API (quick visual marks)

- Set in `.env`:

	- `REACT_APP_ANALYTICS_URL=/api/annotations` (recommended in dev; CRA proxies to the Grafana server defined in `package.json` → `proxy`)
	- `REACT_APP_GRAFANA_API_TOKEN=...` (optional if your Grafana requires auth)

- In production, set a full URL (e.g., `https://grafana.example.com/api/annotations`) and token as needed.

- The app will transform the Web Vitals metric into a Grafana annotation payload:
	- `time`: current timestamp
	- `tags`: `["web-vitals", metricName]`
	- `text`: compact JSON summary of key fields

2) Raw metric to custom endpoint

- If you run Loki, Prometheus Pushgateway, or OTLP via Grafana Alloy, point `REACT_APP_ANALYTICS_URL` to your gateway and handle the JSON metric accordingly on the server side. The app sends the original web-vitals metric JSON when the URL does not include `/api/annotations`.

Mock API behavior in development:

- The service worker at `public/mock-api.js` is registered only when `REACT_APP_ANALYTICS_URL` is NOT set. This prevents it from intercepting requests when you point metrics to Grafana or another service.

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
