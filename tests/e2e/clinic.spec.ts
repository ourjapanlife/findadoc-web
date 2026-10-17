import { facilityDocumentTitle, facilityPath } from '../../utils/clinicPath'
import { canonicalUrl } from '../../utils/seo'
import { formatPageTitle } from '../../utils/site'
import { test, expect } from '@playwright/test'
import { jsonLdBlocks } from './jsonLd'
import { assertLocalApiOk, requireLocalRows, skipIfLocalApiIsDown } from './localApi'

const UNKNOWN_CLINIC_PATH
    = '/clinic/tokyo/shibuya/missing--00000000-0000-4000-8000-000000000001'

test.describe('Facility pages', () => {
    test('an unknown id is a real HTTP 404, not an SPA 200', async ({ request }) => {
        const response = await request.get(UNKNOWN_CLINIC_PATH)

        expect(response.status()).toBe(404)
    })

    test('renders a seeded facility when the local API is up', async ({ page, request }) => {
        let facility: {
            id: string
            nameEn: string
            contact?: { address?: { cityEn?: string, prefectureEn?: string } }
        } | undefined

        try {
            const response = await request.post('http://127.0.0.1:4000', {
                data: {
                    query: `query {
                        facilities(filters: { limit: 1 }) {
                            id
                            nameEn
                            contact { address { cityEn prefectureEn } }
                        }
                    }`
                }
            })
            const json = await response.json() as {
                data?: { facilities?: typeof facility[] }
                errors?: unknown[]
            }
            assertLocalApiOk(json)
            facility = requireLocalRows(json.data?.facilities, 'local API returned no facilities')[0]
        } catch (error) {
            skipIfLocalApiIsDown(error)
            return
        }

        expect(facility?.id).toBeTruthy()
        expect(facility?.nameEn).toBeTruthy()
        if (!facility?.id || !facility.nameEn) {
            return
        }

        const path = facilityPath(facility)
        await page.goto(path)

        await expect(page.getByTestId('clinic-page')).toBeVisible()
        await expect(page.getByRole('heading', { level: 1, name: facility.nameEn })).toBeVisible()
        await expect(page).toHaveTitle(formatPageTitle(facilityDocumentTitle(facility.nameEn)))
        await expect(page.getByTestId('clinic-back-to-search')).toBeVisible()
        await expect(page.getByTestId('breadcrumbs')).toBeVisible()

        const blocks = await jsonLdBlocks(page)
        const clinic = blocks.find(block => block['@type'] === 'MedicalClinic')
        expect(clinic?.name).toBe(facility.nameEn)
        expect(clinic?.url).toBe(canonicalUrl(path))
        const crumbs = blocks.find(block => block['@type'] === 'BreadcrumbList')
        expect(Array.isArray(crumbs?.itemListElement)).toBe(true)
    })
})
