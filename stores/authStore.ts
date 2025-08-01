import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { auth0 } from '../utils/auth0.js'
import { useLoadingStore } from './loadingStore.js'
import { useCookie, useRuntimeConfig } from '#app'

export const useAuthStore = defineStore('authStore', () => {
    const runtimeConfig = useRuntimeConfig()
    const isTestingMode = !!runtimeConfig.public.isTestingMode
    const route = useRoute()
    const router = useRouter()

    const userId = computed(() => {
        if (isTestingMode)
            //we use the id_token cookie name for testing, but it's long so we just use the first 5 characters
            return useCookie('id_token').value?.substring(0, 5) ?? 'unknown user'
        return auth0.user.value?.['https://findadoc.jp/user_metadata']?.displayName ?? auth0?.user.value?.name ?? 'unknown user'
    })

    const userProfileImage = computed(() => {
        // If no source is returned, return an empty string so we can display the placeholder profile icon
        if (isTestingMode)
            return useCookie('id_token').value?.substring(0, 5) ?? ''
        return auth0?.user.value?.['https://findadoc.jp/user_metadata']?.displayImage ?? auth0?.user.value?.picture ?? ''
    })

    const isLoadingAuth = computed(() => auth0?.isLoading.value ?? true)

    const isLoggedIn = computed(() => {
        if (isTestingMode) return useCookie('authToken').value !== null
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
        //Clear the following cookies when they are used in testing
        useCookie('auth_token').value = null
        useCookie('id_token').value = null
        useCookie('authToken').value = null

        //Logout from Auth0
        await auth0.logout({ logoutParams: { returnTo: window.location.origin } })
    }

    async function getAuthBearerToken() {
        try {
            if (isTestingMode) {
                return useCookie('auth_token').value ?? undefined
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

    const redirectIfUnauthenticatedUser = async (
        routePath: string,
        doesTheUserHaveAccess: Ref<boolean>
    ) => {
        // This promise is here to make the Suspense component work.
        // It doesn't do anything, but <Suspense> requires an awaited setup method
        await new Promise(resolve => {
            //ignore if route change is unrelated to moderation
            const needsRedirectDueToAccess = route.path.startsWith(routePath)
              && !isLoggedIn.value && !isLoadingAuth.value
            if (needsRedirectDueToAccess) {
                // give the user a bit of time to read the message before redirecting
                doesTheUserHaveAccess.value = false
                setTimeout(() => {
                    // Redirect to login page if user is not logged in
                    router.push('/')
                }, 10000)
            }

            resolve(true)
        })
    }

    return { userId,
        userProfileImage,
        isLoggedIn,
        isLoadingAuth,
        login,
        logout,
        getAuthBearerToken,
        redirectIfUnauthenticatedUser }
})
