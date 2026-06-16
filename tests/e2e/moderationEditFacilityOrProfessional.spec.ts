import enUS from '../../i18n/locales/en.json' with { type: 'json' }
import { test, expect } from '@playwright/test'
import { moderationSuccessToastPattern } from './fixtures'

test.describe('Moderation facility and healthcare professional happy paths', () => {
    test.describe.configure({ mode: 'serial', timeout: 120_000 })
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1728, height: 1077 })
        await page.goto('/my-page?view=submissions')
        await page.waitForLoadState('domcontentloaded')
        await expect(page.getByTestId('access-page-link-moderation-submissions')).toBeVisible({ timeout: 30_000 })
        await expect(page.getByRole('button', { name: new RegExp(enUS.modDashboardLeftNav.forReview, 'i') })).toBeVisible()
    })

    test('facility edit: update shows success toast', async ({ page }) => {
        await page.getByTestId('access-page-link-moderation-facilities').click()
        const firstFacility = page.locator('[data-testid^="mod-facility-list-item-"]').first()
        await expect(firstFacility).toBeVisible()

        await firstFacility.click()
        await expect(page.getByTestId('mod-access-panel')).toBeVisible()
        await expect(page.getByTestId('access-page-link-moderation-facilities')).toBeVisible()
        const nameEnInput = page.getByTestId('mod-facility-section-nameEn').locator('input')
        await expect(nameEnInput).toBeVisible()
        await nameEnInput.fill(`Playwright Facility ${Date.now()}`)

        // 1. Submit the form updates
        await page.getByTestId('mod-edit-facility-hp-topbar-update').click()

        // 2. 🛡️ Network Guard: Wait for backend network requests to settle down
        await page.waitForLoadState('networkidle')

        // 3. Resolve the expected i18n text pattern for the toast notification
        const facilityToastPattern = moderationSuccessToastPattern(
            enUS.modEditFacilityOrHPTopbar.facilityUpdatedSuccessfully,
            'modEditFacilityOrHPTopbar.facilityUpdatedSuccessfully'
        )

        // 4. 🛑 Explicit Asynchronous DOM Wait: Hold the thread until the alert paints on screen
        const alertElement = page.getByRole('alert').filter({ hasText: facilityToastPattern })
        await alertElement.waitFor({ state: 'visible', timeout: 15000 })

        // 5. Assert visibility safely
        await expect(alertElement).toBeVisible()
    })

    test('facility edit: update-and-exit returns to moderation dashboard', async ({ page }) => {
        await page.getByTestId('access-page-link-moderation-facilities').click()
        const firstFacility = page.locator('[data-testid^="mod-facility-list-item-"]').first()
        await expect(firstFacility).toBeVisible()

        await firstFacility.click()
        await expect(page.getByTestId('mod-access-panel')).toBeVisible()
        await expect(page.getByTestId('access-page-link-moderation-facilities')).toBeVisible()
        const nameEnInput = page.getByTestId('mod-facility-section-nameEn').locator('input')
        await expect(nameEnInput).toBeVisible()
        await nameEnInput.fill(`Playwright Facility exit ${Date.now()}`)

        // 1. Trigger the update and exit action
        await page.getByTestId('mod-edit-facility-hp-topbar-update-and-exit').click()

        // 2. 🛡️ Network Guard: Wait for submission and redirection routing to settle
        await page.waitForLoadState('networkidle')

        // 3. Assert the redirection safely using the updated route from main
        await expect(page).toHaveURL(/\/my-page\?view=facilities$/)
    })

    test('healthcare professional edit: update shows success toast', async ({ page }) => {
        await page.getByTestId('access-page-link-moderation-healthcare-professionals').click()
        const firstHealthcareProfessional = page.locator('[data-testid^="mod-healthcare-professional-list-item-"]').first()
        await expect(firstHealthcareProfessional).toBeVisible()

        await firstHealthcareProfessional.click()
        await expect(page.getByTestId('mod-access-panel')).toBeVisible()
        await expect(page.getByTestId('access-page-link-moderation-healthcare-professionals')).toBeVisible()
        const noteInput = page.getByPlaceholder(enUS.modHealthcareProfessionalSection.placeholderAdditionalNotesForPatients)
        await expect(noteInput).toBeVisible()
        await noteInput.fill(`Playwright HP note ${Date.now()}`)

        const hpUpdate = page.getByTestId('mod-edit-facility-hp-topbar-update')
        await expect(hpUpdate).toBeEnabled()
        await hpUpdate.click()

        // 1. 🛡️ Network Guard: Wait for backend network requests to settle down
        await page.waitForLoadState('networkidle')

        // 2. Resolve the expected i18n text pattern for the healthcare professional toast
        const hpToastPattern = moderationSuccessToastPattern(
            enUS.modEditFacilityOrHPTopbar.healthcareProfessionalUpdatedSuccessfully,
            'modEditFacilityOrHPTopbar.healthcareProfessionalUpdatedSuccessfully'
        )

        // 3. 🛑 Explicit Asynchronous DOM Wait: Hold the thread until the alert paints on screen
        const alertElement = page.getByRole('alert').filter({ hasText: hpToastPattern })
        await alertElement.waitFor({ state: 'visible', timeout: 10000 })

        // 4. Assert visibility safely
        await expect(alertElement).toBeVisible()
    })

    test('healthcare professional edit: update-and-exit returns to moderation dashboard', async ({ page }) => {
        await page.getByTestId('access-page-link-moderation-healthcare-professionals').click()
        const firstHealthcareProfessional = page.locator('[data-testid^="mod-healthcare-professional-list-item-"]').first()
        await expect(firstHealthcareProfessional).toBeVisible()

        await firstHealthcareProfessional.click()
        await expect(page.getByTestId('mod-access-panel')).toBeVisible()
        await expect(page.getByTestId('access-page-link-moderation-healthcare-professionals')).toBeVisible()
        const noteInput = page.getByPlaceholder(enUS.modHealthcareProfessionalSection.placeholderAdditionalNotesForPatients)
        await expect(noteInput).toBeVisible()
        await noteInput.fill(`Playwright HP note exit ${Date.now()}`)

        // 1. Trigger the update and exit action
        await page.getByTestId('mod-edit-facility-hp-topbar-update-and-exit').click()

        // 2. 🛡️ Network Guard: Wait for submission and redirection routing to settle
        await page.waitForLoadState('networkidle')

        // 3. Assert the redirection safely using the updated route from main
        await expect(page).toHaveURL(/\/my-page\?view=healthcare-professionals$/)
    })
})
