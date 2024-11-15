import { type PlaywrightTestConfig, devices } from "@playwright/test";
// import { synpressFixtures } from "@synthetixio/synpress";

const config: PlaywrightTestConfig = {
  use: {
    baseURL: "http://localhost:5173", // Adresse du serveur SvelteKit
    viewport: null // Utilise les dimensions par défaut du navigateur
  },
  webServer: {
    // command: "npm run build && pnpm run preview",
    command: "npm run dev",
    port: 5173
    // timeout: 120 * 1000
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ],
  reporter: [["list"], ["html"]],
  testDir: "test",
  testMatch: /(.+\.)?(test|spec)\.[jt]s/
};

export default config;
