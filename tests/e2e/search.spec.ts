import enUS from '../../i18n/locales/en.json' with { type: 'json' }
import { test, expect, type Page, type Route } from '@playwright/test'

/*
 * The search page is exercised against a mocked API. The production API rejects CORS from
 * localhost and the CI seed data is not stable enough to assert on, so every request to the
 * GraphQL endpoint is answered from the fixture below. This keeps the assertions about the
 * UI rather than about whatever happens to be in the database.
 */

const professionals = [
    {
        id: 'p1',
        names: [{ firstName: 'Aiko', middleName: '', lastName: 'Tanaka', locale: 'en_US' }],
        degrees: ['DDS'],
        specialties: ['DENTISTRY'],
        facilityIds: ['f1'],
        spokenLanguages: ['en_US', 'ja_JP'],
        acceptedInsurance: [],
        additionalInfoForPatients: 'Evening appointments available.',
        updatedDate: '2026-08-01T00:00:00.000Z'
    },
    {
        id: 'p2',
        names: [{ firstName: 'Kenji', middleName: '', lastName: 'Sato', locale: 'en_US' }],
        degrees: ['MD'],
        specialties: ['INTERNAL_MEDICINE'],
        facilityIds: ['f1'],
        spokenLanguages: ['ja_JP'],
        acceptedInsurance: [],
        additionalInfoForPatients: '',
        updatedDate: '2026-08-01T00:00:00.000Z'
    },
    {
        id: 'p3',
        names: [{ firstName: 'Maria', middleName: '', lastName: 'Lopez', locale: 'en_US' }],
        degrees: ['DDS'],
        specialties: ['DENTISTRY'],
        facilityIds: ['f2'],
        spokenLanguages: ['en_US', 'es_ES'],
        acceptedInsurance: [],
        additionalInfoForPatients: '',
        updatedDate: '2026-08-01T00:00:00.000Z'
    },
    {
        id: 'p4',
        names: [{ firstName: 'Yuki', middleName: '', lastName: 'Mori', locale: 'en_US' }],
        degrees: ['MD'],
        specialties: ['DERMATOLOGY'],
        facilityIds: ['f3'],
        spokenLanguages: ['ja_JP', 'fr_FR'],
        acceptedInsurance: [],
        additionalInfoForPatients: '',
        updatedDate: '2026-08-01T00:00:00.000Z'
    }
]

function facility(id: string, nameEn: string, professionalIds: string[], cityEn: string, prefectureEn: string) {
    return {
        id,
        nameEn,
        nameJa: `${nameEn} JA`,
        mapLatitude: 35.6,
        mapLongitude: 139.7,
        healthcareProfessionalIds: professionalIds,
        contact: {
            address: {
                addressLine1En: '1-2-3 Example',
                addressLine2En: '',
                addressLine1Ja: '1-2-3',
                addressLine2Ja: '',
                cityJa: cityEn,
                cityEn,
                prefectureJa: prefectureEn,
                prefectureEn,
                postalCode: '100-0001'
            },
            email: 'none',
            googleMapsUrl: 'https://maps.app.goo.gl/example',
            phone: '03-1234-5678',
            website: 'https://example.com'
        },
        updatedDate: '2026-08-01T00:00:00.000Z'
    }
}

const facilities = [
    facility('f1', 'Tokyo Family Clinic', ['p1', 'p2'], 'Shibuya', 'Tokyo'),
    facility('f2', 'Osaka Dental', ['p3'], 'Kita', 'Osaka'),
    facility('f3', 'Sapporo Skin Clinic', ['p4'], 'Chuo', 'Hokkaido')
]

function isApiRequest(url: URL): boolean {
    return (url.hostname === '127.0.0.1' && url.port === '4000') || url.hostname === 'api.findadoc.jp'
}

/**
 * The largest page the real API can actually serve.
 *
 * Facilities are clamped to 100 server-side; professionals are *validated* up to 1000 but the
 * endpoint fails somewhere between 300 and 400 rows, returning a 200 whose body is a
 * `Validation Failed` error. Asking for the whole table in one page therefore broke search in
 * production while every test here passed, because this mock answered anything it was asked.
 * It now refuses an oversized page the same way the real server does, so the suite fails if the
 * client ever asks for more than the API can give.
 */
const MAX_SERVABLE_PAGE = 100

