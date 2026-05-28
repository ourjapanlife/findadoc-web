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

        await page.getByTestId('mod-edit-facility-hp-topbar-update').click()
        const facilityToastPattern = moderationSuccessToastPattern(
            enUS.modEditFacilityOrHPTopbar.facilityUpdatedSuccessfully,
            'modEditFacilityOrHPTopbar.facilityUpdatedSuccessfully'
        )
        await expect(page.getByRole('alert').filter({ hasText: facilityToastPattern })).toBeVisible()
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

        await page.getByTestId('mod-edit-facility-hp-topbar-update-and-exit').click()
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
        const hpToastPattern = moderationSuccessToastPattern(
            enUS.modEditFacilityOrHPTopbar.healthcareProfessionalUpdatedSuccessfully,
            'modEditFacilityOrHPTopbar.healthcareProfessionalUpdatedSuccessfully'
        )
        await expect(page.getByRole('alert').filter({ hasText: hpToastPattern })).toBeVisible()
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

        await page.getByTestId('mod-edit-facility-hp-topbar-update-and-exit').click()
        await expect(page).toHaveURL(/\/my-page\?view=healthcare-professionals$/)
    })
})
