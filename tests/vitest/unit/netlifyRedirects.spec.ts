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

    /*
     * /search is ssr: false, so generate emits no page for it and the 404 catch-all
     * claims it unless a fallback is listed first. Missing it took the deploy preview
     * and CI to a 404 while dev worked, because dev never consults either file.
     */
    /*
     * /search takes an exact rewrite and deliberately no `/search/*` wildcard. It has no
     * sub-routes, and the wildcard turned stray paths under it — notably the analytics
     * tag's malformed `/search/%22%22` — into 200 HTML, which the browser then parsed as
     * JavaScript and threw on before the app could hydrate.
     */
    it('does not give /search a wildcard, only an exact rewrite', () => {
        expect(readRedirects()).to.not.match(/^\/search\/\*/m)
        const rewrites = readServeJson().rewrites ?? []
        expect(rewrites.some(rule => rule.source.startsWith('/search/'))).to.equal(false)
    })

    it('gives /search a fallback in both files', () => {
        const redirects = readRedirects()
        const spa = redirectRuleIndex(redirects, /^\/search\s+\/200\.html\s+200/m)
        const notFound = redirectRuleIndex(redirects, /^\/\*\s+\/404\.html\s+404/m)
        expect(spa, '/search rewrite in _redirects').to.be.greaterThan(-1)
        expect(spa).to.be.lessThan(notFound)

        const rewrites = readServeJson().rewrites ?? []
        expect(rewrites.some(rule => rule.source === '/search' && rule.destination === '/200.html')).to.equal(true)
    })
})
