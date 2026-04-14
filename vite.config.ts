import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Split heavy vendor code into its own chunks to keep the main bundle small
// (improves LCP/TTI on first paint). Modules that are part of large ecosystems
// are grouped by ecosystem so related code sits together in a single HTTP
// request.
function manualChunks(id: string): string | undefined {
  if (!id.includes("node_modules")) return undefined;
  if (id.includes("@radix-ui")) return "vendor-radix";
  if (id.includes("@supabase")) return "vendor-supabase";
  if (id.includes("@tanstack")) return "vendor-query";
  if (id.includes("framer-motion")) return "vendor-motion";
  if (id.includes("react-markdown") || id.includes("remark-") || id.includes("micromark") || id.includes("mdast-") || id.includes("unified") || id.includes("unist-")) {
    return "vendor-markdown";
  }
  if (id.includes("recharts") || id.includes("d3-")) return "vendor-charts";
  if (id.includes("zod")) return "vendor-zod";
  if (id.includes("react-router")) return "vendor-router";
  if (id.includes("react-dom") || id.includes("/react/")) return "vendor-react";
  return undefined;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
