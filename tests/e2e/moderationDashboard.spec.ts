import enUS from '../../i18n/locales/en.json' with { type: 'json' }
import { test, expect } from '@playwright/test'

test.describe('Moderation dashboard', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1728, height: 1077 })
        await page.goto('/moderation')
        await page.waitForLoadState('domcontentloaded')
        await expect(page.getByTestId('submission-type-select')).toBeVisible()
        await expect(page.getByRole('button', { name: new RegExp(enUS.modDashboardLeftNav.forReview, 'i') })).toBeVisible()
    })

    test('shows submission type selector and can switch between Submissions, Facilities, Healthcare Professionals',
         async ({ page }) => {
             const submissionTypeSelect = page.getByTestId('submission-type-select')
             await expect(submissionTypeSelect).toBeVisible()

             await submissionTypeSelect.selectOption({ label: enUS.modDashboardLeftNav.facilities })
             await expect(submissionTypeSelect).toHaveValue('FACILITIES')
             await expect(page.getByRole('link', { name: new RegExp(enUS.modDashboardTopbar.addFacility, 'i') })).toBeVisible()

             await submissionTypeSelect.selectOption({ label: enUS.modDashboardLeftNav.healthcareProfessionals })
             await expect(submissionTypeSelect).toHaveValue('HEALTHCARE_PROFESSIONALS')
             await expect(page.getByRole('link', { name: new RegExp(enUS.modDashboardTopbar.addHealthcareProfessional, 'i') }))
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
