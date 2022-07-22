import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import eslintPlugin from "vite-plugin-eslint";
import { VitePWA } from "vite-plugin-pwa";
import solidPlugin from "vite-plugin-solid";
import { viteStaticCopy } from "vite-plugin-static-copy";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    checker({ typescript: true }),
    tsconfigPaths(),
    eslintPlugin(),
    solidPlugin(),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/sql.js/dist/sql-wasm.wasm",
          dest: "assets",
        },
      ],
    }),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,db,wasm}"],
        maximumFileSizeToCacheInBytes: 54525952,
      },
    }),
  ],
  build: {
    target: "esnext",
    sourcemap: true,
    outDir: "./docs",
  },
});
