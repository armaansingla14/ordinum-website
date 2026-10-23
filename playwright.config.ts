import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

// Some machines need extra shared libraries for the bundled Chromium.
// Point PLAYWRIGHT_CHROMIUM_LIBS at them; it is prepended to LD_LIBRARY_PATH.
const chromiumLibs = process.env.PLAYWRIGHT_CHROMIUM_LIBS;
const launchEnv = chromiumLibs
  ? {
      ...(process.env as Record<string, string>),
      LD_LIBRARY_PATH: [chromiumLibs, process.env.LD_LIBRARY_PATH].filter(Boolean).join(":"),
    }
  : undefined;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  timeout: 120_000,
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    launchOptions: launchEnv ? { env: launchEnv } : undefined,
  },
  projects: [
    {
      name: "site",
      testMatch: /site\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "screenshots",
      testMatch: /screenshots\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // Requires a prior `npm run build`.
    command: `npm run start -- -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 120_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
