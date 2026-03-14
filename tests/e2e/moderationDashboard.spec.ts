import enUS from '../../i18n/locales/en.json'
import { test, expect } from '@playwright/test'
import { skipOnboarding, shouldRunModerationTests, auth0Login } from './fixtures'

test.describe('Moderation dashboard', () => {
    test.skip(!shouldRunModerationTests(),
              'Skipping moderation tests when Auth0 credentials are not set (skip login programmatically)')

    test.beforeEach(async ({ page }) => {
        await skipOnboarding(page)
        if (shouldRunModerationTests()) {
            await auth0Login(page)
        }
        await page.setViewportSize({ width: 1728, height: 1077 })
        await page.goto('/moderation')
        await expect(page.getByTestId('moderation-page')).toBeVisible({ timeout: 15000 })
    })

    test('shows submission type selector and can switch between Submissions, Facilities, Healthcare Professionals',
         async ({ page }) => {
             const submissionTypeSelect = page.getByTestId('submission-type-select')
             await expect(submissionTypeSelect).toBeVisible()

             await submissionTypeSelect.selectOption({ label: enUS.modDashboardLeftNav.facilities })
             await expect(submissionTypeSelect).toHaveValue('FACILITIES')
             await expect(page.getByRole('button', { name: new RegExp(enUS.modDashboardTopbar.addFacility, 'i') })).toBeVisible()

             await submissionTypeSelect.selectOption({ label: enUS.modDashboardLeftNav.healthcareProfessionals })
             await expect(submissionTypeSelect).toHaveValue('HEALTHCARE_PROFESSIONALS')
             await expect(page.getByRole('button', { name: new RegExp(enUS.modDashboardTopbar.addHealthcareProfessional, 'i') }))
                 .toBeVisible()

             await submissionTypeSelect.selectOption({ label: enUS.modDashboardLeftNav.submissions })
             await expect(submissionTypeSelect).toHaveValue('SUBMISSIONS')
         })

    test('shows left nav for submissions with For Review, Approved, Rejected',
         async ({ page }) => {
             await expect(page.getByRole('button', { name: new RegExp(enUS.modDashboardLeftNav.forReview, 'i') })).toBeVisible()
             await expect(page.getByRole('button', { name: new RegExp(enUS.modDashboardLeftNav.approved, 'i') })).toBeVisible()
             await expect(page.getByRole('button', { name: new RegExp(enUS.modDashboardLeftNav.rejected, 'i') })).toBeVisible()
         })
})
