import VueGtag from 'vue-gtag'
export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.use(VueGtag, {
        property: {
            id: 'UA-186921459-1'
        }
    })
})