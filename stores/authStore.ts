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

    return { userId, isLoggedIn, isLoadingAuth, isAdmin, isModerator, login, logout }
})
