import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";
import "./index.css";
import App from "./App.tsx";

// Keep installed devices (especially iOS home-screen PWAs, which are slow to
// notice updates on their own) on the latest build: check for a new service
// worker on every launch and reload as soon as it takes control.
if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload();
  });
}
registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/recreio-da-matematica/">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
