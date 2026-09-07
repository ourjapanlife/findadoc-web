import enUS from '../../i18n/locales/en.json' with { type: 'json' }
import { test, expect } from '@playwright/test'
import { PAGE_META_TITLE_ROUTES, type PageMetaTitleKey } from '../../utils/pageTitles'
import { formatPageTitle, SITE_TITLE } from '../../utils/site'

const titledPages = Object.entries(PAGE_META_TITLE_ROUTES) as [PageMetaTitleKey, string][]

test.describe('Page titles', () => {
    test('every mapped page has a unique branded title under 60 characters', async ({ page }) => {
        const titles: string[] = []

        for (const [key, path] of titledPages) {
            const expected = formatPageTitle(enUS.pageMeta[key])

            await page.goto(path)
            // Client-only routes ship the generate shell. /login also suspends on Auth0,
            // so the Vue route can lag behind the URL; toHaveTitle waits until useHead
            // reads window.location and applies the mapped title.
            await expect(page).toHaveTitle(expected)
            expect(expected, path).toContain(SITE_TITLE)
            expect(expected.length, `${path}: ${expected}`).toBeLessThanOrEqual(60)
            expect(expected, path).not.toBe(`${SITE_TITLE} · ${SITE_TITLE}`)

            titles.push(expected)
        }

        expect(new Set(titles).size).toBe(titles.length)
    })
})
