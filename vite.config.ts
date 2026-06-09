import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts
    server: { entry: "server" },
  },
  // Add this property to force enable the Netlify deployment target preset
  nitro: {
    preset: "netlify",
  },
});
