import { gql } from 'graphql-request'
import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
import { } from '~/typedefs/gqlTypes.js'
import { useLoadingStore } from './loadingStore.js'
import { gqlClient } from '../utils/graphql.js'

type LoginResult = {
    success: boolean,
    roles: Role[]
}

enum Role {
    Admin = 'Admin',
    Moderator = 'Moderator'
}

export const useAuthStore = defineStore('authStore', () => {
    const isLoggedIn: Ref<boolean> = ref(false)
    const isAdmin: Ref<boolean> = ref(false)
    const isModerator: Ref<boolean> = ref(false)


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

            const response = await new Promise((resolve) => {
                let result: { loginResult: LoginResult } = {
                    loginResult: {
                        success: false,
                        roles: []
                    } as LoginResult
                }

                const id = setTimeout(() => {
                    clearTimeout(id)
                    result = {
                        loginResult: {
                            success: true,
                            roles: [Role.Admin]
                        } as LoginResult
                    }

                    resolve(result)
                }, 1000)

            }) as { loginResult: LoginResult }

            // const response = await gqlClient.request<{ loginResult: LoginResult }>(loginQuery, loginData)

            const loginResult = response?.loginResult as LoginResult

            //update the state with the new results
            if (loginResult.success) {
                isLoggedIn.value = true
            }

            //TODO store the credentials

            if (loginResult.roles.includes(Role.Admin)) {
                isAdmin.value = true
            }
            if (loginResult.roles.includes(Role.Moderator)) {
                isModerator.value = true
            }

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
    }

    return { isLoggedIn, isAdmin, isModerator, login, logout }
})

const loginQuery = gql`query login($credentials: LoginInput!) {
    loginResult(credentials: $credentials) {
        success,
        roles
    }
}`
