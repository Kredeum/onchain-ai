import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [sveltekit()],
  assetsInclude: ["**/openai/OnChainAI.js"],
  server: { open: true },
  logLevel: "info"
});
