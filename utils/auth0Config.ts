/** Auth0 API identifier — must match the findadoc API in Auth0 and the server JWT audience. */
export const AUTH0_API_AUDIENCE = 'findadoc'

const LOGIN_PATH = '/login'
export const AUTH_RETURN_TO_QUERY = 'returnTo'

export function getAuth0AuthorizationParams(redirectUri = window.location.origin) {
    return {
        audience: AUTH0_API_AUDIENCE,
        redirect_uri: redirectUri // eslint-disable-line camelcase
    }
}

/** Reject unsafe or recursive post-login targets. */
export function sanitizeAuthReturnPath(path: string | null | undefined): string | null {
    if (!path || !path.startsWith('/') || path.startsWith('//')) {
        return null
    }

    const [pathname] = path.split('?')
    if (pathname === LOGIN_PATH || (pathname && pathname.startsWith(`${LOGIN_PATH}/`))) {
        return null
    }

    return path
}

/**
 * Resolve where to send the user after Auth0 login.
 * On `/login`, honors `?returnTo=`; otherwise uses the current route.
 */
export function resolveAuthReturnPath(currentFullPath: string): string {
    const [pathname, search = ''] = currentFullPath.split('?')

    if (pathname === LOGIN_PATH || (pathname && pathname.startsWith(`${LOGIN_PATH}/`))) {
        if (search) {
            const returnTo = sanitizeAuthReturnPath(
                new URLSearchParams(search).get(AUTH_RETURN_TO_QUERY)
            )
            if (returnTo) {
                return returnTo
            }
        }

        return '/'
    }

    return sanitizeAuthReturnPath(currentFullPath) ?? '/'
}

export function buildLoginRoute(returnTo: string) {
    return {
        path: LOGIN_PATH,
        query: {
            [AUTH_RETURN_TO_QUERY]: sanitizeAuthReturnPath(returnTo) ?? '/'
        }
    }
}

export function isAuth0ConsentRequiredError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
        return false
    }

    const auth0Error = error as { error?: string, error_description?: string, message?: string }
    return auth0Error.error === 'consent_required'
      || auth0Error.error_description === 'Consent required'
      || auth0Error.message?.includes('consent_required') === true
      || auth0Error.message?.includes('Consent required') === true
}
