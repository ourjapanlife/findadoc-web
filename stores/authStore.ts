import { defineStore } from 'pinia'
import { computed } from 'vue'
import { auth0 } from '../utils/auth0.js'
import { useLoadingStore } from './loadingStore.js'

export const useAuthStore = defineStore('authStore', () => {
    const runtimeConfig = useRuntimeConfig()
    const isTestingMode = !!runtimeConfig.public.isTestingMode

    const userId = computed(() => {
        if (isTestingMode) {
            return localStorage?.getItem('id_token') ?? 'unknown user'
        }
        return auth0?.user.value?.nickname ?? 'unknown user'
    })

    const isLoadingAuth = computed(() => auth0?.isLoading.value ?? true)

    const isLoggedIn = computed(() => {
        if (isTestingMode) {
            return localStorage?.getItem('auth_token') !== undefined
        }
        return auth0?.isAuthenticated.value ?? false
    })

    async function login() {
        //set the loading visual state
        const loadingStore = useLoadingStore()

        try {
            loadingStore.setIsLoading(true)

            if (!isLoggedIn.value) {
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
        //TODO clear the credentials
        await auth0.logout({ logoutParams: { returnTo: window.location.origin } })
    }

    async function getAuthBearerToken() {
        try {
            if (isTestingMode) {
                return localStorage?.getItem('auth_token') ?? undefined
            }

            if (!auth0) {
                await waitForAuth0ToLoad()
            }

            if (!auth0.isAuthenticated.value) {
                return undefined
            }

            const token = await auth0.getAccessTokenSilently({
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

    //Note: This is use for async functions that need to wait for the auth0 object to be ready.
    //If not within an async function, use the `isLoadingAuth` computed property instead.
    async function waitForAuth0ToLoad() {
        const timeoutMs = 10000

        return new Promise<void>((resolve, reject) => {
            const startTime = Date.now()

            watch(
                () => auth0?.isLoading.value ?? true,
                isAuthStillLoading => {
                    if (!isAuthStillLoading) {
                        resolve()
                    } else if (Date.now() - startTime > timeoutMs) {
                        console.error('Auth0 loading timed out after 10 seconds')
                        reject(new Error('Auth0 loading timed out after 10 seconds'))
                    }
                },
                { immediate: true }
            )
        })
    }

    return { userId, isLoggedIn, isLoadingAuth, login, logout, getAuthBearerToken }
})
