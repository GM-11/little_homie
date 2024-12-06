///@ts-ignore
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    sveltekit(),
    nodePolyfills({
      protocolImports: true,
    }),
  ],
  build: {
    rollupOptions: {
      external: ["react", "react-dom"],
    },
  },
});