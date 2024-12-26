import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
import deploymentsJson from "./src/lib/deployments.json";

export default defineConfig({
  plugins: [sveltekit()],
  assetsInclude: ["**/openai/OnChainAI.js"],
  server: { open: true },
  define: { __DEPLOYMENTS_JSON__: deploymentsJson },
  logLevel: "info"
});