async function mockApi(page: Page, options: { fail?: boolean } = {}) {
    await page.route(isApiRequest, async (route: Route) => {
        if (options.fail) {
            await route.fulfill({ status: 500, contentType: 'application/json', body: '{"errors":[{"message":"down"}]}' })
            return
        }

        const body = route.request().postDataJSON() as { query: string, variables?: { filters?: { limit?: number } } } | null
        const query = body?.query ?? ''
        const requestedLimit = body?.variables?.filters?.limit

        if (typeof requestedLimit === 'number' && requestedLimit > MAX_SERVABLE_PAGE) {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    data: null,
                    errors: [{ message: 'Validation Failed', extensions: { code: 'BAD_USER_INPUT' } }]
                })
            })
            return
        }

        if (query.includes('SearchFacilitiesPage')) {
            await route.fulfill({
                contentType: 'application/json',
                body: JSON.stringify({ data: { facilities, facilitiesTotalCount: facilities.length } })
            })
            return
        }

        if (query.includes('SearchProfessionalsPage')) {
            await route.fulfill({
                contentType: 'application/json',
                body: JSON.stringify({
                    data: { healthcareProfessionals: professionals, healthcareProfessionalsTotalCount: professionals.length }
                })
            })
            return
        }

        await route.fulfill({ contentType: 'application/json', body: '{"data":{}}' })
    })
}

