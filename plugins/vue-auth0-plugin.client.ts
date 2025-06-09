import { defineNuxtPlugin } from '#app'
import { initializeAuth0 } from '~/utils/auth0'

export default defineNuxtPlugin(async nuxtApp => {
    const auth0 = await initializeAuth0()
    nuxtApp.vueApp.use(auth0)

    //load the user's session. don't await so it doesn't block the rendering
    //This must be ran auth0 is initialized in the vue app
    await auth0.checkSession()
})

