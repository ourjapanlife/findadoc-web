import { GraphQLClient, type RequestDocument } from 'graphql-request'
import { useRuntimeConfig } from '#imports'

// eslint-disable-next-line
export let gqlClient: GraphQLClient

export const initializeGqlClient = () => {
    if (gqlClient) {
        return gqlClient
    }

    let apiURL

    const useLocalApi = useRuntimeConfig().public.NUXT_USE_LOCAL_API as boolean | undefined
    if (useLocalApi) {
        apiURL = 'http://127.0.0.1:4000'
    } else {
        apiURL = 'https://api.findadoc.jp'
    }

    const client = new GraphQLClient(apiURL)
    gqlClient = client
}

export const graphQLClientRequestWithRetry = async <T>(
    gqlClientRequestFunction: (
        queryOrMutation: RequestDocument, variables?: unknown) => Promise<T>,
    queryOrMutation: RequestDocument,
    variables: unknown,
    retryOptions?: graphQLClientRequestWithRetryOptions
): Promise<T> => {
    let attempts = 0
    // These are optional variables that we set to defaults of 3 retries and after 5 seconds
    const retryAmount = retryOptions?.retryAmount || 3
    const requestTimeoutInMilliseconds = retryOptions?.requestTimeoutInMilliseconds || 5000

    const executeGQLClientRequest = async (): Promise<T> => {
        try {
            return await gqlClientRequestFunction(queryOrMutation, variables)
        } catch (error) {
            if (attempts < retryAmount) {
                attempts++
                if (attempts > 1) {
                    await new Promise(resolve =>
                        setTimeout(resolve, requestTimeoutInMilliseconds))
                }
                return executeGQLClientRequest()
            }
            throw error
        }
    }

    return executeGQLClientRequest()
}

export interface graphQLClientRequestWithRetryOptions {
    requestTimeoutInMilliseconds?: number
    retryAmount?: number
}
export interface gqlMutation<T> extends gqlRequest {
    variables: {
        input: T
    }
}

export interface gqlRequest {
    query: string
    variables: unknown
}
