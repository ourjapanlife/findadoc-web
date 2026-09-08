/// <reference types="vitest/globals" />
import { expect } from 'chai'
import {
    DOCTOR_ID_SEPARATOR,
    professionalDocumentTitle,
    professionalIdFromSlugParam,
    professionalPath,
    professionalSlugName
} from '@/utils/doctorPath'
import { formatPageTitle, SITE_TITLE } from '@/utils/site'
import { joinDoctorDirectory } from '@/utils/clinicPrerender'
import type { Facility, HealthcareProfessional } from '~/typedefs/gqlTypes'
import { Locale } from '~/typedefs/gqlTypes'

describe('professionalSlugName', () => {
    it('prefers the English name, then Japanese, then the first locale', () => {
        expect(professionalSlugName([
            { firstName: '花子', lastName: '田中', locale: Locale.JaJp },
            { firstName: 'Hanako', lastName: 'Tanaka', locale: Locale.EnUs }
        ])).to.equal('Hanako Tanaka')

        expect(professionalSlugName([
            { firstName: '花子', lastName: '田中', locale: Locale.JaJp }
        ])).to.equal('花子 田中')

        expect(professionalSlugName([])).to.equal('')
    })
})

describe('professionalPath', () => {
    const sampleId = '48d89d58-b5bf-474c-a866-b64479e10cf2'

    it('builds /doctor/{slug}--{id}', () => {
        expect(professionalPath({
            id: sampleId,
            names: [{ firstName: 'Aiko', middleName: '', lastName: 'Tanaka', locale: Locale.EnUs }]
        })).to.equal(`/doctor/aiko-tanaka${DOCTOR_ID_SEPARATOR}${sampleId}`)
    })

    it('falls back to doctor when no name is present', () => {
        expect(professionalPath({
            id: 'p1',
            names: []
        })).to.equal(`/doctor/doctor${DOCTOR_ID_SEPARATOR}p1`)
    })
})

describe('professionalIdFromSlugParam', () => {
    it('reads the id after the last --', () => {
        expect(professionalIdFromSlugParam('aiko-tanaka--p1')).to.equal('p1')
        expect(professionalIdFromSlugParam('missing-separator')).to.equal(undefined)
    })
})

describe('professionalDocumentTitle', () => {
    it('keeps short names intact so formatPageTitle stays under 60 characters', () => {
        const title = professionalDocumentTitle('Aiko Tanaka')
        expect(formatPageTitle(title).length).to.be.at.most(60)
        expect(formatPageTitle(title)).to.equal(`Aiko Tanaka · ${SITE_TITLE}`)
    })
})

describe('joinDoctorDirectory', () => {
    it('attaches facilities in the professional id list order and still lists unaffiliated doctors', () => {
        const facilities = [
            { id: 'f1', nameEn: 'One' },
            { id: 'f2', nameEn: 'Two' }
        ] as Facility[]
        const professionals = [
            { id: 'p1', facilityIds: ['f2', 'missing', 'f1'], names: [] },
            { id: 'p2', facilityIds: [], names: [] }
        ] as unknown as HealthcareProfessional[]

        const directory = joinDoctorDirectory(facilities, professionals)

        expect(directory.p1?.facilities.map(facility => facility.id)).to.deep.equal(['f2', 'f1'])
        expect(directory.p2?.facilities).to.deep.equal([])
    })
})
