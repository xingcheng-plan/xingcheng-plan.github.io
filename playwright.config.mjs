import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4322',
    channel: 'chrome',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://127.0.0.1:4322/',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
