import { test, expect } from '@playwright/test'
import { PAGE_META_TITLE_ROUTES } from '../../utils/pageTitles'
import { facilityIdFromSlugParam } from '../../utils/clinicPath'
import { hubSitemapUrls } from '../../utils/hubIndex'
import { canonicalUrl } from '../../utils/seo'
import { SITE_SITEMAP_URL, SITE_SOCIAL_IMAGE, SITE_TITLE } from '../../utils/site'

const publicPaths = Object.values(PAGE_META_TITLE_ROUTES)

function facilitiesFromClinicSitemapPaths(clinicPaths: readonly string[]) {
    return clinicPaths.flatMap(path => {
        const parts = path.split('/').filter(Boolean)
        const prefectureEn = parts[1]
        const cityEn = parts[2]
        const slugParam = parts[3]
        const id = facilityIdFromSlugParam(slugParam)
        if (!prefectureEn || !cityEn || !id) {
            return []
        }
        return [{
            id,
            contact: { address: { prefectureEn, cityEn } }
        }]
    })
}

test.describe('Discovery and social meta', () => {
    test('robots.txt is plaintext, disallows private trees, and names the sitemap', async ({ request }) => {
        const response = await request.get('/robots.txt')

        expect(response.status()).toBe(200)
        expect(response.headers()['content-type']).toMatch(/text\/plain/)

        const body = await response.text()
        expect(body).toMatch(/^User-agent:\s+\*/m)
        expect(body).toContain('Disallow: /moderation')
        expect(body).toContain('Disallow: /my-page')
        expect(body).toContain('Disallow: /login')
        expect(body).toContain(`Sitemap: ${SITE_SITEMAP_URL}`)
    })

    test('sitemap.xml lists every public URL and none of the private trees', async ({ request }) => {
        const response = await request.get('/sitemap.xml')

        expect(response.status()).toBe(200)
        expect(response.headers()['content-type']).toMatch(/xml/)

        const body = await response.text()
        expect(body).toMatch(/<urlset\b/)

        const locs = [...body.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)]
            .map(match => match[1]?.trim())
            .filter((loc): loc is string => Boolean(loc))
        const paths = locs.map(loc => {
            const pathname = new URL(loc).pathname
            return pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname || '/'
        })

        const clinicPath = /^\/clinic\/[^/]+\/[^/]+\/.+--.+$/
        const doctorPath = /^\/doctor\/.+--.+$/
        const clinicPaths = paths.filter(path => path.startsWith('/clinic/'))
        const doctorPaths = paths.filter(path => path.startsWith('/doctor/'))
        const publicPathSet = new Set<string>(publicPaths)
        const expectedHubPaths = hubSitemapUrls(facilitiesFromClinicSitemapPaths(clinicPaths))
            .map(url => url.loc)
        const leftoverPaths = paths.filter(path => (
            !path.startsWith('/clinic/')
            && !path.startsWith('/doctor/')
            && !publicPathSet.has(path)
        ))

        expect(paths.filter(path => publicPathSet.has(path)).sort()).toEqual([...publicPaths].sort())
        expect(leftoverPaths.sort()).toEqual([...expectedHubPaths].sort())
        for (const path of clinicPaths) {
            expect(path).toMatch(clinicPath)
        }
        for (const path of doctorPaths) {
            expect(path).toMatch(doctorPath)
        }
        expect(body).not.toContain(`${new URL(locs[0] ?? 'http://localhost/').origin}/login`)
        expect(body).not.toContain('/my-page')
        expect(body).not.toContain('/moderation')
    })

    test('the social preview image is reachable', async ({ request }) => {
        const response = await request.get('/findadoc-social.png')
        expect(response.status()).toBe(200)
        expect(response.headers()['content-type']).toMatch(/image\/png/)
        expect(new URL(SITE_SOCIAL_IMAGE).pathname).toBe('/findadoc-social.png')
    })

    test('every public page has one canonical, Open Graph type/site/locale, and a large Twitter card', async ({ page }) => {
        for (const path of publicPaths) {
            await page.goto(path)

            const canonical = page.locator('link[rel="canonical"]')
            await expect(canonical).toHaveCount(1)
            await expect(canonical).toHaveAttribute('href', canonicalUrl(path))

            await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonicalUrl(path))
            await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website')
            await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute('content', SITE_TITLE)
            await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'en_US')
            await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', SITE_SOCIAL_IMAGE)
            await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image')
            await expect(page.locator('meta[name="robots"][content="noindex"]')).toHaveCount(0)
        }
    })
})
