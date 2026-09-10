import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/recreio-da-matematica/",
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "Recreio da Matemática",
        short_name: "Recreio",
        description:
          "Jogos de matemática, lógica e raciocínio rápido para crianças de 7 a 10 anos.",
        theme_color: "#eaf1ff",
        background_color: "#eaf1ff",
        display: "standalone",
        start_url: "/recreio-da-matematica/",
        scope: "/recreio-da-matematica/",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
      },
    }),
  ],
});
