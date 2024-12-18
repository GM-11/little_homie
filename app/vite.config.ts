///@ts-ignore
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import inject from "@rollup/plugin-inject";
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

  // optimizeDeps: {
  //   include: ["@project-serum/anchor", "@solana/web3.js", "buffer"],
  //   esbuildOptions: {
  //     target: "esnext",
  //     plugins: [NodeGlobalsPolyfillPlugin({ buffer: true })],
  //   },
  // },
  // resolve: {
  //   alias: {
  //     $utils: "./src/utils/",
  //     stream: "rollup-plugin-node-polyfills/polyfills/stream",
  //   },
  // },
  // define: {
  //   "process.env.BROWSER": true,
  //   "process.env.NODE_DEBUG": JSON.stringify(""),
  // },
  // build: {
  //   target: "esnext",
  //   commonjsOptions: {
  //     transformMixedEsModules: true,
  //   },
  //   rollupOptions: {
  //     plugins: [
  //       inject({ Buffer: ["buffer", "Buffer"] }),
  //       inject({ process: ["process-es6"], crypto: ["crypto"] }),
  //     ],
  //   },
  // },
});
