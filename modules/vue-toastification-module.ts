import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
    setup(_, nuxt) {
        nuxt.hook('app:resolve', app => {
            // Register the Toast plugin only on the client side instead of the build
            app.plugins.push({
                src: 'plugins/vue-toastification-plugin',
                mode: 'client'
            })
        })
    }
})
