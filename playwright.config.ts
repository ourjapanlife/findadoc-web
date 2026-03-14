import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    webServer: {
        command: 'yarn dev:e2e',
        url: 'http://localhost:4242',
        reuseExistingServer: true,
        timeout: 120000
    },
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 2 : undefined,
    reporter: process.env.CI ? [['json', { outputFile: 'results.json' }], ['html', { outputFolder: 'playwright-report' }]] : 'html',
    use: {
        baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:4242',
        trace: 'on-first-retry',
        actionTimeout: 10000,
        navigationTimeout: 30000
    },
    timeout: 60000,
    expect: { timeout: 10000 },
    projects: process.env.CI
        ? [
            { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
            { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
            { name: 'webkit', use: { ...devices['Desktop Safari'] } }
        ]
        : [
            { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
        ]
})
