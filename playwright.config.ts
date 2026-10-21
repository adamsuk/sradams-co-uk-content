/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from '@playwright/test';

// Smoke + visual tests against the static export in out/ (run `npm run build` first).
// Network is mocked in e2e/fixtures.ts so screenshots don't depend on live content.
// Baselines live in e2e/__screenshots__ and must be generated in CI's Playwright
// container (see the e2e job in .github/workflows/cloudflare-deploy.yml) to match fonts.
export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{arg}{ext}',
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled', caret: 'hide' },
  },
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    colorScheme: 'light',
    timezoneId: 'Europe/London',
    locale: 'en-GB',
    // Local runs can point at an installed Chrome; CI uses the container's browser.
    launchOptions: process.env.PW_CHROMIUM_PATH
      ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
  },
  projects: [
    { name: 'desktop', use: { browserName: 'chromium', viewport: { width: 1280, height: 900 } } },
    {
      name: 'mobile',
      use: {
        browserName: 'chromium', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
      },
    },
  ],
  webServer: {
    command: 'node e2e/serve.js',
    url: 'http://127.0.0.1:4173/',
    reuseExistingServer: !process.env.CI,
  },
});
