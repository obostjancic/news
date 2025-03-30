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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<div>An error occurred</div>}>
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>
);