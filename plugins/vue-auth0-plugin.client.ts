import { defineNuxtPlugin } from '#app'
import { initializeAuth0 } from '~/utils/auth0'

export default defineNuxtPlugin(async nuxtApp => {
    const auth0Client = await initializeAuth0()
    nuxtApp.vueApp.use(auth0Client)
})
