import { type PlaywrightTestConfig, devices } from "@playwright/test";
// import { synpressFixtures } from "@synthetixio/synpress";

const config: PlaywrightTestConfig = {
  workers: 1,
  fullyParallel: false,
  use: {
    baseURL: "http://localhost:5173"
  },
  webServer: {
    // reuseExistingServer: true,
    command: "pnpm run dev",
    port: 5173
  },
  ///////////////
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