test.describe('Search page', () => {
    /** Requests to Google's Maps SDK, so the tests can assert it is never fetched for the list. */
    let mapsRequests: string[] = []

    test.beforeEach(async ({ page }) => {
        mapsRequests = []
        page.on('request', request => {
            if (request.url().includes('maps.googleapis.com')) {
                mapsRequests.push(request.url())
            }
        })
        await mockApi(page)
    })

    test.describe('Landscape mode', () => {
        test.beforeEach(async ({ page }) => {
            await page.setViewportSize({ width: 1728, height: 1077 })
        })

        test('lists results first and loads no map until asked', async ({ page }) => {
            await page.goto('/search')

            await expect(page.getByTestId('search-result-card')).toHaveCount(3)
            await expect(page.getByTestId('search-result-count')).toHaveText('3 results found')
            await expect(page.getByTestId('search-map-panel')).toHaveCount(0)
            expect(mapsRequests).toEqual([])
        })

        /*
         * Asserts our lazy-load boundary, not Google's rendered map: the SDK is fetched from
         * the network and there is no API key in CI, so whether it finishes painting is not
         * deterministic. What this suite owns is that the panel mounts only once asked and
         * that the SDK is requested only then.
         */
        test('shows the map on demand, and only requests the SDK then', async ({ page }) => {
            await page.goto('/search')
            await expect(page.getByTestId('search-result-card').first()).toBeVisible()
            expect(mapsRequests).toEqual([])

            await page.getByTestId('search-map-toggle').click()

            await expect(page.getByTestId('search-map-panel')).toBeVisible()
            await expect.poll(() => mapsRequests.length).toBeGreaterThan(0)
        })

        test('shows the top nav and footer', async ({ page }) => {
            await page.goto('/search')

            await expect(page.getByTestId('top-nav')).toBeVisible()
            await expect(page.getByTestId('footer')).toBeVisible()
        })

        test('applies specialty, language and prefecture from the URL and reflects them in the controls', async ({ page }) => {
            await page.goto('/search?specialty=DENTISTRY&language=en_US&prefecture=Tokyo')

            await expect(page.getByTestId('search-specialty')).toHaveValue('DENTISTRY')
            await expect(page.getByTestId('search-language')).toHaveValue('en_US')
            await expect(page.getByTestId('search-area')).toHaveValue('Tokyo')
            await expect(page.getByTestId('search-result-card')).toHaveCount(1)
            await expect(page.getByRole('link', { name: 'Tokyo Family Clinic' })).toBeVisible()
        })

        test('updates the URL and the results as soon as a filter changes', async ({ page }) => {
            await page.goto('/search')
            await page.getByTestId('search-specialty').selectOption('DERMATOLOGY')

            await expect(page).toHaveURL(/specialty=DERMATOLOGY/)
            await expect(page.getByTestId('search-result-card')).toHaveCount(1)
            await expect(page.getByRole('link', { name: 'Sapporo Skin Clinic' })).toBeVisible()

            await page.getByTestId('search-clear-filters').click()

            await expect(page).not.toHaveURL(/specialty=/)
            await expect(page.getByTestId('search-result-card')).toHaveCount(3)
        })

        test('ignores a specialty that is not a real enum value', async ({ page }) => {
            await page.goto('/search?specialty=NOT_A_SPECIALTY')

            await expect(page.getByTestId('search-result-card')).toHaveCount(3)
        })

        test('opens a facility in a panel, puts it in the URL, and Back closes it', async ({ page }) => {
            await page.goto('/search')
            await page.getByRole('link', { name: 'Tokyo Family Clinic' }).click()

            const panel = page.getByTestId('search-details-panel')
            await expect(panel).toBeVisible()
            await expect(panel.getByRole('heading', { name: 'Tokyo Family Clinic' })).toBeVisible()
            await expect(panel.getByTestId('search-details-professional')).toHaveCount(2)
            await expect(page).toHaveURL(/facility=f1/)

            await page.goBack()

            await expect(panel).toBeHidden()
            await expect(page).not.toHaveURL(/facility=/)
        })

        test('the back-to-results button closes the panel', async ({ page }) => {
            await page.goto('/search')
            await page.getByRole('link', { name: 'Osaka Dental' }).click()
            await expect(page.getByTestId('search-details-panel')).toBeVisible()

            await page.getByTestId('search-details-close').click()

            await expect(page.getByTestId('search-details-panel')).toBeHidden()
            await expect(page).not.toHaveURL(/facility=/)
        })

        /*
         * Regression guard: closing used to go Back whenever the previous entry was any /search
         * URL, so opening a second facility and closing it reopened the first.
         */
        test('closing after opening two facilities in a row returns to the list', async ({ page }) => {
            await page.goto('/search')
            await page.getByRole('link', { name: 'Tokyo Family Clinic' }).click()
            await expect(page.getByTestId('search-details-panel')).toBeVisible()
            await page.getByTestId('search-details-close').click()
            await expect(page.getByTestId('search-details-panel')).toBeHidden()

            await page.getByRole('link', { name: 'Osaka Dental' }).click()
            await expect(page.getByTestId('search-details-panel')).toBeVisible()
            await page.getByTestId('search-details-close').click()

            await expect(page.getByTestId('search-details-panel')).toBeHidden()
            await expect(page).not.toHaveURL(/facility=/)
            await expect(page.getByTestId('search-result-card')).toHaveCount(3)
        })

        test('Escape closes the details panel from anywhere in it', async ({ page }) => {
            await page.goto('/search')
            await page.getByRole('link', { name: 'Tokyo Family Clinic' }).click()
            await expect(page.getByTestId('search-details-panel')).toBeVisible()

            await page.keyboard.press('Escape')

            await expect(page.getByTestId('search-details-panel')).toBeHidden()
        })

        test('a shared link opens the facility directly', async ({ page }) => {
            await page.goto('/search?facility=f3')

            const panel = page.getByTestId('search-details-panel')
            await expect(panel.getByRole('heading', { name: 'Sapporo Skin Clinic' })).toBeVisible()
        })

        test('shows an empty state with a way out', async ({ page }) => {
            await page.goto('/search?specialty=DENTISTRY&prefecture=Hokkaido')

            const empty = page.getByTestId('search-empty')
            await expect(empty).toBeVisible()
            await expect(empty.getByText(enUS.searchResultsList.noResults)).toBeVisible()

            await empty.getByRole('button', { name: enUS.search.clearFilters }).click()

            await expect(page.getByTestId('search-result-card')).toHaveCount(3)
        })

        test('shows an error state with a retry when the API is down', async ({ page }) => {
            await page.unrouteAll()
            await mockApi(page, { fail: true })
            await page.goto('/search')

            const error = page.getByTestId('search-load-error')
            await expect(error).toBeVisible({ timeout: 20000 })
            await expect(error.getByRole('button', { name: enUS.search.retry })).toBeVisible()
        })
    })

    test.describe('Portrait mode', () => {
        test.beforeEach(async ({ page }) => {
            await page.setViewportSize({ width: 320, height: 568 })
        })

        test('keeps the filters behind a button and the results in front', async ({ page }) => {
            await page.goto('/search')

            await expect(page.getByTestId('search-filters')).toBeHidden()
            await expect(page.getByTestId('search-result-card').first()).toBeVisible()

            await page.getByTestId('search-filters-toggle').click()

            await expect(page.getByTestId('search-filters')).toBeVisible()
            await expect(page.getByTestId('search-specialty')).toBeVisible()
        })

        test('opens details full screen and Back returns to the list', async ({ page }) => {
            await page.goto('/search')
            await page.getByRole('link', { name: 'Tokyo Family Clinic' }).click()

            await expect(page.getByTestId('search-details-panel')).toBeVisible()

            await page.goBack()

            await expect(page.getByTestId('search-details-panel')).toBeHidden()
            await expect(page.getByTestId('search-result-card').first()).toBeVisible()
        })

        test('shows the map above the list on demand', async ({ page }) => {
            await page.goto('/search')
            await page.getByTestId('search-map-toggle').click()

            await expect(page.getByTestId('search-map-panel')).toBeVisible()
        })
    })
})
