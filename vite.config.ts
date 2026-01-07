import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import vitePrerender from "vite-plugin-prerender";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "production" && vitePrerender({
      staticDir: path.resolve(__dirname, "dist"),
      routes: [
        "/",
        "/sobre",
        "/servicos",
        "/contato",
        "/blog",
        "/indique-e-ganhe",
        "/abrir-empresa",
        "/segmentos/contabilidade-para-medicos",
        "/segmentos/contabilidade-para-dentistas",
        "/segmentos/contabilidade-para-psicologos",
        "/conteudo/calculadora-pj-clt",
        "/conteudo/comparativo-tributario",
        "/conteudo/gerador-rpa",
        "/politica-privacidade",
        "/termos",
      ],
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
