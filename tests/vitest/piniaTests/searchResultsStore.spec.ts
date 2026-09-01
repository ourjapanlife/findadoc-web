import { setActivePinia, createPinia } from 'pinia'
import { expect } from 'chai'
import { vi, beforeEach, describe, it } from 'vitest'
import type { Facility, HealthcareProfessional } from '~/typedefs/gqlTypes'

const graphQLClientRequestWithRetry = vi.fn()

vi.mock('~/utils/graphql', () => ({
    gqlClient: { request: vi.fn() },
    graphQLClientRequestWithRetry: (...args: unknown[]) => graphQLClientRequestWithRetry(...args)
}))

vi.mock('../../../utils/graphql.js', () => ({
    gqlClient: { request: vi.fn() },
    graphQLClientRequestWithRetry: (...args: unknown[]) => graphQLClientRequestWithRetry(...args)
}))

const { useSearchResultsStore } = await import('~/stores/searchResultsStore')

const TOTAL_FACILITIES = 250
const TARGET_CITY = 'Meguro'
/** Deliberately past the 100-item first batch — this is what the pagination bug hid. */
const TARGET_CITY_FIRST_INDEX = 150
const TARGET_CITY_COUNT = 11

function buildFacility(index: number): Facility {
    const isInTargetCity = index >= TARGET_CITY_FIRST_INDEX
      && index < TARGET_CITY_FIRST_INDEX + TARGET_CITY_COUNT

    return {
        id: `facility-${index}`,
        nameEn: `Clinic ${index}`,
        nameJa: `クリニック${index}`,
        mapLatitude: 35.6,
        mapLongitude: 139.7,
        healthcareProfessionalIds: [`professional-${index}`],
        contact: {
            address: {
                cityEn: isInTargetCity ? TARGET_CITY : `Other City ${index}`,
                cityJa: isInTargetCity ? '目黒' : `他の市${index}`,
                prefectureEn: 'Tokyo',
                prefectureJa: '東京都',
                postalCode: '000-0000',
                addressLine1En: '1-1-1',
                addressLine2En: '',
                addressLine1Ja: '1-1-1',
                addressLine2Ja: ''
            }
        }
    } as unknown as Facility
}

const allFacilities = Array.from({ length: TOTAL_FACILITIES }, (_, index) => buildFacility(index))

function buildProfessional(facilityIndex: number): HealthcareProfessional {
    return {
        id: `professional-${facilityIndex}`,
        names: [{ firstName: 'Test', middleName: '', lastName: `Doctor ${facilityIndex}`, locale: 'en_US' }],
        facilityIds: [`facility-${facilityIndex}`],
        specialties: [],
        spokenLanguages: [],
        degrees: [],
        acceptedInsurance: []
    } as unknown as HealthcareProfessional
}

/** Stands in for the API: honours limit/offset so the store's real pagination loop runs. */
function respondTo(queryDocument: string, variables: { filters?: Record<string, unknown> }) {
    const filters = variables?.filters ?? {}

    if (queryDocument.includes('MapPoints')) {
        return { data: { facilities: allFacilities.map(facility => ({ id: facility.id })) }, errors: [], hasErrors: false }
    }

    if (queryDocument.includes('QueryFacilities')) {
        const offset = (filters.offset as number) ?? 0
        const limit = (filters.limit as number) ?? 100

        return { data: { facilities: allFacilities.slice(offset, offset + limit) }, errors: [], hasErrors: false }
    }

    if (queryDocument.includes('searchHealthcareProfessionals')) {
        const requestedIds = (filters.ids as string[]) ?? []
        const professionals = requestedIds.map(id =>
            buildProfessional(Number(id.replace('professional-', ''))))

        return { data: { healthcareProfessionals: professionals }, errors: [], hasErrors: false }
    }

    throw new Error(`Unexpected query: ${queryDocument}`)
}

describe('searchResultsStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        graphQLClientRequestWithRetry.mockReset()
        graphQLClientRequestWithRetry.mockImplementation(
            (_requestFn: unknown, queryDocument: string, variables: { filters?: Record<string, unknown> }) =>
                Promise.resolve(respondTo(queryDocument, variables))
        )
    })

    describe('city filtering across paginated batches', () => {
        /*
         * Regression test. `fetchAllFacilities` used to decide whether more batches remained by
         * comparing the length of an already city-filtered batch against the batch size. Any
         * active city filter therefore stopped pagination after the first 100 facilities, so
         * cities that appear only later in the result set returned zero matches.
         */
        it('finds facilities in a city that appears only after the first batch', async () => {
            const searchResultsStore = useSearchResultsStore()

            searchResultsStore.selectedCity = TARGET_CITY

            await searchResultsStore.search()

            expect(searchResultsStore.totalResults).to.equal(TARGET_CITY_COUNT)
            expect(searchResultsStore.searchResultsList).to.have.lengthOf(TARGET_CITY_COUNT)
            searchResultsStore.searchResultsList.forEach(facility => {
                expect(facility.contact?.address.cityEn).to.equal(TARGET_CITY)
            })
        })

        it('pages through every batch rather than stopping at the first', async () => {
            const searchResultsStore = useSearchResultsStore()

            searchResultsStore.selectedCity = TARGET_CITY

            await searchResultsStore.search()

            const facilityRequestOffsets = graphQLClientRequestWithRetry.mock.calls
                .filter(call => String(call[1]).includes('QueryFacilities'))
                .map(call => (call[2] as { filters: { offset: number } }).filters.offset)

            expect(facilityRequestOffsets).to.deep.equal([0, 100, 200])
        })

        it('matches on the Japanese city name as well as the English one', async () => {
            const searchResultsStore = useSearchResultsStore()

            searchResultsStore.selectedCity = '目黒'

            await searchResultsStore.search()

            expect(searchResultsStore.totalResults).to.equal(TARGET_CITY_COUNT)
        })

        it('returns every facility when no city is selected', async () => {
            const searchResultsStore = useSearchResultsStore()

            searchResultsStore.selectedCity = undefined

            await searchResultsStore.search()

            expect(searchResultsStore.totalResults).to.equal(TOTAL_FACILITIES)
        })
    })
})
