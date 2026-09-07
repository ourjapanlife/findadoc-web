/**
 * GraphQL origin. Used by the runtime client (`initializeGqlClient`) and by
 * generate-time listing (`nuxi generate` hooks) which cannot call
 * `useRuntimeConfig`.
 *
 * Pass the flag in when you have it (runtime config). Omit it to read
 * `NUXT_USE_LOCAL_API` from the environment — that is how clinic (and later
 * doctor) prerender paging reaches the same host the app will query.
 */
export const PRODUCTION_GRAPHQL_URL = 'https://api.findadoc.jp'
export const LOCAL_GRAPHQL_URL = 'http://127.0.0.1:4000'

function flagIsOn(value: string | boolean | undefined | null): boolean {
    if (typeof value === 'boolean') {
        return value
    }

    const clean = value?.replace(/^["']|["']$/g, '').trim() ?? ''
    return clean !== '' && clean !== 'false' && clean !== '0'
}

export function graphqlEndpoint(
    useLocalApi: string | boolean | undefined | null = process.env.NUXT_USE_LOCAL_API
): string {
    return flagIsOn(useLocalApi) ? LOCAL_GRAPHQL_URL : PRODUCTION_GRAPHQL_URL
}
