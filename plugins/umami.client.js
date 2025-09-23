// plugins/umami.client.ts
export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig().public

    // guard: require both values and only enable in production (adjust as needed)
    if (!config.UMAMI_URL || !config.UMAMI_SITE_ID || process.env.NODE_ENV !== 'production') return

    useHead({
        script: [
            {
                src: `${config.UMAMI_URL}/umami.js`,
                async: true,
                defer: true,
                'data-website-id': config.UMAMI_SITE_ID
            }
        ]
    })

    // SPA navigation tracking (calls umami.trackView on route change)
    const router = useRouter()
    router.afterEach(to => {
        window.umami?.trackView?.(to.fullPath)
    })
})
