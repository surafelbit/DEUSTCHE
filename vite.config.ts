import path from "path";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // server: {
  //   // allow your ngrok URL
  //   allowedHosts: ["b23e8369b435.ngrok-free.app"],
  // },
  server: {
    host: true, // listen on all interfaces
    port: 5173,
    strictPort: false,
    allowedHosts: [
      ".ngrok-free.app", // allow all ngrok URLs
    ],
    origin: "http://localhost:5173", // optional, helps Vite accept external requests
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    // Avoid esbuild trying to prebundle canvg which pulls core-js internals
    exclude: ["canvg"],
    esbuildOptions: {
      // Make esbuild ignore core-js so it doesn't try to resolve its internals
      external: ["core-js/*"],
    },
  },
  build: {
    rollupOptions: {
      external: [
        /core-js\/.*/, // externalize any core-js imports (e.g., core-js/modules/es.promise.js)
      ],
    },
  },
});
