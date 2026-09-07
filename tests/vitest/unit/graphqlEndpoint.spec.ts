/// <reference types="vitest/globals" />
import { expect } from 'chai'
import {
    graphqlEndpoint,
    LOCAL_GRAPHQL_URL,
    PRODUCTION_GRAPHQL_URL
} from '@/utils/graphqlEndpoint'

describe('graphqlEndpoint', () => {
    it('uses production when the local-api flag is unset, empty, or a quoted empty string', () => {
        expect(graphqlEndpoint(undefined)).to.equal(PRODUCTION_GRAPHQL_URL)
        expect(graphqlEndpoint(null)).to.equal(PRODUCTION_GRAPHQL_URL)
        expect(graphqlEndpoint('')).to.equal(PRODUCTION_GRAPHQL_URL)
        expect(graphqlEndpoint('""')).to.equal(PRODUCTION_GRAPHQL_URL)
        expect(graphqlEndpoint("''")).to.equal(PRODUCTION_GRAPHQL_URL)
        expect(graphqlEndpoint('false')).to.equal(PRODUCTION_GRAPHQL_URL)
        expect(graphqlEndpoint('0')).to.equal(PRODUCTION_GRAPHQL_URL)
        expect(graphqlEndpoint(false)).to.equal(PRODUCTION_GRAPHQL_URL)
    })

    it('uses the local server when NUXT_USE_LOCAL_API is on', () => {
        expect(graphqlEndpoint('true')).to.equal(LOCAL_GRAPHQL_URL)
        expect(graphqlEndpoint('1')).to.equal(LOCAL_GRAPHQL_URL)
        expect(graphqlEndpoint(true)).to.equal(LOCAL_GRAPHQL_URL)
    })

    it('reads NUXT_USE_LOCAL_API from the environment when no flag is passed', () => {
        const previous = process.env.NUXT_USE_LOCAL_API

        try {
            delete process.env.NUXT_USE_LOCAL_API
            expect(graphqlEndpoint()).to.equal(PRODUCTION_GRAPHQL_URL)

            process.env.NUXT_USE_LOCAL_API = 'true'
            expect(graphqlEndpoint()).to.equal(LOCAL_GRAPHQL_URL)
        } finally {
            if (previous === undefined) {
                delete process.env.NUXT_USE_LOCAL_API
            } else {
                process.env.NUXT_USE_LOCAL_API = previous
            }
        }
    })
})
