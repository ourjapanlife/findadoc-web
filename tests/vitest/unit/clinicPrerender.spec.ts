/// <reference types="vitest/globals" />
import { mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect } from 'chai'
import {
    CLINIC_PRERENDER_CACHE_ENV,
    joinClinicDirectory,
    writeClinicPrerenderCache
} from '@/utils/clinicPrerender'
import type { Facility, HealthcareProfessional } from '~/typedefs/gqlTypes'
import { Locale } from '~/typedefs/gqlTypes'

function facility(id: string, professionalIds: string[]): Facility {
    return {
        id,
        nameEn: id,
        nameJa: id,
        mapLatitude: 0,
        mapLongitude: 0,
        healthcareProfessionalIds: professionalIds,
        contact: {
            address: {
                cityEn: 'Nakano',
                prefectureEn: 'Tokyo'
            }
        },
        createdDate: '2026-01-01T00:00:00.000Z',
        updatedDate: '2026-01-01T00:00:00.000Z'
    } as Facility
}

function professional(id: string): HealthcareProfessional {
    return {
        id,
        names: [{ firstName: id, middleName: '', lastName: 'Doc', locale: Locale.EnUs }],
        degrees: [],
        specialties: [],
        facilityIds: [],
        spokenLanguages: [],
        acceptedInsurance: [],
        additionalInfoForPatients: '',
        createdDate: '2026-01-01T00:00:00.000Z',
        updatedDate: '2026-01-01T00:00:00.000Z'
    } as HealthcareProfessional
}

describe('joinClinicDirectory', () => {
    it('attaches professionals in the facility id list order and drops missing ids', () => {
        const directory = joinClinicDirectory(
            [facility('c1', ['p2', 'missing', 'p1'])],
            [professional('p1'), professional('p2')]
        )

        expect(Object.keys(directory)).to.deep.equal(['c1'])
        expect(directory.c1?.healthcareProfessionals.map(row => row.id)).to.deep.equal(['p2', 'p1'])
    })
})

describe('writeClinicPrerenderCache', () => {
    it('writes the directory and points the env var at the file', () => {
        const cwd = mkdtempSync(join(tmpdir(), 'clinic-prerender-'))
        const previous = process.env[CLINIC_PRERENDER_CACHE_ENV]
        const directory = joinClinicDirectory([facility('c1', ['p1'])], [professional('p1')])

        try {
            const filePath = writeClinicPrerenderCache(directory, cwd)
            expect(process.env[CLINIC_PRERENDER_CACHE_ENV]).to.equal(filePath)

            const stored = JSON.parse(readFileSync(filePath, 'utf8')) as typeof directory
            expect(stored.c1?.id).to.equal('c1')
            expect(stored.c1?.healthcareProfessionals[0]?.id).to.equal('p1')
        } finally {
            if (previous === undefined) {
                delete process.env.NUXT_CLINIC_PRERENDER_CACHE
            } else {
                process.env.NUXT_CLINIC_PRERENDER_CACHE = previous
            }
        }
    })
})
