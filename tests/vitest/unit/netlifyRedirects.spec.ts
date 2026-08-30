import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect } from 'chai'

function readRedirects(): string {
    return readFileSync(join(process.cwd(), 'public/_redirects'), 'utf8')
}

function ruleIndex(redirects: string, pattern: RegExp): number {
    const match = pattern.exec(redirects)
    return match?.index ?? -1
}

describe('Netlify SPA fallbacks', () => {
    it('rewrites profile deep links to the SPA shell before the 404 catch-all', () => {
        const redirects = readRedirects()
        const spa = ruleIndex(redirects, /^\/u\/\*\s+\/200\.html\s+200/m)
        const notFound = ruleIndex(redirects, /^\/\*\s+\/404\.html\s+404/m)

        expect(spa).to.be.greaterThan(-1)
        expect(notFound).to.be.greaterThan(-1)
        expect(spa).to.be.lessThan(notFound)
    })

    it('rewrites other non-prerendered app routes to the SPA shell', () => {
        const redirects = readRedirects()
        for (const path of ['/login', '/my-page', '/moderation']) {
            const exact = new RegExp(`^${path}\\s+/200\\.html\\s+200`, 'm')
            const nested = new RegExp(`^${path}/\\*\\s+/200\\.html\\s+200`, 'm')
            expect(ruleIndex(redirects, exact), `${path} exact rewrite`).to.be.greaterThan(-1)
            expect(ruleIndex(redirects, nested), `${path} nested rewrite`).to.be.greaterThan(-1)
        }
    })

    it('does not use a blanket 200 catch-all', () => {
        expect(readRedirects()).to.not.match(/^\/\*\s+\/(?:index|200)\.html\s+200/m)
    })
})
