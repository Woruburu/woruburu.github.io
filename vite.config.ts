import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import eslintPlugin from "vite-plugin-eslint";
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
  ],
  build: {
    target: "esnext",
    sourcemap: true,
    outDir: './docs'
  },
});
