import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  // Use a relative base so the app works at /<user>/<repo>/ on GitHub Pages.
  // Can be overridden by setting BASE_URL env var during build.
  base: process.env.BASE_URL ?? "./",
  build: {
    manifest: true,
    sourcemap: true,
  },
  plugins: [tailwindcss(), react()],
  server: {
    // Allow external access so ngrok can tunnel to the dev server
    host: true,
    cors: true,
    // Configure HMR to work over ngrok's HTTPS/WSS endpoint
    hmr: {
      host: "xbgyiwf6.ngrok.io",
      protocol: "wss",
      port: 443,
    },
  },
});
