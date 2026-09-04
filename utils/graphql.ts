import { GraphQLClient, type RequestDocument } from 'graphql-request'
import { useRuntimeConfig } from '#imports'
import type { ErrorCode, ServerErrorResponse, ServerResponse } from '~/typedefs/serverResponse'

// eslint-disable-next-line
export let gqlClient: GraphQLClient

let gqlClientBaseUrl: string | null = null

export const initializeGqlClient = () => {
    const useLocalApi = useRuntimeConfig().public.NUXT_USE_LOCAL_API as string | undefined
    const apiURL = useLocalApi ? 'http://127.0.0.1:4000' : 'https://api.findadoc.jp'

    if (gqlClient && gqlClientBaseUrl === apiURL) {
        return
    }

    gqlClientBaseUrl = apiURL
    gqlClient = new GraphQLClient(apiURL)
}

/** Rejects if the request has not settled in time, so a hung connection cannot stall a caller. */
async function withTimeout<T>(request: Promise<T>, abortAfterMs?: number): Promise<T> {
    if (!abortAfterMs) {
        return request
    }

    let timer: ReturnType<typeof setTimeout> | undefined

    try {
        return await Promise.race([
            request,
            new Promise<never>((_resolve, reject) => {
                timer = setTimeout(() => reject(new Error(`Request timed out after ${abortAfterMs}ms`)), abortAfterMs)
            })
        ])
    } finally {
        if (timer) clearTimeout(timer)
    }
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
            /*
             * Public reads skip the token lookup entirely. getAuthBearerToken() awaits Auth0
             * initialisation (up to 10 s), which used to sit in front of every anonymous search
             * request — the whole waterfall serialised behind an SDK the visitor never uses.
             */
            const authToken = retryOptions?.skipAuth
                ? undefined
                : await useAuthStore().getAuthBearerToken()
            // Set the auth token in the request headers. This is used to authenticate the user with the API
            const requestHeaders = {
                authorization: authToken ? `Bearer ${authToken}` : ''
            } satisfies HeadersInit

            /*
             * Execute our actual HTTP request.
             *
             * `abortAfterMs` bounds how long one attempt may hang. The retry loop only fires on
             * rejection, so a connection the server accepts and then never answers produced a
             * promise that never settled — and any caller waiting on it (the search page's
             * loading state, for one) waited forever with no error and no way to retry.
             */
            const rawResponseData = await withTimeout(
                gqlClientRequestFunction(queryOrMutation, variables, requestHeaders),
                retryOptions?.abortAfterMs
            )

            // If the request is successful, return the data in the standardized `ServerResponse` format
            return {
                data: rawResponseData,
                errors: [],
                hasErrors: false
            } satisfies ServerResponse<T>
        } catch (error) {
            if (attempts < retryAmount) {
                attempts++
                if (attempts > 1) {
                    await new Promise(resolve => setTimeout(resolve, requestTimeoutInMilliseconds))
                }
                return executeGQLClientRequest()
            }
            // This is a consistent error messaging no matter the type of query or mutation
            console.error(`There was an error executing the request: ${error}`)
            const serverErrorResponse = error as ServerErrorResponse
            // This map transforms errors if they exist
            const errors = serverErrorResponse.response?.errors?.map(errorResponse => ({
                message: errorResponse.message,
                fieldWithError: errorResponse.locations,
                code: errorResponse.extensions.code as ErrorCode
            })) || []

            return { data: {} as T, errors, hasErrors: true }
        }
    }
    return executeGQLClientRequest() // retry request
}
export interface graphQLClientRequestWithRetryOptions {
    requestTimeoutInMilliseconds?: number
    retryAmount?: number
    /** Send no bearer token and do not wait for Auth0. Only for reads the API serves anonymously. */
    skipAuth?: boolean
    /** Fail an attempt that has not responded in this long. Without it a hung request never settles. */
    abortAfterMs?: number
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
