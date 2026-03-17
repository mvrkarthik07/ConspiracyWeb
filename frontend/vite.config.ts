import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    fs: {
      // allow importing shared files from repo root (used during migration)
      allow: [path.resolve(__dirname, ".."), __dirname],
    },
    proxy: {
      // Dev: forward SPA requests to Next API server
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
})
