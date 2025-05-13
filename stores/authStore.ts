import { defineStore } from 'pinia'
import { type Ref, ref, computed } from 'vue'
import { auth0 } from '../utils/auth0.js'
import { useLoadingStore } from './loadingStore.js'

export const useAuthStore = defineStore('authStore', () => {
    const secretPromise = ref<Promise<boolean> | null>(null)
    const isTesting = ref(false)
    const isReady = ref(false)

    async function loadSecret(): Promise<boolean> {
        if (!secretPromise.value) {
            secretPromise.value = (async () => {
                const checkForTestingEnvironment = await $fetch<{ testingEnvironment: string }>('/api/test-environment')
                try {
                    if (checkForTestingEnvironment.testingEnvironment) {
                        isTesting.value = true
                        return true
                    }
                    return false
                } catch (err) {
                    if (checkForTestingEnvironment.testingEnvironment) console.error('Failed to fetch auth secret', err)
                    throw err
                }
            })()
        }
        return secretPromise.value
    }

    async function init() {
        try {
            await loadSecret()
        } catch {
            isTesting.value = false
        } finally {
            isReady.value = true
        }
    }
    init()

    const userId = computed(() => {
        if (!isReady.value) return undefined
        if (isTesting.value) {
            return localStorage.getItem('id_token') ?? 'unknown user'
        }
        return auth0.user.value?.nickname ?? 'unknown user'
    })

    const isLoadingAuth = computed(() => {
        if (!isReady.value) return true
        return auth0.isLoading.value
    })

    const isLoggedIn = computed(() => {
        if (!isReady.value) return false
        if (isTesting.value) {
            return !!localStorage.getItem('auth_token')
        }
        return !auth0.isLoading.value && auth0.isAuthenticated.value
    })

    const isAdmin = computed(() => {
        if (!isReady.value) return false
        return !auth0.isLoading.value && auth0.isAuthenticated.value
    })

    const isModerator: Ref<boolean> = ref(false)

    async function login() {
        //set the loading visual state
        const loadingStore = useLoadingStore()

        try {
            loadingStore.setIsLoading(true)

            isModerator.value = false

            if (!auth0.isAuthenticated.value) {
                await auth0.loginWithRedirect()
            }

            //set the loading visual state back to normal
            loadingStore.setIsLoading(false)
        } catch (error) {
            //set the loading visual state back to normal
            loadingStore.setIsLoading(false)
            console.error(`Error logging in: ${JSON.stringify(error)}`)
        }
    }

    async function logout() {
        isModerator.value = false

        //TODO clear the credentials
        await auth0.logout({ logoutParams: { returnTo: window.location.origin } })
    }

    //Note: if this function is called while `isLoadingAuth` is true, it will return undefined
    //If you need to wait for the auth0 object to be ready, use the `isLoadingAuth` computed property
    //to check if the auth0 object is ready before calling this function
    async function getAuthBearerToken() {
        try {
            const startTime = Date.now()
            while (auth0?.isLoading.value) {
                // wait for the auth0 object to be ready
                await new Promise(resolve => setTimeout(resolve, 100))

                // break the loop after 10 seconds to avoid infinite loop
                if (Date.now() - startTime > 10000) {
                    console.error('Auth0 loading timed out after 10 seconds')
                    break
                }
            }

            if (!isReady.value) return undefined

            if (isTesting.value) {
                return localStorage.getItem('auth_token') ?? undefined
            }

            if (!auth0?.isAuthenticated.value) {
                return undefined
            }

            const token = await auth0?.getAccessTokenSilently({
                authorizationParams: {
                    audience: 'findadoc',
                    tokenSigningAlg: 'RS256'
                }
            })

            return token
        } catch (error) {
            console.error(`Error getting auth bearer token: ${JSON.stringify(error)}`)
        }
    }

    return { userId, isLoggedIn, isLoadingAuth, isAdmin, isModerator, login, logout, getAuthBearerToken }
})
