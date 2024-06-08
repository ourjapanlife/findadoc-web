import { defineNuxtPlugin } from '#app'
import { auth0 } from '~/utils/auth0'


export default defineNuxtPlugin(async nuxtApp => {
    if (process.client) {
        nuxtApp.vueApp.use(auth0)
    }
})

