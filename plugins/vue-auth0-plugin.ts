import { defineNuxtPlugin } from '#app'
import { auth0, initializeAuth0 } from '~/utils/auth0'


export default defineNuxtPlugin(async nuxtApp => {
    if (process.client) {
        initializeAuth0()
        nuxtApp.vueApp.use(auth0)

        //load the user's session. don't await so it doesn't block the rendering
        auth0.checkSession()
    }
})

