import enUS from '../../i18n/locales/en.json' with { type: 'json' }
import { test, expect, type Page } from '@playwright/test'

async function navigateToFirstSubmissionEditPage(page: Page) {
    await page.getByTestId('access-page-link-moderation-submissions').click()
    const firstSubmission = page.locator('[data-testid^="mod-submission-list-item-"]').first()
    await expect(firstSubmission).toBeVisible()
    await firstSubmission.click()
    await expect(page.getByTestId('mod-access-panel')).toBeVisible()
    await expect(page.getByTestId('access-page-link-moderation-submissions')).toBeVisible()
    const facilityNameInput = page.getByPlaceholder(enUS.modFacilitySection.placeholderTextFacilityNameEn)
    await expect(facilityNameInput).toBeVisible()
}

test.describe('Moderation edit submission topbar modals', () => {
    test.describe.configure({ timeout: 120_000 })
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1728, height: 1077 })
        await page.goto('/my-page')
        await page.waitForLoadState('domcontentloaded')
        await expect(page.getByTestId('access-page-link-moderation-submissions')).toBeVisible({ timeout: 30_000 })
        await expect(page.getByRole('button', { name: new RegExp(enUS.modDashboardLeftNav.forReview, 'i') })).toBeVisible()
    })

    test('opens approve confirmation modal from topbar action', async ({ page }) => {
        await navigateToFirstSubmissionEditPage(page)

        await page.getByRole('button', { name: new RegExp(enUS.modEditSubmissionTopNav.approve, 'i') }).click()
        await expect(page.getByRole('dialog')).toBeVisible()
        await expect(page.getByText(enUS.modSubmissionForm.submissionConfirmationMessage)).toBeVisible()
    })

    test('opens reject confirmation modal from topbar action', async ({ page }) => {
        await navigateToFirstSubmissionEditPage(page)

        await page.getByTestId('mod-edit-submission-reject-button').click()
        await expect(page.getByRole('dialog')).toBeVisible()
        await expect(page.getByText(enUS.modSubmissionForm.rejectSubmissionConfirmationMessage)).toBeVisible()
    })
})
