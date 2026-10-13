import { describe, expect, it } from 'vitest'
import { Degree } from '~/typedefs/gqlTypes'
import {
    HIDDEN_FROM_PICKER,
    PICKER_CREDENTIALS,
    PICKER_PRIMARY_LICENSES,
    degreesFromForm,
    formStateFromDegrees
} from '~/utils/professionalLicense'

describe('professional license picker', () => {
    it('hides unused degrees and keeps clinical licenses separate from credentials', () => {
        expect(PICKER_PRIMARY_LICENSES).not.toEqual(expect.arrayContaining([...HIDDEN_FROM_PICKER]))
        expect(PICKER_CREDENTIALS).toEqual([Degree.DSc, Degree.Mph, Degree.PhD])
        expect(HIDDEN_FROM_PICKER).toEqual([Degree.Dsw, Degree.Dvm, Degree.EdD])
        expect(PICKER_PRIMARY_LICENSES).toEqual(expect.arrayContaining([
            Degree.Md,
            Degree.Do,
            Degree.Dds,
            Degree.Dmd,
            Degree.Np,
            Degree.Pa
        ]))
    })

    it('suggests a collapse and does not choose one until the moderator does', () => {
        expect(formStateFromDegrees([Degree.Md, Degree.Do, Degree.PhD])).toMatchObject({
            primaryLicense: null,
            additionalCredentials: [Degree.PhD],
            preservedClinicalLicenses: [Degree.Md, Degree.Do],
            recommendation: 'MD'
        })
        expect(formStateFromDegrees([Degree.Dds, Degree.Dmd])).toMatchObject({
            primaryLicense: null,
            recommendation: 'one_dental_license'
        })
        expect(degreesFromForm({
            primaryLicense: null,
            additionalCredentials: [Degree.PhD],
            preservedClinicalLicenses: [Degree.Md, Degree.Do],
            hiddenDegrees: [],
            keepBoth: false
        })).toEqual([Degree.Md, Degree.Do, Degree.PhD])
    })

    it('keeps a confirmed dual and applies a chosen primary', () => {
        const preserved = {
            additionalCredentials: [Degree.Mph],
            preservedClinicalLicenses: [Degree.Dds, Degree.Dmd],
            hiddenDegrees: [Degree.Dvm]
        }

        expect(degreesFromForm({
            ...preserved,
            primaryLicense: null,
            keepBoth: true
        })).toEqual([Degree.Dds, Degree.Dmd, Degree.Mph, Degree.Dvm])

        expect(degreesFromForm({
            ...preserved,
            primaryLicense: Degree.Dds,
            keepBoth: false
        })).toEqual([Degree.Dds, Degree.Mph, Degree.Dvm])
    })

    it('reads a single stored license as the primary', () => {
        expect(formStateFromDegrees([Degree.Do, Degree.PhD])).toMatchObject({
            primaryLicense: Degree.Do,
            additionalCredentials: [Degree.PhD],
            recommendation: null
        })
    })
})
