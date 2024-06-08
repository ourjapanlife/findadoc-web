
import { Auth0Plugin, createAuth0 } from '@auth0/auth0-vue'

export let auth0: Auth0Plugin

export const initializeAuth0 = () => {
    const auth0Plugin = createAuth0({
        domain: "findadoc.jp.auth0.com",
        clientId: "HB5Jow9yA5yiA4LTPQCKBYrfDyRkO9JX",
        authorizationParams: {
            redirect_uri: '/moderation'
        }
    })

    auth0 = auth0Plugin
}
