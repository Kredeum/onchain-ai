import { type PlaywrightTestConfig, devices } from "@playwright/test";
// import { synpressFixtures } from "@synthetixio/synpress";

const config: PlaywrightTestConfig = {
  use: {
    baseURL: "http://localhost:5173"
    // video: {
    //   mode: "on",
    //   size: { width: 1280, height: 720 }
    // },
    // viewport: null, // Use default browser dimensions
    // launchOptions: {
    //   slowMo: 100 // Slow test actions of 100ms
    // }
  },
  webServer: {
    command: "pnpm run dev",
    // command: "pnpm run build && pnpm run preview",
    port: 5173,
    reuseExistingServer: true // If "pnpm run preview" running, doesn't re-build project
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
