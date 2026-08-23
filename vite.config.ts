import { defineConfig } from "vite";

/** Vite development and production-preview configuration for the Pages site. */
export default defineConfig({
    base: "/github-badge-layouts/",
    build: {
        emptyOutDir: true,
        outDir: "../dist/site",
        sourcemap: true,
        target: "es2024",
    },
    preview: {
        port: 4173,
        strictPort: true,
    },
    publicDir: "public",
    root: "docs",
    server: {
        port: 4173,
        strictPort: true,
    },
});
