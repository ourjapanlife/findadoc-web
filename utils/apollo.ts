import { ApolloClient, InMemoryCache, NormalizedCacheObject, createHttpLink } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { provide } from 'vue'



export let apollo: ApolloClient<NormalizedCacheObject> | null = null

export const initializeApollo = () => {
    if (apollo) {
        return apollo
    }

    apollo = new ApolloClient({
        link: createHttpLink({
            uri: 'https://findadoc-api-9brq4.ondigitalocean.app/api',
        }),
        cache: new InMemoryCache()
    })

    provideApolloClient(DefaultApolloClient, apollo)
}
