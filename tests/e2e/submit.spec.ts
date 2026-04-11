import enUS from '../../i18n/locales/en.json' with { type: 'json' }
import { test, expect } from '@playwright/test'
import { skipOnboarding } from './fixtures'

test.describe('Submit page', () => {
    test.describe('Desktop resolution', () => {
        test.beforeEach(async ({ page }) => {
            await skipOnboarding(page)
            await page.setViewportSize({ width: 1728, height: 1077 })
            await page.goto('/submit')
            await page.getByRole('combobox').first().selectOption('en_US')
        })

        test('shows the desktop top nav', async ({ page }) => {
            await expect(page.getByRole('navigation').first()).toBeVisible()
        })

        test('does not show the hamburger on desktop', async ({ page }) => {
            await expect(page.getByRole('button', { name: /menu/i })).toBeHidden()
        })

        test('has the heading', async ({ page }) => {
            await expect(page.getByRole('heading', { name: enUS.submitPage.heading })).toBeVisible()
        })

        test('has the subheading', async ({ page }) => {
            await expect(page.getByText(enUS.submitPage.subheading)).toBeVisible()
        })

        test('has form fields for location, last name, first name and submit button', async ({ page }) => {
            await expect(page.getByPlaceholder(enUS.submitPage.location)).toBeVisible()
            await expect(page.getByPlaceholder(enUS.submitPage.lastName)).toBeVisible()
            await expect(page.getByPlaceholder(enUS.submitPage.firstName)).toBeVisible()
            await expect(page.getByRole('button', { name: enUS.submitPage.submitButton })).toBeVisible()
        })

        test('does not submit an incomplete form', async ({ page }) => {
            await page.getByRole('button', { name: enUS.submitPage.submitButton }).click()
            await expect(page.getByText(enUS.submitPage.submissionSuccessful)).not.toBeVisible()
        })

        test('requires a URL starting with https://', async ({ page }) => {
            const urlInput = page.getByPlaceholder(enUS.submitPage.location)
            await urlInput.fill('http://example.com')
            await urlInput.blur()
            await expect(page.getByText(enUS.submitPage.googleMapsValidation)).toBeVisible()
        })

        test('requires Spoken Language 1 to be selected', async ({ page }) => {
            await expect(page.getByText(enUS.submitPage.spokenLanguageValidation)).toBeHidden()
            await page.getByRole('button', { name: enUS.submitPage.submitButton }).click()
            await expect(page.getByText(enUS.submitPage.spokenLanguageValidation)).toBeVisible()
            await page.getByRole('combobox').first().selectOption('ja_JP')
            await expect(page.getByText(enUS.submitPage.spokenLanguageValidation)).toBeHidden()
        })
    })

    test.describe('Portrait mode', () => {
        test.beforeEach(async ({ page }) => {
            await skipOnboarding(page)
            await page.setViewportSize({ width: 320, height: 568 })
            await page.goto('/submit')
        })

        test('shows the hamburger', async ({ page }) => {
            await expect(page.getByRole('button', { name: /menu/i })).toBeVisible()
        })
    })
})
