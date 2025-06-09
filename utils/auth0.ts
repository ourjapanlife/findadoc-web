
import type { Auth0Plugin } from '@auth0/auth0-vue'
import { createAuth0 } from '@auth0/auth0-vue'
import { useRoute } from 'vue-router'

//eslint-disable-next-line
export let auth0: Auth0Plugin

export const initializeAuth0 = async () => {
    try {
        // skip if auth0 is already initialized. We also only want to run this on the browser side.
        if (auth0) {
            return auth0
        }

        const isProduction = process.env.NODE_ENV === 'production' && window.location.origin !== 'http://localhost:3000'

        const auth0Plugin = createAuth0({
            domain: 'findadoc.jp.auth0.com',
            clientId: 'HB5Jow9yA5yiA4LTPQCKBYrfDyRkO9JX',
            authorizationParams: {
                appState: {
                    target: useRoute().path
                },
                //eslint-disable-next-line
                redirect_uri: isProduction ? 'https://www.findadoc.jp' : 'http://localhost:3000'
            }
        })

        //set the global auth0 instance
        auth0 = auth0Plugin

        return auth0Plugin
    } catch (error) {
        console.error('Error initializing auth0', error)
        throw error
    }
}
