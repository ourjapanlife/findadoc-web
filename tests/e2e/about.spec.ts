import enUS from '../../i18n/locales/en.json' with { type: 'json' }
import { test, expect } from '@playwright/test'
import { skipOnboarding } from './fixtures'

test.describe('About page', () => {
    test.describe('Desktop resolution', () => {
        test.beforeEach(async ({ page }) => {
            await skipOnboarding(page)
            await page.setViewportSize({ width: 1728, height: 1077 })
            await page.goto('/about')
        })

        test('shows the desktop top nav', async ({ page }) => {
            await expect(page.getByRole('navigation').first()).toBeVisible()
        })

        test('does not show the hamburger on desktop', async ({ page }) => {
            await expect(page.getByRole('button', { name: /menu/i })).toBeHidden()
        })

        test('has the hero heading', async ({ page }) => {
            await expect(page.getByRole('heading', { name: enUS.about.heroHeading })).toBeVisible()
        })

        test('has the hero subheading', async ({ page }) => {
            await expect(page.getByText(enUS.about.heroSubheading)).toBeVisible()
        })

        test('shows member details', async ({ page }) => {
            await expect(page.getByRole('img').first()).toBeVisible()
            await expect(page.getByText(/linkedin|github/i).first()).toBeVisible()
        })

        test('shows the footer', async ({ page }) => {
            await expect(page.getByRole('contentinfo').or(page.locator('footer'))).toBeVisible()
        })
    })

    test.describe('Portrait mode', () => {
        test.beforeEach(async ({ page }) => {
            await skipOnboarding(page)
            await page.setViewportSize({ width: 320, height: 568 })
            await page.goto('/about')
        })

        test('shows the hamburger', async ({ page }) => {
            await expect(page.getByRole('button', { name: /menu/i })).toBeVisible()
        })

        test('shows member details with external links', async ({ page }) => {
            const linkedin = page.getByRole('link', { name: /linkedin/i }).first()
            await expect(linkedin).toHaveAttribute('href', /linkedin\.com/)
            const github = page.getByRole('link', { name: /github/i }).first()
            await expect(github).toHaveAttribute('href', /github\.com/)
        })
    })
})
