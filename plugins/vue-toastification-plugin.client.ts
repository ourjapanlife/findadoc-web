import Toast, { POSITION, useToast, type PluginOptions, type ToastInterface } from 'vue-toastification'
import { defineNuxtPlugin } from '#app'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin(nuxtApp => {
    const options: PluginOptions = {
        position: POSITION.TOP_CENTER
    }

    nuxtApp.vueApp.use(Toast, options)

    return {
        provide: {
            toast: useToast()
        }
    }
})

declare module '#app' {
    interface NuxtApp {
        $toast: ToastInterface
    }
}
