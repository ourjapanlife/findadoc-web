import type { Auth0Plugin } from '@auth0/auth0-vue'
import { createAuth0 } from '@auth0/auth0-vue'
import { getAuth0AuthorizationParams } from '~/utils/auth0Config'

//eslint-disable-next-line
export let auth0: Auth0Plugin

export const initializeAuth0 = async () => {
    try {
        // skip if auth0 is already initialized. We also only want to run this on the browser side.
        if (auth0) {
            return auth0
        }

        const auth0Plugin = createAuth0({
            domain: 'findadoc.jp.auth0.com',
            clientId: 'HB5Jow9yA5yiA4LTPQCKBYrfDyRkO9JX',
            authorizationParams: getAuth0AuthorizationParams()
        })

        //set the global auth0 instance
        auth0 = auth0Plugin

        return auth0Plugin
    } catch (error) {
        console.error('Error initializing auth0', error)
        throw error
    }
}
