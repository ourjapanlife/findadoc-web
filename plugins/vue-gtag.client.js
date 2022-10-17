import VueGtag from 'vue-gtag'
// eslint-disable-next-line no-undef
export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.use(VueGtag, {
        property: {
            id: 'UA-186921459-1'
        }
    })
})