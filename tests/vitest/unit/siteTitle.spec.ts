import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect } from 'chai'
import {
    isEntityRoute,
    isUntitledRoute,
    PAGE_META_TITLE_ROUTES,
    pageMetaI18nKey,
    pageTitleKeyForPath
} from '@/utils/pageTitles'
import { formatPageTitle, SITE_TITLE } from '@/utils/site'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../../..')
const localesDir = join(rootDir, 'i18n/locales')
const pagesDir = join(rootDir, 'pages')

function listVuePages(dir: string, prefix = ''): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const relative = prefix ? `${prefix}/${entry.name}` : entry.name
        if (entry.isDirectory()) {
            return listVuePages(join(dir, entry.name), relative)
        }
        return relative.endsWith('.vue') ? [relative] : []
    })
}

function vuePageFileToRoute(relativeToPagesDir: string): string {
    const withoutExt = relativeToPagesDir.replace(/\\/g, '/').replace(/\.vue$/, '')
    if (withoutExt === 'index') {
        return '/'
    }
    return `/${withoutExt.replace(/\/index$/, '')}`
}

describe('formatPageTitle', () => {
    it('falls back to the brand when the page has no title', () => {
        expect(formatPageTitle()).to.equal(SITE_TITLE)
        expect(formatPageTitle('')).to.equal(SITE_TITLE)
        expect(formatPageTitle('   ')).to.equal(SITE_TITLE)
        expect(formatPageTitle(null)).to.equal(SITE_TITLE)
    })

    it('does not double the brand name', () => {
        expect(formatPageTitle(SITE_TITLE)).to.equal(SITE_TITLE)
        expect(formatPageTitle(`About us · ${SITE_TITLE}`)).to.equal(`About us · ${SITE_TITLE}`)
    })

    it('wraps a page title with the brand', () => {
        expect(formatPageTitle('About us')).to.equal(`About us · ${SITE_TITLE}`)
    })
})

describe('pageMeta titles', () => {
    const localeFiles = readdirSync(localesDir).filter(name => name.endsWith('.json'))
    const en = JSON.parse(readFileSync(join(localesDir, 'en.json'), 'utf-8')) as {
        pageMeta: Record<string, string>
    }

    it('keeps English titles under 60 characters once branded', () => {
        for (const [key, title] of Object.entries(en.pageMeta)) {
            expect(formatPageTitle(title).length, key).to.be.at.most(60)
        }
    })

    it('keeps every locale\'s titles under 60 characters once branded', () => {
        for (const fileName of localeFiles) {
            const locale = JSON.parse(readFileSync(join(localesDir, fileName), 'utf-8')) as {
                pageMeta: Record<string, string>
            }

            for (const [key, title] of Object.entries(locale.pageMeta)) {
                expect(
                    formatPageTitle(title).length,
                    `${fileName} ${key}: ${formatPageTitle(title)}`
                ).to.be.at.most(60)
            }
        }
    })

    it('assigns every pageMeta key to a real page, and every page to a title or an explicit skip', () => {
        expect(Object.keys(en.pageMeta).sort()).to.deep.equal(Object.keys(PAGE_META_TITLE_ROUTES).sort())

        const pageFiles = listVuePages(pagesDir)

        for (const file of pageFiles) {
            const route = vuePageFileToRoute(file)
            const titled = pageTitleKeyForPath(route) !== undefined
            const skipped = isUntitledRoute(route)
            const entity = isEntityRoute(route)
            expect(
                titled || skipped || entity,
                `${file} (${route}) needs an entry in PAGE_META_TITLE_ROUTES, an untitled prefix, or an entity prefix`
            ).to.equal(true)
        }

        for (const [key, route] of Object.entries(PAGE_META_TITLE_ROUTES)) {
            const candidates = route === '/'
                ? ['index.vue']
                : [`${route.slice(1)}.vue`, `${route.slice(1)}/index.vue`]
            const found = candidates.some(candidate => pageFiles.includes(candidate))
            expect(found, `${key} maps to ${route}, but ${candidates.join(' or ')} is missing`).to.equal(true)
        }
    })
})

describe('pageTitleKeyForPath', () => {
    it('resolves titled routes, including a trailing slash', () => {
        expect(pageTitleKeyForPath('/about')).to.equal('aboutTitle')
        expect(pageTitleKeyForPath('/about/')).to.equal('aboutTitle')
        expect(pageTitleKeyForPath('/')).to.equal('homeTitle')
    })

    it('returns undefined for untitled and unknown routes', () => {
        expect(pageTitleKeyForPath('/my-page')).to.equal(undefined)
        expect(pageTitleKeyForPath('/login')).to.equal(undefined)
        expect(pageTitleKeyForPath('/clinic/tokyo/nakano/a-one--f1')).to.equal(undefined)
        expect(pageTitleKeyForPath('/doctor/aiko-tanaka--p1')).to.equal(undefined)
        expect(pageTitleKeyForPath('/not-a-page')).to.equal(undefined)
    })
})

describe('isEntityRoute', () => {
    it('treats clinic and doctor detail URLs as entity pages that own their titles', () => {
        expect(isEntityRoute('/clinic')).to.equal(true)
        expect(isEntityRoute('/clinic/tokyo/nakano/a-one--f1')).to.equal(true)
        expect(isEntityRoute('/doctor')).to.equal(true)
        expect(isEntityRoute('/doctor/aiko-tanaka--p1')).to.equal(true)
        expect(isEntityRoute('/search')).to.equal(false)
        expect(isEntityRoute('/about')).to.equal(false)
    })
})

describe('isUntitledRoute', () => {
    it('treats authenticated and Auth0 surfaces as untitled, including nested paths', () => {
        expect(isUntitledRoute('/my-page')).to.equal(true)
        expect(isUntitledRoute('/my-page/edit-facility/1')).to.equal(true)
        expect(isUntitledRoute('/u/someone/')).to.equal(true)
        expect(isUntitledRoute('/login')).to.equal(true)
        expect(isUntitledRoute('/about')).to.equal(false)
    })
})

describe('pageMetaI18nKey', () => {
    it('builds a pageMeta message path', () => {
        expect(pageMetaI18nKey('aboutTitle')).to.equal('pageMeta.aboutTitle')
    })
})
