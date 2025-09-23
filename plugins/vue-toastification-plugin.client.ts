import Toast from 'vue-toastification'
import { defineNuxtPlugin } from '#app'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin(async nuxtApp => {
    if (import.meta.client) {
        nuxtApp.vueApp.use(Toast, {
            position: 'top-center'
        })
    }
})
