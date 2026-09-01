import { test, expect } from '@playwright/test'
import { skipOnboarding } from './fixtures'

test.describe('Search filter URL sync', () => {
    test.use({ actionTimeout: 30000 })

    const assertionTimeout = 30000

    test.beforeEach(async ({ page }) => {
        await skipOnboarding(page)
        await page.setViewportSize({ width: 320, height: 568 })
    })

    test('restores supported filters from a shared URL', async ({ page }) => {
        await page.goto('/?specialty=pediatrics&language=en')

        await expect(page).toHaveURL(/specialty=pediatrics/)
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex')

        await expect(page.locator('[data-testid="filters-panel-container"] .search-specialty select'))
            .toHaveValue('PEDIATRICS', { timeout: assertionTimeout })
        await expect(page.locator('[data-testid="filters-panel-container"] .search-language select'))
            .toHaveValue('en_US', { timeout: assertionTimeout })
    })

    test('syncs selected filters to the URL and restores history state', async ({ page }) => {
        await page.goto('/')

        await expect(page.getByText('Loading')).toBeHidden({ timeout: assertionTimeout })
        await page.getByTestId('filters-panel-summary').click()
        await page.locator('[data-testid="filters-panel-container"] .search-specialty select')
            .selectOption('PEDIATRICS')
        await page.getByTestId('search-button').click()

        await expect(page).toHaveURL(/specialty=pediatrics/, { timeout: 30000 })

        await page.goBack()
        await expect(page).not.toHaveURL(/specialty=/, { timeout: assertionTimeout })

        await page.goForward()
        await expect(page).toHaveURL(/specialty=pediatrics/, { timeout: assertionTimeout })

        await expect(page.getByText('Loading')).toBeHidden({ timeout: assertionTimeout })
        await page.getByTestId('filters-panel-summary').click()
        await expect(page.locator('[data-testid="filters-panel-container"] .search-specialty select'))
            .toHaveValue('PEDIATRICS', { timeout: assertionTimeout })
    })
})
