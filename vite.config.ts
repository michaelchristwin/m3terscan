import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";
import wasm from "vite-plugin-wasm";
import topLevelImport from "vite-plugin-top-level-await";

export default defineConfig({
  plugins: [solid(), tailwindcss(), wasm(), topLevelImport()],
});
