import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [sveltekit(), nodePolyfills()],
  assetsInclude: ["**/openai/OnChainAI.js"],
  server: { open: true },
  logLevel: "info"
});
