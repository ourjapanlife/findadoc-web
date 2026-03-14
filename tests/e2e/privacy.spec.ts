import { test, expect } from '@playwright/test'
import { skipOnboarding } from './fixtures'

test.describe('Privacy Policy page', () => {
    test.describe('Landscape resolution', () => {
        test.beforeEach(async ({ page }) => {
            await skipOnboarding(page)
            await page.setViewportSize({ width: 1728, height: 1077 })
            await page.goto('/privacypolicy')
        })

        test('shows the desktop top nav', async ({ page }) => {
            await expect(page.getByRole('navigation').first()).toBeVisible()
        })

        test('does not show the hamburger on desktop', async ({ page }) => {
            await expect(page.getByRole('button', { name: /menu/i })).toBeHidden()
        })

        test('has a heading', async ({ page }) => {
            await expect(page.getByRole('heading', { name: /privacy/i })).toBeVisible()
        })

        test('shows the footer', async ({ page }) => {
            await expect(page.getByRole('contentinfo').or(page.locator('footer'))).toBeVisible()
        })
    })

    test.describe('Portrait mode', () => {
        test.beforeEach(async ({ page }) => {
            await skipOnboarding(page)
            await page.setViewportSize({ width: 320, height: 568 })
            await page.goto('/privacypolicy')
        })

        test('shows the hamburger', async ({ page }) => {
            await expect(page.getByRole('button', { name: /menu/i })).toBeVisible()
        })
    })
})
