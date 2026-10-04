import { defineConfig, devices } from "@playwright/test";

// Each project runs against a different static build (see scripts/build-e2e.mjs).
const PREVIEW_PORT = 4100;
const PRODUCTION_PORT = 4101;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    ...devices["Desktop Chrome"],
    trace: "retain-on-failure",
  },
  projects: [
    { name: "preview", use: { baseURL: `http://localhost:${PREVIEW_PORT}` } },
    { name: "production", use: { baseURL: `http://localhost:${PRODUCTION_PORT}` } },
  ],
  webServer: [
    {
      command: `node scripts/serve-static.mjs .e2e/preview ${PREVIEW_PORT}`,
      port: PREVIEW_PORT,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `node scripts/serve-static.mjs .e2e/production ${PRODUCTION_PORT}`,
      port: PRODUCTION_PORT,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
