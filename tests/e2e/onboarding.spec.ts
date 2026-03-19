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
            ).toBeVisible()
            await expect(
                page.getByText(/Find a Doc, Japan!/i)
            ).toBeVisible()
            await expect(
                page.getByRole('button', { name: new RegExp(enUS.onboarding.letsGoButtonText, 'i') })
            ).toBeVisible()
        })

        test('shows the hero subheading', async ({ page }) => {
            await expect(
                page.getByText(enUS.about.heroSubheading)
            ).toBeVisible()
        })
    })

    test.describe('Happy path: complete onboarding', () => {
        test('clicking Let\'s go shows loading then the main app (map)', async ({ page }) => {
            const letsGo = page.getByRole('button', { name: new RegExp(enUS.onboarding.letsGoButtonText, 'i') })
            await expect(letsGo).toBeVisible()

            await page.emulateMedia({ reducedMotion: 'reduce' })
            await letsGo.click()

            await expect(
                page.getByText(enUS.onboarding.searchloading)
            ).toBeVisible()

            await expect(
                page.getByRole('region', { name: 'Map' })
            ).toBeVisible()
        })

        test('after completing onboarding, home shows map and nav (not welcome)', async ({ page }) => {
            await page.emulateMedia({ reducedMotion: 'reduce' })
            await page.getByRole('button', { name: new RegExp(enUS.onboarding.letsGoButtonText, 'i') }).click()

            await expect(page.getByRole('region', { name: 'Map' })).toBeVisible()

            await expect(
                page.getByRole('heading', { name: /welcome to/i })
            ).not.toBeVisible()
            await expect(page.getByRole('navigation').first()).toBeVisible()
        })

        test('revisiting home after completing onboarding skips welcome (persisted state)', async ({ page }) => {
            await page.emulateMedia({ reducedMotion: 'reduce' })
            await page.getByRole('button', { name: new RegExp(enUS.onboarding.letsGoButtonText, 'i') }).click()
            await expect(page.getByRole('region', { name: 'Map' })).toBeVisible()

            await page.goto('/')

            await expect(page.getByRole('region', { name: 'Map' })).toBeVisible()
            await expect(
                page.getByRole('heading', { name: /welcome to/i })
            ).not.toBeVisible()
        })
    })
})
