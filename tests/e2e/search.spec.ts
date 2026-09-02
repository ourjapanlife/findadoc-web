import { test, expect } from '@playwright/test'

test.describe('Search page', () => {
    test.describe('Landscape mode', () => {
        test.beforeEach(async ({ page }) => {
            await page.setViewportSize({ width: 1728, height: 1077 })
        })

        test('renders the map', async ({ page }) => {
            await page.goto('/search')
            await expect(page.getByRole('region', { name: 'Map' })).toBeVisible()
        })

        test('shows the top nav over the map', async ({ page }) => {
            await page.goto('/search')
            await expect(page.getByTestId('top-nav')).toBeVisible()
        })

        /*
         * The homepage hands its filters over as query params. These assert the page
         * accepts them; the result set itself depends on the API and is covered by the
         * store's unit tests.
         */
        test('accepts specialty, language and prefecture from the URL', async ({ page }) => {
            await page.goto('/search?specialty=DENTISTRY&language=en_US&prefecture=Tokyo')
            await expect(page.getByTestId('search-page')).toBeVisible()
            await expect(page).toHaveURL(/specialty=DENTISTRY/)
        })

        test('ignores a specialty that is not a real enum value', async ({ page }) => {
            await page.goto('/search?specialty=NOT_A_SPECIALTY')
            await expect(page.getByTestId('search-page')).toBeVisible()
        })
    })

    test.describe('Portrait mode', () => {
        test('renders the map', async ({ page }) => {
            await page.setViewportSize({ width: 320, height: 568 })
            await page.goto('/search')
            await expect(page.getByRole('region', { name: 'Map' })).toBeVisible()
        })
    })
})
