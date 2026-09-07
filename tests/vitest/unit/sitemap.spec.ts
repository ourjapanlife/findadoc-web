import { expect } from 'chai'
import { PAGE_META_TITLE_ROUTES } from '@/utils/pageTitles'
import { isNoindexRoute, ROBOTS_DISALLOW_PATHS } from '@/utils/seo'
import { publicSitemapUrls, SITEMAP_EXCLUDE } from '@/utils/sitemap'
import {
    collectPagedRows,
    directoryKindsToFetch,
    DIRECTORY_SITEMAP_PATHS,
    loadDirectorySitemapUrls,
    SITEMAP_DIRECTORY_PAGE_SIZE,
    sitemapUrlFromEntry
} from '@/utils/sitemapDirectory'

describe('publicSitemapUrls', () => {
    it('lists every titled public page and none of the robots-disallowed trees', () => {
        const locs = publicSitemapUrls().map(entry => entry.loc)

        expect(locs.sort()).to.deep.equal(Object.values(PAGE_META_TITLE_ROUTES).slice().sort())
        for (const loc of locs) {
            expect(isNoindexRoute(loc), loc).to.equal(false)
        }
    })
})

describe('SITEMAP_EXCLUDE', () => {
    it('covers every robots.txt disallow prefix', () => {
        for (const path of ROBOTS_DISALLOW_PATHS) {
            expect(SITEMAP_EXCLUDE).to.include(path)
            expect(SITEMAP_EXCLUDE).to.include(`${path}/**`)
        }
    })
})

describe('sitemapUrlFromEntry', () => {
    const paths = { facility: '/clinic', professional: '/professionals' }

    it('omits professionals until that page tree exists, and lists clinics at facilityPath', () => {
        expect(DIRECTORY_SITEMAP_PATHS.facility).to.equal('/clinic')
        expect(DIRECTORY_SITEMAP_PATHS.professional).to.equal(undefined)
        expect(sitemapUrlFromEntry({ kind: 'professional', id: 'p1', updatedDate: '2026-08-01' }))
            .to.equal(undefined)
        expect(sitemapUrlFromEntry({
            kind: 'facility',
            id: 'abc',
            nameEn: 'Tokyo Family Clinic',
            cityEn: 'Shibuya',
            prefectureEn: 'Tokyo',
            updatedDate: '2026-08-01T00:00:00.000Z'
        })).to.deep.equal({
            loc: '/clinic/tokyo/shibuya/tokyo-family-clinic--abc',
            lastmod: '2026-08-01T00:00:00.000Z'
        })
    })

    it('uses updatedDate as lastmod when the prefix is set', () => {
        expect(sitemapUrlFromEntry(
            { kind: 'professional', id: 'p1', updatedDate: '2026-08-01T00:00:00.000Z' },
            paths
        )).to.deep.equal({ loc: '/professionals/p1', lastmod: '2026-08-01T00:00:00.000Z' })
    })

    it('omits lastmod when the API did not send updatedDate', () => {
        expect(sitemapUrlFromEntry({ kind: 'professional', id: 'p1' }, paths))
            .to.deep.equal({ loc: '/professionals/p1' })
    })
})

describe('collectPagedRows', () => {
    it('pages at 100 until totalCount is exhausted', async () => {
        const offsets: number[] = []
        const rows = Array.from({ length: 250 }, (_, index) => ({ id: String(index) }))

        const collected = await collectPagedRows(async offset => {
            offsets.push(offset)
            return {
                rows: rows.slice(offset, offset + SITEMAP_DIRECTORY_PAGE_SIZE),
                totalCount: rows.length
            }
        })

        expect(SITEMAP_DIRECTORY_PAGE_SIZE).to.equal(100)
        expect(offsets).to.deep.equal([0, 100, 200])
        expect(collected.map(row => row.id)).to.deep.equal(rows.map(row => row.id))
    })
})

describe('loadDirectorySitemapUrls', () => {
    it('does not hit the API while every entity prefix is unset', async () => {
        let called = false
        const urls = await loadDirectorySitemapUrls({
            fetchFacilities: async () => {
                called = true
                return { rows: [], totalCount: 0 }
            },
            fetchProfessionals: async () => {
                called = true
                return { rows: [], totalCount: 0 }
            }
        }, { facility: undefined, professional: undefined })

        expect(directoryKindsToFetch({ facility: undefined, professional: undefined })).to.deep.equal([])
        expect(called).to.equal(false)
        expect(urls).to.deep.equal([])
    })

    it('does not fetch professionals while that prefix is unset', async () => {
        const urls = await loadDirectorySitemapUrls({
            fetchFacilities: async () => ({
                rows: [{
                    id: 'f1',
                    nameEn: 'Tokyo Family Clinic',
                    contact: { address: { cityEn: 'Shibuya', prefectureEn: 'Tokyo' } },
                    updatedDate: '2026-08-01T00:00:00.000Z'
                }],
                totalCount: 1
            }),
            fetchProfessionals: async () => {
                throw new Error('professionals should not be fetched')
            }
        })

        expect(directoryKindsToFetch()).to.deep.equal(['facility'])
        expect(urls).to.deep.equal([
            { loc: '/clinic/tokyo/shibuya/tokyo-family-clinic--f1', lastmod: '2026-08-01T00:00:00.000Z' }
        ])
    })

    it('omits entity URLs when the directory API fails', async () => {
        const urls = await loadDirectorySitemapUrls({
            fetchFacilities: async () => {
                throw new Error('ECONNREFUSED')
            },
            fetchProfessionals: async () => {
                throw new Error('professionals should not be fetched')
            }
        })

        expect(urls).to.deep.equal([])
    })

    it('pages facilities and maps lastmod once a prefix exists', async () => {
        const urls = await loadDirectorySitemapUrls(
            {
                fetchFacilities: async offset => ({
                    rows: offset === 0
                        ? [{
                            id: 'f1',
                            nameEn: 'Tokyo Family Clinic',
                            contact: { address: { cityEn: 'Shibuya', prefectureEn: 'Tokyo' } },
                            updatedDate: '2026-08-01T00:00:00.000Z'
                        }]
                        : [],
                    totalCount: 1
                }),
                fetchProfessionals: async () => {
                    throw new Error('professionals should not be fetched')
                }
            },
            { facility: '/clinic', professional: undefined }
        )

        expect(urls).to.deep.equal([
            { loc: '/clinic/tokyo/shibuya/tokyo-family-clinic--f1', lastmod: '2026-08-01T00:00:00.000Z' }
        ])
    })
})
