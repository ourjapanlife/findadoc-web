/// <reference types="vitest/globals" />
import { expect } from 'chai'
import {
    readRedirects,
    readServeJson,
    redirectRuleIndex
} from '../helpers/spaFallbackConfig'

describe('SPA fallbacks', () => {
    it('rewrites profile deep links to the SPA shell before the 404 catch-all', () => {
        const redirects = readRedirects()
        const spa = redirectRuleIndex(redirects, /^\/u\/\*\s+\/200\.html\s+200/m)
        const notFound = redirectRuleIndex(redirects, /^\/\*\s+\/404\.html\s+404/m)

        expect(spa).to.be.greaterThan(-1)
        expect(notFound).to.be.greaterThan(-1)
        expect(spa).to.be.lessThan(notFound)
    })

    it('rewrites other non-prerendered app routes to the SPA shell', () => {
        const redirects = readRedirects()
        for (const path of ['/login', '/my-page']) {
            const exact = new RegExp(`^${path}\\s+/200\\.html\\s+200`, 'm')
            const nested = new RegExp(`^${path}/\\*\\s+/200\\.html\\s+200`, 'm')
            expect(redirectRuleIndex(redirects, exact), `${path} exact rewrite`).to.be.greaterThan(-1)
            expect(redirectRuleIndex(redirects, nested), `${path} nested rewrite`).to.be.greaterThan(-1)
        }
    })

    it('does not use a blanket 200 catch-all', () => {
        expect(readRedirects()).to.not.match(/^\/\*\s+\/(?:index|200)\.html\s+200/m)
    })

    it('mirrors profile SPA fallbacks in serve.json for nuxi start / CI', () => {
        const rewrites = readServeJson().rewrites ?? []
        expect(rewrites.some(rule => rule.source.startsWith('/u/') && rule.destination === '/200.html')).to.equal(true)
        expect(rewrites.some(rule => rule.source === '/**' || rule.source === '*')).to.equal(false)
    })
})
