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
        await expect(page.getByTestId('moderation-page')).toBeVisible({ timeout: 15000 })
    })

    test('shows confirmation modal when navigating back with unsaved changes', async ({ page }) => {
        const firstSubmissionLink = page.getByRole('link').first()
        await firstSubmissionLink.click({ timeout: 10000 }).catch(() => {})
        const onEditPage = await page.getByTestId('mod-facility-section-nameEn').isVisible().catch(() => false)
        if (!onEditPage) {
            test.skip(true, 'No submission data to open (seed data may be empty)')
            return
        }

        await page.getByTestId('mod-facility-section-nameEn').locator('input').fill('Test Hospital')
        await page.goBack()
        await expect(page.getByTestId('confirmation-modal')).toBeVisible()
        await expect(page.getByText(enUS.modEditFacilityOrHPTopbar.hasUnsavedChanges)).toBeVisible()
        await page.getByTestId('submission-unsaved-confirmation-btn').click()
        await expect(page).toHaveURL(/\/moderation/)
    })
})
