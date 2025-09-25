// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. */
  reporter: 'html',
  timeout: 1000 * 60 * 3,  // 3 minutes


  use: {
    trace: 'on-first-retry',
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 720 },
    args: ['--start-maximized'],   // Force maximize
  },

  // projects: [
  //   // ✅ Desktop Chrome (maximized)
  //   {
  //     name: 'Desktop Chrome',
  //     use: {
  //       ...devices['Desktop Chrome'],
  //       viewport: {width:,height: },                  // Disable fixed viewport
  //       launchOptions: {
  //         args: ['--start-maximized'],   // Force maximize
  //       },
  //     },
  //   },

    // // ✅ Latest Google Pixel (Pixel 8)
    // {
    //   name: 'Mobile Chrome - Pixel 8',
    //   use: { ...devices['Pixel 8'] },
    // },

    // // ✅ Latest iPhone (iPhone 15 Pro)
    // {
    //   name: 'Mobile Safari - iPhone 15 Pro',
    //   use: { ...devices['iPhone 15 Pro'] },
    // },
  // ],
});
