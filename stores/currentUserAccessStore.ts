import { gql } from 'graphql-request'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { gqlClient, graphQLClientRequestWithRetry } from '~/utils/graphql.js'

const currentUserAccessQuery = gql`
    query CurrentUserAccessQuery {
        currentUserAccess {
            roles
            jwtScopes
            effectiveScopes
        }
    }
`

type CurrentUserAccessQueryResult = {
    currentUserAccess: {
        roles: string[]
        jwtScopes: string[]
        effectiveScopes: string[]
    }
}

export const useCurrentUserAccessStore = defineStore('currentUserAccessStore', () => {
    const roles = ref<string[]>([])
    const jwtScopes = ref<string[]>([])
    const effectiveScopes = ref<string[]>([])
    const isLoaded = ref(false)
    const loadError = ref(false)

    const effectiveScopeSet = computed(() => new Set(effectiveScopes.value))

    function hasScope(scope: string): boolean {
        return effectiveScopeSet.value.has(scope)
    }

    async function fetchAccess(): Promise<void> {
        loadError.value = false
        const response = await graphQLClientRequestWithRetry<CurrentUserAccessQueryResult>(
            gqlClient.request.bind(gqlClient),
            currentUserAccessQuery,
            {}
        )
        if (response.hasErrors || !response.data?.currentUserAccess) {
            loadError.value = true
            return
        }
        const row = response.data.currentUserAccess
        roles.value = row.roles
        jwtScopes.value = row.jwtScopes
        effectiveScopes.value = row.effectiveScopes
        isLoaded.value = true
    }

    function reset(): void {
        roles.value = []
        jwtScopes.value = []
        effectiveScopes.value = []
        isLoaded.value = false
        loadError.value = false
    }

    return {
        roles,
        jwtScopes,
        effectiveScopes,
        effectiveScopeSet,
        hasScope,
        isLoaded,
        loadError,
        fetchAccess,
        reset
    }
})
