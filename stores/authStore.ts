import { defineStore } from 'pinia'
import { type Ref, ref, computed, watch } from 'vue'
import { useLoadingStore } from './loadingStore.js'
import { auth0 } from '../utils/auth0.js'

export const useAuthStore = defineStore('authStore', () => {
    const userId = computed(() => auth0?.user.value?.nickname ?? 'unknown user')
    const isLoadingAuth = computed(() => auth0?.isLoading.value)
    const isLoggedIn = computed(() => !auth0?.isLoading.value && auth0?.isAuthenticated.value)
    // const isAdmin = computed(() => !auth0?.isLoading.value && auth0?.isAuthenticated.value)
    const isAdmin: Ref<boolean> = ref(false)
    const isModerator: Ref<boolean> = ref(false)
    const authToken: Ref<string | null> = ref(null)

    watch(auth0.isAuthenticated, async (isLoggedIn) => {
        if (isLoggedIn) {
            await refreshUserCredentials()
        } else {
            isAdmin.value = false
            isModerator.value = false
            authToken.value = null
        }
    }, { deep: true })

    async function login() {
        //set the loading visual state
        const loadingStore = useLoadingStore()

        try {
            loadingStore.setIsLoading(true)

            isModerator.value = false

            if (!auth0.isAuthenticated.value) {
                //login with auth0. this redirects the user to the auth0 login page, then returns to the home page after login
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


    async function refreshUserCredentials() {
        //if the user is not logged in, we don't need to do anything
        if (!auth0.isAuthenticated.value)
            return

        //get the access token after login. We'll send this with our requests to our API
        const newToken = await auth0.getAccessTokenSilently()
        authToken.value = newToken

        //fetch the user's permissions from the auth0 management API
        const userId = auth0.user.value?.sub
        const response = await fetch(`https://findadoc.jp.auth0.com/api/v2/users/${userId}/permissions`, {
            headers: {
                Authorization: 'Bearer ' + newToken
            }
        })

        const userPermissionsData = await response.json()

        if (!userPermissionsData || !userPermissionsData.permissions)
            throw new Error('Error retrieving user permissions: No permissions data found')

        isAdmin.value = userPermissionsData.permissions.includes('admin')
        isModerator.value = userPermissionsData.permissions.includes('moderator')
    }

    return { userId, isLoggedIn, isLoadingAuth, isAdmin, isModerator, login, logout, refreshUserCredentials }
})
