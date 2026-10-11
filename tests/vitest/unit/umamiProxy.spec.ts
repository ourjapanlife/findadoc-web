/// <reference types="vitest/globals" />
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { expect } from 'chai'
import { readRedirects } from '../helpers/spaFallbackConfig'
import {
    applyUmamiProxyRedirects,
    proxyUmami,
    umamiDataDomains,
    umamiUpstreams,
    writeUmamiProxyRedirects
} from '@/utils/nuxt/umamiProxy'

describe('umamiUpstreams', () => {
    it('sends Umami Cloud collects to the gateway', () => {
        expect(umamiUpstreams('https://cloud.umami.is/script.js')).to.deep.equal({
            script: 'https://cloud.umami.is/script.js',
            collect: 'https://gateway.umami.is/api/send'
        })
    })

    it('sends a self-hosted collect to that origin', () => {
        expect(umamiUpstreams('https://analytics.example/script.js')).to.deep.equal({
            script: 'https://analytics.example/script.js',
            collect: 'https://analytics.example/api/send'
        })
    })

    it('rejects a non-http script URL', () => {
        expect(umamiUpstreams('not a url')).to.equal(null)
        expect(umamiUpstreams('javascript:alert(1)')).to.equal(null)
    })
})

describe('umamiDataDomains', () => {
    it('allows the www host and the apex', () => {
        expect(umamiDataDomains()).to.equal('www.findadoc.jp,findadoc.jp')
    })
})

describe('applyUmamiProxyRedirects', () => {
    it('rewrites both destinations and keeps them ahead of the 404 catch-all', () => {
        const next = applyUmamiProxyRedirects(readRedirects(), 'https://analytics.example/custom.js')
        const rules = next.split('\n').filter(line =>
            line.startsWith('/stats.js') || line.startsWith('/api/send'))

        expect(rules).to.deep.equal([
            '/stats.js    https://analytics.example/custom.js    200',
            '/api/send    https://analytics.example/api/send    200'
        ])

        const catchAllAt = next.search(/^\/\*\s+\/404\.html\s+404/m)
        expect(next.indexOf(rules[0] ?? '')).to.be.lessThan(catchAllAt)
        expect(next.indexOf(rules[1] ?? '')).to.be.lessThan(catchAllAt)
    })
})

describe('writeUmamiProxyRedirects', () => {
    const previousUrl = process.env.NUXT_PUBLIC_UMAMI_URL
    const previousSiteId = process.env.NUXT_PUBLIC_UMAMI_SITE_ID

    afterEach(() => {
        if (previousUrl === undefined) {
            delete process.env.NUXT_PUBLIC_UMAMI_URL
        } else {
            process.env.NUXT_PUBLIC_UMAMI_URL = previousUrl
        }
        if (previousSiteId === undefined) {
            delete process.env.NUXT_PUBLIC_UMAMI_SITE_ID
        } else {
            process.env.NUXT_PUBLIC_UMAMI_SITE_ID = previousSiteId
        }
    })

    it('does not rewrite the source redirects file', async () => {
        process.env.NUXT_PUBLIC_UMAMI_URL = 'https://analytics.example/script.js'
        process.env.NUXT_PUBLIC_UMAMI_SITE_ID = 'site-1'
        const source = resolve(process.cwd(), 'public')
        const before = await readFile(join(source, '_redirects'), 'utf8')
        await writeUmamiProxyRedirects(source)
        expect(await readFile(join(source, '_redirects'), 'utf8')).to.equal(before)
    })

    it('rewrites a generated publish dir from the env URL', async () => {
        process.env.NUXT_PUBLIC_UMAMI_URL = 'https://analytics.example/script.js'
        process.env.NUXT_PUBLIC_UMAMI_SITE_ID = 'site-1'
        const dir = await mkdtemp(join(tmpdir(), 'umami-redirects-'))
        try {
            await writeFile(join(dir, '_redirects'), readRedirects())
            await writeUmamiProxyRedirects(dir)
            const next = await readFile(join(dir, '_redirects'), 'utf8')
            expect(next).to.include('https://analytics.example/script.js')
            expect(next).to.include('https://analytics.example/api/send')
        } finally {
            await rm(dir, { recursive: true, force: true })
        }
    })
})

describe('proxyUmami', () => {
    const request = {
        pathname: '/stats.js',
        method: 'GET',
        scriptUrl: 'https://cloud.umami.is/script.js',
        body: '',
        userAgent: 'FindADocTest',
        forwardedFor: '203.0.113.8'
    }

    it('ignores unrelated paths', async () => {
        expect(await proxyUmami({ ...request, pathname: '/about' })).to.equal(null)
    })

    it('returns 404 when the upstream script URL is unset', async () => {
        const result = await proxyUmami({ ...request, scriptUrl: '' })
        expect(result?.status).to.equal(404)
    })

    it('fetches the cloud script', async () => {
        let called = ''
        const fetchImpl = (async (url: string) => {
            called = url
            return new Response('tracker()', {
                status: 200,
                headers: { 'content-type': 'application/javascript' }
            })
        }) as typeof fetch

        const result = await proxyUmami(request, fetchImpl)
        expect(called).to.equal('https://cloud.umami.is/script.js')
        expect(result).to.deep.equal({
            status: 200,
            contentType: 'application/javascript',
            cacheControl: 'public, max-age=3600',
            body: 'tracker()'
        })
    })

    it('forwards a collect post to the gateway with the visitor ip and user agent', async () => {
        let called = ''
        let init: RequestInit | undefined
        const fetchImpl = (async (url: string, options?: RequestInit) => {
            called = url
            init = options
            return new Response('{"ok":true}', {
                status: 200,
                headers: { 'content-type': 'application/json' }
            })
        }) as typeof fetch

        const result = await proxyUmami({
            ...request,
            pathname: '/api/send',
            method: 'POST',
            body: '{"type":"event"}'
        }, fetchImpl)

        expect(called).to.equal('https://gateway.umami.is/api/send')
        expect(init?.method).to.equal('POST')
        expect(init?.body).to.equal('{"type":"event"}')
        expect(new Headers(init?.headers).get('user-agent')).to.equal('FindADocTest')
        expect(new Headers(init?.headers).get('x-forwarded-for')).to.equal('203.0.113.8')
        expect(result?.status).to.equal(200)
        expect(result?.body).to.equal('{"ok":true}')
    })

    it('rejects a collect request that is not a post', async () => {
        const result = await proxyUmami({ ...request, pathname: '/api/send', method: 'GET' })
        expect(result?.status).to.equal(405)
    })

    it('returns 502 when the upstream fetch fails', async () => {
        const fetchImpl = (async () => {
            throw new Error('offline')
        }) as typeof fetch
        const result = await proxyUmami(request, fetchImpl)
        expect(result?.status).to.equal(502)
    })
})
