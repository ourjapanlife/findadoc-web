import enUS from '../../i18n/locales/en.json' with { type: 'json' }
import { test, expect } from '@playwright/test'

test.describe('Moderation dashboard', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1728, height: 1077 })
        await page.goto('/my-page')
        await page.waitForLoadState('domcontentloaded')
        await expect(page.getByTestId('mod-access-panel')).toBeVisible({ timeout: 30_000 })
        await expect(page.getByTestId('access-page-link-moderation-submissions')).toBeVisible({ timeout: 30_000 })
        await expect(page.getByRole('button', { name: new RegExp(enUS.modDashboardLeftNav.forReview, 'i') })).toBeVisible()
    })

    test('shows access panel and primary view navigation for Submissions, Facilities, Healthcare Professionals',
         async ({ page }) => {
             await expect(page.getByTestId('mod-access-panel')).toContainText(enUS.accessPanel.signedInAs)

             await page.getByTestId('access-page-link-moderation-facilities').click()
             await expect(page.getByRole('link', { name: new RegExp(enUS.modDashboardTopbar.addFacility, 'i') })).toBeVisible()

             await page.getByTestId('access-page-link-moderation-healthcare-professionals').click()
             await expect(page.getByRole('link', { name: new RegExp(enUS.modDashboardTopbar.addHealthcareProfessional, 'i') }))
                 .toBeVisible()

             await page.getByTestId('access-page-link-moderation-submissions').click()
             await expect(page.getByRole('button', { name: new RegExp(enUS.modDashboardLeftNav.forReview, 'i') })).toBeVisible()
         })

    test('shows scope link for read:submissions when granted', async ({ page }) => {
        await expect(page.getByTestId('access-page-link-moderation-submissions')).toBeVisible({ timeout: 30_000 })
    })

    test('shows left nav for submissions with For Review, Approved, Rejected',
         async ({ page }) => {
             await expect(page.getByRole('button', { name: new RegExp(enUS.modDashboardLeftNav.forReview, 'i') })).toBeVisible()
             await expect(page.getByRole('button', { name: new RegExp(enUS.modDashboardLeftNav.approved, 'i') })).toBeVisible()
             await expect(page.getByRole('button', { name: new RegExp(enUS.modDashboardLeftNav.rejected, 'i') })).toBeVisible()
         })
})
