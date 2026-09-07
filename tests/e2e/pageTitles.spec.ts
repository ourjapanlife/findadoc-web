import enUS from '../../i18n/locales/en.json' with { type: 'json' }
import { test, expect } from '@playwright/test'
import { PAGE_META_TITLE_ROUTES } from '../../utils/pageTitles'
import { formatPageTitle, SITE_TITLE } from '../../utils/site'

const publicPages = (Object.entries(PAGE_META_TITLE_ROUTES) as [keyof typeof enUS.pageMeta, string][])
    .filter(([, path]) => path !== '/login')

test.describe('Public page titles', () => {
    test('every public page has a unique branded title under 60 characters', async ({ page }) => {
        const titles: string[] = []

        for (const [key, path] of publicPages) {
            await page.goto(path)
            const title = await page.title()
            const expected = formatPageTitle(enUS.pageMeta[key])

            expect(title, path).toBe(expected)
            expect(title, path).toContain(SITE_TITLE)
            expect(title.length, `${path}: ${title}`).toBeLessThanOrEqual(60)
            expect(title, path).not.toBe(`${SITE_TITLE} · ${SITE_TITLE}`)

            titles.push(title)
        }

        expect(new Set(titles).size).toBe(titles.length)
    })
})
