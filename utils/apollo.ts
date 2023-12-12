import { ApolloClient, InMemoryCache, NormalizedCacheObject, createHttpLink } from '@apollo/client/core'
import { DefaultApolloClient, provideApolloClient } from '@vue/apollo-composable'
import { provide } from 'vue'



export let apollo: ApolloClient<NormalizedCacheObject> | null = null

export const initializeApollo = () => {
    if (apollo) {
        return apollo
    }

    apollo = new ApolloClient({
        link: createHttpLink({
            uri: 'https://api.findadoc.jp',
        }),
        cache: new InMemoryCache()
    })

    provideApolloClient(apollo)
}
