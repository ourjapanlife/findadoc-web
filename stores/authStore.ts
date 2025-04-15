import { defineStore } from 'pinia'
import { type Ref, ref, computed } from 'vue'
import { auth0 } from '../utils/auth0.js'
import { useLoadingStore } from './loadingStore.js'

export const useAuthStore = defineStore('authStore', () => {
    const userId = computed(() => auth0?.user.value?.nickname ?? 'unknown user')
    const isLoadingAuth = computed(() => auth0?.isLoading.value)
    const isLoggedIn = computed(() => !auth0?.isLoading.value && auth0?.isAuthenticated.value)
    const isAdmin = computed(() => !auth0?.isLoading.value && auth0?.isAuthenticated.value)
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
                await new Promise(resolve => setTimeout(resolve, 50))

                // break the loop after 10 seconds to avoid infinite loop
                if (Date.now() - startTime > 10000) {
                    console.error('Auth0 loading timed out after 10 seconds')
                    break
                }
            }

            if (!isLoggedIn.value) {
                return undefined
            }

            const token = await auth0?.getAccessTokenSilently({
                authorizationParams: {
                    audience: 'https://findadoc.jp.auth0.com' // our Auth0 API identifier
                }
            })
            return token
        } catch (error) {
            console.error(`Error getting auth bearer token: ${JSON.stringify(error)}`)
        }
    }

    return { userId, isLoggedIn, isLoadingAuth, isAdmin, isModerator, login, logout, getAuthBearerToken }
})
