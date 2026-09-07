/// <reference types="vitest/globals" />
import { expect } from 'chai'
import {
    FACILITY_ID_SEPARATOR,
    facilityDocumentTitle,
    facilityIdFromSlugParam,
    facilityPath,
    slugifySegment
} from '@/utils/clinicPath'
import { formatPageTitle, SITE_TITLE } from '@/utils/site'
import { isNuxtGenerateCommand } from '@/utils/clinicPrerender'
import type { Facility } from '~/typedefs/gqlTypes'

function facility(overrides: Partial<Facility> & Pick<Facility, 'id' | 'nameEn'>): Pick<Facility, 'id' | 'nameEn'> & {
    contact?: Facility['contact']
} {
    return {
        id: overrides.id,
        nameEn: overrides.nameEn,
        contact: overrides.contact
    }
}

describe('slugifySegment', () => {
    it('lowercases and hyphenates English names, including internal hyphens', () => {
        expect(slugifySegment('A-ONE Dental Clinic')).to.equal('a-one-dental-clinic')
        expect(slugifySegment('Tokyo')).to.equal('tokyo')
        expect(slugifySegment('Chuo Ward')).to.equal('chuo-ward')
    })

    it('does not emit the id separator, so slug and UUID stay unambiguous', () => {
        expect(slugifySegment('Wait--what')).to.equal('wait-what')
        expect(slugifySegment('A--B--C')).not.to.include(FACILITY_ID_SEPARATOR)
    })

    it('keeps letters outside ASCII so Japanese names are not emptied', () => {
        expect(slugifySegment('中央区')).to.equal('中央区')
    })

    it('returns empty for blank input so callers can apply a fallback', () => {
        expect(slugifySegment('')).to.equal('')
        expect(slugifySegment('   ')).to.equal('')
        expect(slugifySegment(undefined)).to.equal('')
    })
})

describe('facilityPath', () => {
    const sampleId = '48d89d58-b5bf-474c-a866-b64479e10cf2'

    it('builds /clinic/{prefecture}/{city}/{slug}--{id}', () => {
        expect(facilityPath(facility({
            id: sampleId,
            nameEn: 'A-ONE Dental Clinic',
            contact: {
                address: {
                    cityEn: 'Nakano',
                    prefectureEn: 'Tokyo'
                }
            } as Facility['contact']
        }))).to.equal(`/clinic/tokyo/nakano/a-one-dental-clinic${FACILITY_ID_SEPARATOR}${sampleId}`)
    })

    it('falls back when city or prefecture is missing', () => {
        expect(facilityPath(facility({
            id: 'f1',
            nameEn: 'Tokyo Family Clinic'
        }))).to.equal(`/clinic/japan/unknown/tokyo-family-clinic${FACILITY_ID_SEPARATOR}f1`)
    })
})

describe('facilityIdFromSlugParam', () => {
    const sampleId = '48d89d58-b5bf-474c-a866-b64479e10cf2'

    it('reads the UUID after the last --, even though the UUID itself contains hyphens', () => {
        expect(facilityIdFromSlugParam(`a-one-dental-clinic${FACILITY_ID_SEPARATOR}${sampleId}`))
            .to.equal(sampleId)
    })

    it('accepts short test ids used by the search e2e mock', () => {
        expect(facilityIdFromSlugParam(`tokyo-family-clinic${FACILITY_ID_SEPARATOR}f1`)).to.equal('f1')
    })

    it('returns undefined when the separator is missing', () => {
        expect(facilityIdFromSlugParam('tokyo-family-clinic-f1')).to.equal(undefined)
        expect(facilityIdFromSlugParam('')).to.equal(undefined)
    })
})

describe('facilityDocumentTitle', () => {
    it('keeps short names intact so formatPageTitle stays under 60 characters', () => {
        const title = facilityDocumentTitle('A-ONE Dental Clinic')
        expect(formatPageTitle(title).length).to.be.at.most(60)
        expect(formatPageTitle(title)).to.equal(`A-ONE Dental Clinic · ${SITE_TITLE}`)
    })

    it('truncates a long clinic name so the branded title fits 60 characters', () => {
        const longName = 'The International Academic Medical Centre of Greater Tokyo Bay'
        const branded = formatPageTitle(facilityDocumentTitle(longName))
        expect(branded.length).to.be.at.most(60)
        expect(branded.endsWith(` · ${SITE_TITLE}`)).to.equal(true)
        expect(branded).to.include('…')
    })
})

describe('isNuxtGenerateCommand', () => {
    it('matches nuxi generate and ignores graphql-codegen', () => {
        expect(isNuxtGenerateCommand(['node', 'nuxi', 'generate'])).to.equal(true)
        expect(isNuxtGenerateCommand(['node', 'graphql-codegen', '--config', './typesgeneratorconfig.ts']))
            .to.equal(false)
        expect(isNuxtGenerateCommand(['vitest'])).to.equal(false)
    })
})
