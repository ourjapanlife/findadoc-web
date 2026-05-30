import { test as base, type Page } from '@playwright/test'

/**
 * Match moderation success toast: translated copy or lazy i18n key still on screen.
 */
export function moderationSuccessToastPattern(expectedMessage: string, keySuffix: string): RegExp {
    const escaped = expectedMessage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return new RegExp(`${escaped}|${keySuffix.replace(/\./g, '\\.')}`)
}

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

// Normalize AUTH0_DOMAIN from .env (often includes https:// and trailing slash).
const auth0Host = (process.env.AUTH0_DOMAIN || 'findadoc.jp.auth0.com')
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')

/** Default API scopes for moderation e2e (must match Auth0 API + app grants). Override with AUTH0_SCOPE. */
const defaultAuth0ResourceOwnerScope = [
    'openid',
    'profile',
    'email',
    'read:submissions',
    'write:submissions',
    'delete:submissions',
    'read:facilities',
    'write:facilities',
    'delete:facilities',
    'read:healthcareprofessionals',
    'write:healthcareprofessionals',
    'delete:healthcareprofessionals',
    'read:profile',
    'write:posts',
    'read:reservations',
    'write:reservations'
].join(' ')

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

    const audience = process.env.AUTH0_AUDIENCE || 'findadoc'
    const scope = process.env.AUTH0_SCOPE || defaultAuth0ResourceOwnerScope

    const response = await page.context().request.post(`https://${auth0Host}/oauth/token`, {
        data: {
            // eslint-disable-next-line camelcase
            grant_type: 'password',
            connection: 'Username-Password-Authentication',
            audience,
            username,
            password,
            scope,
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
