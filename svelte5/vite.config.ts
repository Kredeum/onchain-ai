import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
// import { nodePolyfills } from "vite-plugin-node-polyfills";
// plugins: [sveltekit(), nodePolyfills()],

export default defineConfig({
  plugins: [sveltekit()],
  assetsInclude: ["**/openai/OnChainAI.js"],
  server: { open: true },
  logLevel: "info"
});
