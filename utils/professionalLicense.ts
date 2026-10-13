import { Degree } from '~/typedefs/gqlTypes'

/**
 * Picker lists for one clinical license and extra credentials.
 * Kept in step with findadoc-server src/vocabulary/professionalLicense.ts.
 * DVM, EdD, and DSW stay out of the picker until there is a use case.
 */

export const PICKER_PRIMARY_LICENSES: readonly Degree[] = [
    Degree.Cnm,
    Degree.Dc,
    Degree.Dds,
    Degree.Dmd,
    Degree.Dnp,
    Degree.Do,
    Degree.Dpm,
    Degree.Dpt,
    Degree.Md,
    Degree.Np,
    Degree.Od,
    Degree.Pa,
    Degree.PharmD,
    Degree.PsyD
]

export const PICKER_CREDENTIALS: readonly Degree[] = [
    Degree.DSc,
    Degree.Mph,
    Degree.PhD
]

export const HIDDEN_FROM_PICKER: readonly Degree[] = [
    Degree.Dsw,
    Degree.Dvm,
    Degree.EdD
]

export type LicenseRecommendation = 'MD' | 'one_dental_license' | 'confirm_primary'

export type LicenseFormState = {
    primaryLicense: Degree | null
    additionalCredentials: Degree[]
    preservedClinicalLicenses: Degree[]
    hiddenDegrees: Degree[]
    recommendation: LicenseRecommendation | null
}

function uniqueDegrees(degrees: readonly Degree[] | null | undefined): Degree[] {
    const seen = new Set<Degree>()
    const unique: Degree[] = []

    for (const degree of degrees ?? []) {
        if (seen.has(degree)) {
            continue
        }
        seen.add(degree)
        unique.push(degree)
    }

    return unique
}

export function recommendationFor(clinical: readonly Degree[]): LicenseRecommendation | null {
    const present = new Set(clinical)

    if (present.has(Degree.Md) && present.has(Degree.Do)) {
        return 'MD'
    }

    if (present.has(Degree.Dds) && present.has(Degree.Dmd) && clinical.length === 2) {
        return 'one_dental_license'
    }

    if (clinical.length > 1) {
        return 'confirm_primary'
    }

    return null
}

export function formStateFromDegrees(degrees: readonly Degree[] | null | undefined): LicenseFormState {
    const unique = uniqueDegrees(degrees)
    const preservedClinicalLicenses = unique.filter(degree => PICKER_PRIMARY_LICENSES.includes(degree))
    const additionalCredentials = unique.filter(degree => PICKER_CREDENTIALS.includes(degree))
    const hiddenDegrees = unique.filter(degree => HIDDEN_FROM_PICKER.includes(degree))

    return {
        primaryLicense: preservedClinicalLicenses.length === 1 ? preservedClinicalLicenses[0] : null,
        additionalCredentials,
        preservedClinicalLicenses,
        hiddenDegrees,
        recommendation: recommendationFor(preservedClinicalLicenses)
    }
}

export function degreesFromForm(state: {
    primaryLicense: Degree | null
    additionalCredentials: readonly Degree[]
    preservedClinicalLicenses: readonly Degree[]
    hiddenDegrees: readonly Degree[]
    keepBoth: boolean
}): Degree[] {
    const clinical = state.keepBoth || !state.primaryLicense
        ? state.preservedClinicalLicenses
        : [state.primaryLicense]

    return uniqueDegrees([...clinical, ...state.additionalCredentials, ...state.hiddenDegrees])
}
