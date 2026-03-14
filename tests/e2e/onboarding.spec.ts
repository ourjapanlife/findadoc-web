import enUS from '../../i18n/locales/en.json' with { type: 'json' }
import { test, expect } from '@playwright/test'

test.describe('Onboarding flow (new visitor)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    test.describe('Welcome screen', () => {
        test('shows the welcome screen for a new visitor', async ({ page }) => {
            await expect(
                page.getByRole('heading', { name: /welcome to/i })
            ).toBeVisible({ timeout: 10000 })
            await expect(
                page.getByText(/Find a Doc, Japan!/i)
            ).toBeVisible()
            await expect(
                page.getByTestId('onboarding-lets-go')
            ).toBeVisible()
        })

        test('shows the hero subheading', async ({ page }) => {
            await expect(
                page.getByText(enUS.about.heroSubheading)
            ).toBeVisible({ timeout: 10000 })
        })
    })

    test.describe('Happy path: complete onboarding', () => {
        test('clicking Let\'s go shows loading then the main app (map)', async ({ page }) => {
            await expect(
                page.getByTestId('onboarding-lets-go')
            ).toBeVisible({ timeout: 10000 })

            await page.getByTestId('onboarding-lets-go').click()

            await expect(
                page.getByText(enUS.onboarding.searchloading)
            ).toBeVisible({ timeout: 5000 })

            await expect(
                page.getByTestId('map-of-japan')
            ).toBeVisible({ timeout: 15000 })
        })

        test('after completing onboarding, home shows map and nav (not welcome)', async ({ page }) => {
            await page.getByTestId('onboarding-lets-go').click()

            await expect(page.getByTestId('map-of-japan')).toBeVisible({ timeout: 15000 })

            await expect(
                page.getByRole('heading', { name: /welcome to/i })
            ).not.toBeVisible()
            await expect(page.getByTestId('top-nav')).toBeVisible()
        })

        test('revisiting home after completing onboarding skips welcome (persisted state)', async ({ page }) => {
            await page.getByTestId('onboarding-lets-go').click()
            await expect(page.getByTestId('map-of-japan')).toBeVisible({ timeout: 15000 })

            await page.goto('/')

            await expect(page.getByTestId('map-of-japan')).toBeVisible({ timeout: 5000 })
            await expect(
                page.getByRole('heading', { name: /welcome to/i })
            ).not.toBeVisible()
        })
    })
})
