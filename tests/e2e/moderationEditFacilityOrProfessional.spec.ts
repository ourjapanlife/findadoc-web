import enUS from '../../i18n/locales/en.json' with { type: 'json' }
import { test, expect } from '@playwright/test'
import { skipOnboarding, shouldRunModerationTests, auth0Login } from './fixtures'

test.describe('Moderation facility and healthcare professional happy paths', () => {
    test.skip(!shouldRunModerationTests(),
              'Skipping moderation tests when Auth0 credentials are not set (skip login programmatically)')

    test.beforeEach(async ({ page }) => {
        await skipOnboarding(page)
        await auth0Login(page)
        await page.setViewportSize({ width: 1728, height: 1077 })
        await page.goto('/moderation')
        await page.waitForLoadState('networkidle')
        await expect(page.getByRole('button', { name: new RegExp(enUS.modDashboardLeftNav.forReview, 'i') })).toBeVisible()
    })

    test('facility edit supports update and update-and-exit', async ({ page }) => {
        await page.getByRole('combobox').first().selectOption({ label: enUS.modDashboardLeftNav.facilities })
        const firstFacility = page.locator('[data-testid^="mod-facility-list-item-"]').first()
        const hasFacility = await firstFacility.isVisible().catch(() => false)
        if (!hasFacility) {
            test.skip(true, 'No facility data to open (seed data may be empty)')
            return
        }

        await firstFacility.click()
        const nameEnInput = page.getByTestId('mod-facility-section-nameEn').locator('input')
        await expect(nameEnInput).toBeVisible()
        await nameEnInput.fill(`Playwright Facility ${Date.now()}`)

        await page.getByTestId('mod-edit-facility-hp-topbar-update').click()
        await expect(page.getByText(enUS.modEditFacilityOrHPTopbar.facilityUpdatedSuccessfully)).toBeVisible()

        await page.getByTestId('mod-edit-facility-hp-topbar-update-and-exit').click()
        await expect(page).toHaveURL(/\/moderation$/)
    })

    test('healthcare professional edit supports update and update-and-exit', async ({ page }) => {
        await page.getByRole('combobox').first().selectOption({ label: enUS.modDashboardLeftNav.healthcareProfessionals })
        const firstHealthcareProfessional = page.locator('[data-testid^="mod-healthcare-professional-list-item-"]').first()
        const hasHealthcareProfessional = await firstHealthcareProfessional.isVisible().catch(() => false)
        if (!hasHealthcareProfessional) {
            test.skip(true, 'No healthcare professional data to open (seed data may be empty)')
            return
        }

        await firstHealthcareProfessional.click()
        const noteInput = page.getByPlaceholder(enUS.modHealthcareProfessionalSection.placeholderAdditionalNotesForPatients)
        await expect(noteInput).toBeVisible()
        await noteInput.fill(`Playwright HP note ${Date.now()}`)

        await page.getByTestId('mod-edit-facility-hp-topbar-update').click()
        await expect(page.getByText(enUS.modEditFacilityOrHPTopbar.healthcareProfessionalUpdatedSuccessfully)).toBeVisible()

        await page.getByTestId('mod-edit-facility-hp-topbar-update-and-exit').click()
        await expect(page).toHaveURL(/\/moderation$/)
    })
})
