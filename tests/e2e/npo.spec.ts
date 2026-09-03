import enUS from '../../i18n/locales/en.json' with { type: 'json' }
import { test, expect } from '@playwright/test'

test.describe('NPO disclosure page', () => {
    test('is reachable from the footer on desktop', async ({ page }) => {
        await page.setViewportSize({ width: 1728, height: 1077 })
        await page.goto('/about')
        await page.getByTestId('npo-link').click()
        await expect(page).toHaveURL(/\/npo/)
    })

    test('shows the registered name and registration number', async ({ page }) => {
        await page.goto('/npo')
        await expect(page.getByTestId('npo-entity-name')).toHaveText(enUS.footer.copyright)
        await expect(page.getByTestId('npo-registration-number')).toHaveText('9011005010215')
    })

    test('the registration number is plain text, not a link', async ({ page }) => {
        await page.goto('/npo')
        await expect(page.getByTestId('npo-registration-number').locator('a')).toHaveCount(0)
    })

    test('links the balance sheet', async ({ page }) => {
        await page.goto('/npo')
        await expect(page.getByTestId('npo-document-balance-sheet')).toHaveAttribute('href', /docs\.google\.com/)
    })

    test('is reachable on mobile, where these disclosures used to be desktop-invisible', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 })
        await page.goto('/about')
        await expect(page.getByTestId('npo-link')).toBeVisible()
    })
})
