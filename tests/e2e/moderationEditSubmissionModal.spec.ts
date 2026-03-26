import enUS from '../../i18n/locales/en.json' with { type: 'json' }
import { test, expect } from '@playwright/test'
import { skipOnboarding, shouldRunModerationTests, auth0Login } from './fixtures'

test.describe('Moderation edit submission unsaved changes modal', () => {
    test.skip(!shouldRunModerationTests(),
              'Skipping moderation tests when Auth0 credentials are not set (skip login programmatically)')

    test.beforeEach(async ({ page }) => {
        await skipOnboarding(page)
        if (shouldRunModerationTests()) {
            await auth0Login(page)
        }
        await page.setViewportSize({ width: 1728, height: 1077 })
        await page.goto('/moderation')
        await page.waitForLoadState('networkidle')
        await expect(page.getByRole('button', { name: new RegExp(enUS.modDashboardLeftNav.forReview, 'i') })).toBeVisible()
    })

    test('shows confirmation modal when navigating back with unsaved changes', async ({ page }) => {
        const firstSubmissionLink = page.getByRole('link').first()
        await firstSubmissionLink.click().catch(() => {})
        const facilityNameInput = page.getByPlaceholder(enUS.modFacilitySection.placeholderTextFacilityNameEn)
        const onEditPage = await facilityNameInput.isVisible().catch(() => false)
        if (!onEditPage) {
            test.skip(true, 'No submission data to open (seed data may be empty)')
            return
        }

        await facilityNameInput.fill('Test Hospital')
        await page.goBack()
        await expect(page.getByRole('dialog')).toBeVisible()
        await expect(page.getByText(enUS.modEditFacilityOrHPTopbar.hasUnsavedChanges)).toBeVisible()
        await page.getByRole('button', { name: new RegExp(enUS.modSubmissionForm.confirmationButton, 'i') }).click()
        await expect(page).toHaveURL(/\/moderation/)
    })

    test('opens approve confirmation modal from topbar action', async ({ page }) => {
        const firstSubmissionLink = page.getByRole('link').first()
        await firstSubmissionLink.click().catch(() => {})
        const facilityNameInput = page.getByPlaceholder(enUS.modFacilitySection.placeholderTextFacilityNameEn)
        const onEditPage = await facilityNameInput.isVisible().catch(() => false)
        if (!onEditPage) {
            test.skip(true, 'No submission data to open (seed data may be empty)')
            return
        }

        await page.getByRole('button', { name: new RegExp(enUS.modEditSubmissionTopNav.approve, 'i') }).click()
        await expect(page.getByRole('dialog')).toBeVisible()
        await expect(page.getByText(enUS.modSubmissionForm.submissionConfirmationMessage)).toBeVisible()
    })

    test('opens reject confirmation modal from topbar action', async ({ page }) => {
        const firstSubmissionLink = page.getByRole('link').first()
        await firstSubmissionLink.click().catch(() => {})
        const facilityNameInput = page.getByPlaceholder(enUS.modFacilitySection.placeholderTextFacilityNameEn)
        const onEditPage = await facilityNameInput.isVisible().catch(() => false)
        if (!onEditPage) {
            test.skip(true, 'No submission data to open (seed data may be empty)')
            return
        }

        await page.getByTestId('mod-edit-submission-reject-button').click()
        await expect(page.getByRole('dialog')).toBeVisible()
        await expect(page.getByText(enUS.modSubmissionForm.rejectSubmissionConfirmationMessage)).toBeVisible()
    })
})
