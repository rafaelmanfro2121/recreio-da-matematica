import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";

// Render first, no matter what -- nothing PWA-related should ever be able to
// block or crash the app mounting.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/recreio-da-matematica/">
      <App />
    </BrowserRouter>
  </StrictMode>,
);

// Best-effort: pick up new builds on future visits. skipWaiting + clientsClaim
// (set in vite.config.ts) let the new service worker take over without
// waiting for every tab to close; we deliberately do NOT force a reload here
// (that risks a reload loop on some browsers) -- the next natural navigation
// or relaunch will already be on the latest version.
import("virtual:pwa-register")
  .then(({ registerSW }) => registerSW({ immediate: true }))
  .catch(() => {
    /* service worker unsupported or registration failed -- app still works without it */
  });
