import HyperDX from "@hyperdx/browser";
import * as Sentry from "@sentry/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./index.css";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [Sentry.browserTracingIntegration()],
  tracePropagationTargets: [
    "localhost",
    /^https:\/\/news\.ognjenbostjancic\.com/,
  ],
  tracesSampleRate: 1.0,
});

HyperDX.init({
  apiKey: import.meta.env.VITE_HYPERDX_API_KEY,
  service: "news",
  tracePropagationTargets: [
    "localhost",
    /^https:\/\/news\.ognjenbostjancic\.com/,
  ],
  consoleCapture: true,
  advancedNetworkCapture: true,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<div>An error occurred</div>}>
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>
);
