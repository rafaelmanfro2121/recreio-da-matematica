import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";

// Render first, no matter what.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/recreio-da-matematica/">
      <App />
    </BrowserRouter>
  </StrictMode>,
);

// One-time cleanup: an earlier build shipped a service worker that could get
// stuck controlling the page with a stale cache (blank screen on reload,
// worse in Chrome than Safari). This app no longer registers one -- drop any
// leftover registration + cache from a device that installed the old one, so
// every future load goes straight to the network like a normal site.
if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((regs) => Promise.all(regs.map((r) => r.unregister())))
    .then(() => (typeof caches !== "undefined" ? caches.keys() : []))
    .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
    .catch(() => {
      /* nothing to clean up, or the API isn't available -- fine either way */
    });
}
