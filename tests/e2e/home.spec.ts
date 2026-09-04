import enUS from '../../i18n/locales/en.json' with { type: 'json' }
import { test, expect } from '@playwright/test'

test.describe('Home page', () => {
    test.describe('Landscape mode', () => {
        test.beforeEach(async ({ page }) => {
            await page.setViewportSize({ width: 1728, height: 1077 })
            await page.goto('/')
        })

        test('shows the value proposition immediately, with no onboarding gate', async ({ page }) => {
            await expect(page.getByTestId('home-heading')).toHaveText(enUS.home.heroHeading)
        })

        test('displays the logo', async ({ page }) => {
            await expect(page.getByRole('img', { name: /Find a Doc, Japan/i }).first()).toBeVisible()
        })

        test('offers a search entry without loading the map', async ({ page }) => {
            await expect(page.getByTestId('home-search-entry')).toBeVisible()
            await expect(page.getByRole('region', { name: 'Map' })).toHaveCount(0)
        })

        test('does not show the hamburger on desktop', async ({ page }) => {
            await expect(page.getByRole('button', { name: /menu/i })).toBeHidden()
        })

        test('footer links are present', async ({ page }) => {
            await expect(page.getByRole('link', { name: /privacy/i })).toBeVisible()
            await expect(page.getByTestId('npo-link')).toBeVisible()
            // Contribute points at the docs site, not at one of several repos.
            await expect(page.getByTestId('contribute-link')).toHaveAttribute('href', /docs\.findadoc\.jp/)
        })

        test('navigates to privacy policy', async ({ page }) => {
            await page.getByRole('link', { name: /privacy/i }).click()
            await expect(page).toHaveURL(/\/privacypolicy/)
        })

        test('the search entry carries its filters into the URL', async ({ page }) => {
            await page.getByTestId('home-specialty').selectOption('DENTISTRY')
            await page.getByTestId('home-language').selectOption('en_US')
            await page.getByTestId('home-area').selectOption('Tokyo')
            await page.getByTestId('home-search-submit').click()

            await expect(page).toHaveURL(/\/search\?/)
            const url = new URL(page.url())
            expect(url.searchParams.get('specialty')).toBe('DENTISTRY')
            expect(url.searchParams.get('language')).toBe('en_US')
            expect(url.searchParams.get('prefecture')).toBe('Tokyo')
        })

        /*
         * The homepage is prerendered, so the form is clickable before Vue hydrates.
         * Submitting at that moment must still reach /search with the filters rather
         * than firing a native GET back to "/" — this is what a fast user hits.
         */
        test('the search entry works before hydration', async ({ page }) => {
            await page.goto('/', { waitUntil: 'commit' })
            await page.getByTestId('home-specialty').selectOption('DENTISTRY')
            await page.getByTestId('home-area').selectOption('Tokyo')
            await page.getByTestId('home-search-submit').click()

            await expect(page).toHaveURL(/\/search\?/)
            const url = new URL(page.url())
            expect(url.searchParams.get('specialty')).toBe('DENTISTRY')
            expect(url.searchParams.get('prefecture')).toBe('Tokyo')
        })

        test('a category tile links into a filtered search', async ({ page }) => {
            await page.getByTestId('home-category-DENTAL').click()
            await expect(page).toHaveURL(/\/search\?specialty=DENTISTRY/)
        })

        test('an area link filters by prefecture', async ({ page }) => {
            await page.getByTestId('home-prefecture-Tokyo').click()
            await expect(page).toHaveURL(/\/search\?prefecture=Tokyo/)
        })

        test('links to the submission form', async ({ page }) => {
            await page.getByTestId('home-contribute-cta').click()
            await expect(page).toHaveURL(/\/submit/)
        })
    })

    test.describe('Portrait mode', () => {
        test.beforeEach(async ({ page }) => {
            await page.setViewportSize({ width: 320, height: 568 })
            await page.goto('/')
        })

        test('shows the logo', async ({ page }) => {
            await expect(page.getByRole('img', { name: /Find a Doc, Japan/i }).first()).toBeVisible()
        })

        test('shows the heading and search entry', async ({ page }) => {
            await expect(page.getByTestId('home-heading')).toBeVisible()
            await expect(page.getByTestId('home-search-entry')).toBeVisible()
        })

        test('shows the hamburger icon', async ({ page }) => {
            await expect(page.getByRole('button', { name: /menu/i })).toBeVisible()
        })
    })
})
