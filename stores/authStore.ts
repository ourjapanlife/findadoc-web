import { gql } from 'graphql-request'
import { defineStore } from 'pinia'
import { type Ref, ref, computed } from 'vue'
import { useLoadingStore } from './loadingStore.js'
import { auth0 } from '../utils/auth0.js'
import { gqlClient } from '../utils/graphql.js'

type LoginResult = {
    success: boolean
    // roles: Role[]
}

// enum Role {
//     Admin = 'Admin',
//     Moderator = 'Moderator'
// }

export const useAuthStore = defineStore('authStore', () => {
    const isLoggedIn: Ref<boolean> = ref(false)
    const isAdmin: Ref<boolean> = ref(false)
    const isModerator: Ref<boolean> = ref(false)
    const userId = computed(() => auth0.user.value?.sub)

    async function login(username: string, password?: string) {
        //set the loading visual state
        const loadingStore = useLoadingStore()

        try {
            loadingStore.setIsLoading(true)

            isLoggedIn.value = false
            isAdmin.value = false
            isModerator.value = false

            const loginData = {
                credentials: {
                    username: username,
                    password: password
                }
            }

            // const { loginWithRedirect, isAuthenticated } = auth0
            // await loginWithRedirect()

            // const response = await new Promise((resolve) => {
            //     let result: { loginResult: LoginResult } = {
            //         loginResult: {
            //             success: false,
            //             roles: []
            //         } as LoginResult
            //     }

            //     const id = setTimeout(() => {
            //         clearTimeout(id)
            //         result = {
            //             loginResult: {
            //                 success: true,
            //                 roles: [Role.Admin]
            //             } as LoginResult
            //         }

            //         resolve(result)
            //     }, 1000)

            // }) as { loginResult: LoginResult }

            const response = await gqlClient.request<{ loginResult: LoginResult }>(loginQuery, loginData)

            // const loginResult = response?.loginResult as LoginResult

            //update the state with the new results
            // if (loginResult.success) {
            //     isLoggedIn.value = true
            // }

            //update the state with the new results
            if (isAuthenticated.value === true) {
                isLoggedIn.value = true
            }

            //TODO store the credentials

            // if (user.roles.includes(Role.Admin)) {
            //     isAdmin.value = true
            // }
            // if (loginResult.roles.includes(Role.Moderator)) {
            //     isModerator.value = true
            // }

            //set the loading visual state back to normal
            loadingStore.setIsLoading(false)
        } catch (error) {
            //set the loading visual state back to normal
            loadingStore.setIsLoading(false)
            console.error(`Error logging in: ${JSON.stringify(error)}`)
        }
    }

    function logout() {
        isLoggedIn.value = false
        isAdmin.value = false
        isModerator.value = false

        //TODO clear the credentials
        // const { logout } = useAuth0()
        // logout({ logoutParams: { returnTo: window.location.origin } })
    }

    return { userId, isLoggedIn, isAdmin, isModerator, login, logout }
})
