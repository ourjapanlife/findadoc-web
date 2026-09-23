import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect } from 'chai'
import {
    canonicalUrl,
    DEFAULT_OG_LOCALE,
    isNoindexRoute,
    openGraphLocale,
    ROBOTS_DISALLOW_PATHS
} from '@/utils/seo'
import { SITE_ORIGIN, SITE_SITEMAP_URL, SITE_SOCIAL_IMAGE } from '@/utils/site'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../../..')

function readPublic(filename: string): string {
    return readFileSync(join(rootDir, 'public', filename), 'utf8')
}

function parseRobotsTxt(text: string) {
    const disallows = [...text.matchAll(/^Disallow:\s+(\S+)/gm)].map(match => match[1])
    const sitemap = /^Sitemap:\s+(\S+)/m.exec(text)?.[1]
    return { disallows, sitemap }
}

describe('canonicalUrl', () => {
    it('self-references the production origin, without query strings', () => {
        expect(canonicalUrl('/')).to.equal(`${SITE_ORIGIN}/`)
        expect(canonicalUrl('/about')).to.equal(`${SITE_ORIGIN}/about`)
        expect(canonicalUrl('/about/')).to.equal(`${SITE_ORIGIN}/about`)
        expect(canonicalUrl('/search?specialty=dentistry')).to.equal(`${SITE_ORIGIN}/search`)
        expect(canonicalUrl('/npo#documents')).to.equal(`${SITE_ORIGIN}/npo`)
    })
})

describe('openGraphLocale', () => {
    it('converts vue-i18n codes to the Open Graph underscore form', () => {
        expect(openGraphLocale('en-US')).to.equal(DEFAULT_OG_LOCALE)
        expect(openGraphLocale('ja-JP')).to.equal('ja_JP')
        expect(openGraphLocale('en_US')).to.equal('en_US')
    })
})

describe('isNoindexRoute', () => {
    it('matches the robots.txt disallow prefixes, including nested paths', () => {
        expect(isNoindexRoute('/moderation')).to.equal(true)
        expect(isNoindexRoute('/my-page')).to.equal(true)
        expect(isNoindexRoute('/my-page/edit-facility/1')).to.equal(true)
        expect(isNoindexRoute('/login')).to.equal(true)
        expect(isNoindexRoute('/about')).to.equal(false)
        expect(isNoindexRoute('/u/someone')).to.equal(false)
        expect(isNoindexRoute('/search')).to.equal(false)
        expect(isNoindexRoute('/search?specialty=dentistry')).to.equal(true)
        expect(isNoindexRoute('/search', { specialty: 'dentistry' })).to.equal(true)
        expect(isNoindexRoute('/search?facility=abc')).to.equal(true)
        expect(isNoindexRoute('/search?page=2')).to.equal(true)
        expect(isNoindexRoute('/search', { specialty: ['', 'dentistry'] })).to.equal(true)
        expect(isNoindexRoute('/404')).to.equal(true)
    })
})

describe('robots.txt', () => {
    it('disallows the private prefixes and points at the sitemap URL', () => {
        const { disallows, sitemap } = parseRobotsTxt(readPublic('robots.txt'))

        expect(disallows).to.deep.equal([...ROBOTS_DISALLOW_PATHS])
        expect(sitemap).to.equal(SITE_SITEMAP_URL)
    })
})

describe('social preview assets', () => {
    it('serves the Open Graph image from the publish root', () => {
        expect(existsSync(join(rootDir, 'public', 'findadoc-social.png'))).to.equal(true)
        expect(SITE_SOCIAL_IMAGE).to.equal(`${SITE_ORIGIN}/findadoc-social.png`)
    })
})

describe('inert Nuxt 2 head leftovers', () => {
    it('does not keep hid keys in nuxt.config or a pages/_headers file', () => {
        const nuxtConfig = readFileSync(join(rootDir, 'nuxt.config.ts'), 'utf8')
        expect(nuxtConfig).to.not.match(/\bhid\s*:/)
        expect(existsSync(join(rootDir, 'pages', '_headers'))).to.equal(false)
    })
})

describe('prerender HTML layout', () => {
    it('writes extensionful files so Netlify Pretty URLs match slashless canonicals', () => {
        const nuxtConfig = readFileSync(join(rootDir, 'nuxt.config.ts'), 'utf8')
        const prerender = nitroPrerenderBlock(nuxtConfig)

        expect(prerender).to.match(/autoSubfolderIndex:\s*false\b/)
        expect(prerender).not.to.match(/autoSubfolderIndex:\s*true\b/)
        expect(canonicalUrl('/about/')).to.equal(`${SITE_ORIGIN}/about`)
        expect(canonicalUrl('/tokyo/')).to.equal(`${SITE_ORIGIN}/tokyo`)
    })
})

/** `nitro.prerender { … }` with comment lines removed, so this cannot pass on comment text. */
function nitroPrerenderBlock(nuxtConfig: string): string {
    const code = nuxtConfig
        .split('\n')
        .filter(line => {
            const trimmed = line.trim()
            return trimmed.length > 0
                && !trimmed.startsWith('//')
                && !trimmed.startsWith('/*')
                && !trimmed.startsWith('*')
        })
        .join('\n')

    const nitroStart = code.search(/^\s*nitro:\s*\{/m)
    if (nitroStart < 0) {
        return ''
    }

    const fromNitro = code.slice(nitroStart)
    const prerenderStart = fromNitro.search(/prerender:\s*\{/)
    if (prerenderStart < 0) {
        return ''
    }

    const fromPrerender = fromNitro.slice(prerenderStart)
    const open = fromPrerender.indexOf('{')
    let depth = 0
    for (let index = open; index < fromPrerender.length; index++) {
        if (fromPrerender[index] === '{') {
            depth++
        } else if (fromPrerender[index] === '}') {
            depth--
            if (depth === 0) {
                return fromPrerender.slice(open + 1, index)
            }
        }
    }

    return ''
}
