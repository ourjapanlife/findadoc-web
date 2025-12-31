import Toast, { POSITION, type PluginOptions } from 'vue-toastification'
import { defineNuxtPlugin } from '#app'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin(async nuxtApp => {
    if (import.meta.client) {
        const options: PluginOptions = {
            position: POSITION.TOP_CENTER
        }

        nuxtApp.vueApp.use(Toast, options)
    }
})
