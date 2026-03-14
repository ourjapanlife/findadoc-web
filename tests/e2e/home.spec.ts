import { test, expect } from '@playwright/test'
import { skipOnboarding } from './fixtures'

test.describe('Home page', () => {
    test.describe('Landscape mode', () => {
        test.beforeEach(async ({ page }) => {
            await skipOnboarding(page)
            await page.setViewportSize({ width: 1728, height: 1077 })
            await page.goto('/')
        })

        test('displays the logo', async ({ page }) => {
            await expect(page.getByRole('img', { name: /Find a Doc Japan/i }).first()).toBeVisible()
        })

        test('renders the map', async ({ page }) => {
            await expect(page.getByTestId('map-of-japan')).toBeVisible()
        })

        test('does not show the hamburger on desktop', async ({ page }) => {
            await expect(page.getByRole('button', { name: /menu/i })).toBeHidden()
        })

        test('footer links are present', async ({ page }) => {
            await expect(page.getByRole('link', { name: /privacy/i })).toBeVisible()
            await expect(page.getByRole('link', { name: /github/i })).toHaveAttribute('href', /github\.com\/ourjapanlife\/findadoc-web/)
        })

        test('navigates to privacy policy', async ({ page }) => {
            await page.getByRole('link', { name: /privacy/i }).click()
            await expect(page).toHaveURL(/\/privacypolicy/)
        })
    })

    test.describe('Portrait mode', () => {
        test.beforeEach(async ({ page }) => {
            await skipOnboarding(page)
            await page.setViewportSize({ width: 320, height: 568 })
            await page.goto('/')
        })

        test('shows the logo', async ({ page }) => {
            await expect(page.getByRole('img', { name: /Find a Doc Japan/i }).first()).toBeVisible()
        })

        test('renders the map', async ({ page }) => {
            await expect(page.getByTestId('map-of-japan')).toBeVisible()
        })

        test('shows the hamburger icon', async ({ page }) => {
            await expect(page.getByRole('button', { name: /menu/i })).toBeVisible()
        })
    })
})
