// @lovable.dev/vite-tanstack-config already includes the required plugins.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect the bundled server entry to src/server.ts.
    server: { entry: "server" },

    // Generate static HTML pages for Render.
    prerender: {
      enabled: true,
      crawlLinks: true,
    },
  },
});
