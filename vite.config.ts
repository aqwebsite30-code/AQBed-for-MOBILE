// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: false,
  tanstackStart: {
    server: {
      entry: "src/server.ts",
    },
  },
  vite: {
    // Deduplicate React so only one instance exists across all chunks.
    // This prevents lucide-react from loading React before it is initialized,
    // which caused: TypeError: Cannot read properties of undefined (reading 'forwardRef')
    resolve: {
      dedupe: ["react", "react-dom", "react/jsx-runtime"],
    },
    build: {
      rollupOptions: {
        external: [".prisma/client/index-browser", "@prisma/client"],
        output: {
          entryFileNames: "[name].js",
          // Put react + react-dom in their own chunk so they ALWAYS load first
          // before any library (lucide-react, framer-motion, etc.) that depends on them.
          manualChunks(id) {
            if (
              id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/") ||
              id.includes("node_modules/react/jsx-runtime") ||
              id.includes("node_modules/scheduler/")
            ) {
              return "react-core";
            }
          },
        },
      },
    },
  },
});
