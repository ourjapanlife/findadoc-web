import { test as setup } from '@playwright/test'

import { auth0Login, skipOnboarding } from './fixtures'

/**
 * Resource-owner login + cookies used by Nuxt testing mode (auth_token / id_token).
 * Saved storage state is consumed by the chromium-moderation project.
 */
setup('moderation auth', async ({ page, baseURL }) => {
    await page.goto(baseURL ?? 'http://localhost:4242/')
    await auth0Login(page)
    await skipOnboarding(page)
    await page.context().storageState({ path: 'playwright/.auth/moderation.json' })
})
