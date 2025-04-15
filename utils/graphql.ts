import { GraphQLClient, type RequestDocument } from 'graphql-request'
import { useRuntimeConfig } from '#imports'
import type { ErrorCode, ServerErrorResponse, ServerResponse } from '~/typedefs/serverResponse'

// eslint-disable-next-line
export let gqlClient: GraphQLClient

export const initializeGqlClient = () => {
    if (gqlClient) {
        return gqlClient
    }

    let apiURL

    const useLocalApi = useRuntimeConfig().public.NUXT_USE_LOCAL_API as string | undefined
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
        queryOrMutation: RequestDocument,
        variables?: unknown,
        requestHeaders?: HeadersInit
    ) => Promise<T>,
    queryOrMutation: RequestDocument,
    variables: unknown,
    retryOptions?: graphQLClientRequestWithRetryOptions
): Promise<ServerResponse<T>> => {
    let attempts = 0
    const retryAmount = retryOptions?.retryAmount || 3
    const requestTimeoutInMilliseconds = retryOptions?.requestTimeoutInMilliseconds || 5000

    const executeGQLClientRequest = async (): Promise<ServerResponse<T>> => {
        try {
            // get the auth0 token from the auth store
            const authstore = useAuthStore()
            const authToken = await authstore.getAuthBearerToken()
            // Set the auth token in the request headers. This is used to authenticate the user with the API
            const requestHeaders = {
                authorization: authToken ? `Bearer ${authToken}` : ''
            } satisfies HeadersInit

            const data = await gqlClientRequestFunction(queryOrMutation, variables, requestHeaders)
            return { data, errors: [], hasErrors: false }
        } catch (error) {
            if (attempts < retryAmount) {
                attempts++
                if (attempts > 1) {
                    await new Promise(resolve => setTimeout(resolve, requestTimeoutInMilliseconds))
                }
                return executeGQLClientRequest() // retry request
            }

            // This is a consistent error messaging no matter the type of query or mutation
            console.error(`There was an error executing the request: ${error}`)
            const serverError = error as ServerErrorResponse

            // This map transforms errors if they exist
            const errors = serverError.response?.errors?.map(errorResponse => ({
                message: errorResponse.message,
                fieldWithError: errorResponse.locations,
                code: errorResponse.extensions.code as ErrorCode
            })) || []

            return { data: {} as T, errors, hasErrors: true }
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
