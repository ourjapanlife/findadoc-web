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

    test('shows the representative, certification date, address note and activities', async ({ page }) => {
        await page.goto('/npo')
        await expect(page.getByTestId('npo-representative')).toContainText('Russell James Miller')
        await expect(page.getByTestId('npo-representative')).toContainText(enUS.npoPage.representativeRole)
        await expect(page.getByTestId('npo-certified')).toHaveText(enUS.npoPage.certifiedDate)
        await expect(page.getByTestId('npo-address')).toHaveText(enUS.npoPage.addressValue)
        await expect(page.getByTestId('npo-activities')).toHaveText(enUS.npoPage.activitiesValue)
    })

    test('gives a findadoc.jp email as the contact, not a form', async ({ page }) => {
        await page.goto('/npo')
        await expect(page.getByTestId('npo-contact-email')).toHaveAttribute('href', 'mailto:contact@findadoc.jp')
        await expect(page.locator('a[href*="forms.gle"]')).toHaveCount(0)
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
