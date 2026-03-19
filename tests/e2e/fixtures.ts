import { test as base, type Page } from '@playwright/test'

/**
 * Skip onboarding by setting localStorage. Call before visiting app pages that check onboarding.
 */
export async function skipOnboarding(page: Page) {
    await page.goto('/')
    await page.evaluate(() => {
        localStorage.setItem('onboardingState', '"completed"')
    })
}

/** Run moderation tests: always in CI; locally only when Auth0 credentials are present. */
export function shouldRunModerationTests(): boolean {
    if (process.env.CI) return true
    return !!process.env.AUTH0_USERNAME
      && !!process.env.AUTH0_PASSWORD
      && !!process.env.AUTH0_CLIENTID
      && !!process.env.AUTH0_CLIENTSECRET
}

// Strip protocol and trailing slash so URL is always https://<domain>/oauth/token
const AUTH0_DOMAIN = (process.env.AUTH0_DOMAIN || 'findadoc.jp.auth0.com').replace(/^https?:\/\//, '').replace(/\/$/, '')

/**
 * Log in via Auth0 resource owner password grant and set auth cookies on the page context.
 * Only call when RUN_MODERATION is true and AUTH0_* env vars are set.
 */
export async function auth0Login(page: Page) {
    const username = process.env.AUTH0_USERNAME
    const password = process.env.AUTH0_PASSWORD
    const clientId = process.env.AUTH0_CLIENTID
    const clientSecret = process.env.AUTH0_CLIENTSECRET
    if (!username || !password || !clientId || !clientSecret) {
        throw new Error('Auth0 login requires AUTH0_USERNAME, AUTH0_PASSWORD, AUTH0_CLIENTID, AUTH0_CLIENTSECRET')
    }

    const response = await page.context().request.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
        data: {
            // eslint-disable-next-line camelcase
            grant_type: 'password',
            connection: 'Username-Password-Authentication',
            audience: 'findadoc',
            username,
            password,
            scope: 'openid profile email',
            // eslint-disable-next-line camelcase
            client_id: clientId,
            // eslint-disable-next-line camelcase
            client_secret: clientSecret
        }
    })
    if (!response.ok()) {
        const body = await response.text()
        throw new Error(`Auth0 token request failed: ${response.status()} ${body}`)
    }
    const body = await response.json() as { access_token: string, id_token: string }
    await page.context().addCookies([
        { name: 'auth_token', value: body.access_token, domain: 'localhost', path: '/' },
        { name: 'id_token', value: body.id_token, domain: 'localhost', path: '/' },
        { name: 'authToken', value: 'true', domain: 'localhost', path: '/' }
    ])
}

export const test = base
