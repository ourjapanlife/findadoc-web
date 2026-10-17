import {
    listPrefectureJapanEn,
    listPrefectureJapanJa,
    pairedPrefectureEn,
    pairedPrefectureJa
} from '~/stores/locationsStore'

export type FacilityMapsFillTarget = {
    nameEn: string
    nameJa: string
    postalCode: string
    prefectureEn: string
    prefectureJa: string
    addressLine1En: string
    addressLine1Ja: string
    mapLatitude: string
    mapLongitude: string
}

export type MapsFillSource = {
    nameEn: string | null
    nameJa: string | null
    addressEn: string | null
    addressJa: string | null
    latitude: number | null
    longitude: number | null
}

const POSTAL_CODE = /〒?\s*(\d{3})-?(\d{4})/
const JAPANESE_SCRIPT = /[\u3040-\u30ff\u3400-\u9fff]/

/**
 * Values to copy into facility fields that are still empty.
 * A field the moderator already typed is left alone.
 */
export function fillEmptyFacilityFields(
    current: FacilityMapsFillTarget,
    source: MapsFillSource
): Partial<FacilityMapsFillTarget> {
    const patch: Partial<FacilityMapsFillTarget> = {}
    assignName(current.nameEn, source.nameEn, 'nameEn', patch)
    assignName(current.nameJa, source.nameJa, 'nameJa', patch)
    assignName(current.nameEn, source.nameJa, 'nameEn', patch)
    assignName(current.nameJa, source.nameEn, 'nameJa', patch)

    const addressEn = source.addressEn?.trim() ?? ''
    const addressJa = source.addressJa?.trim() ?? ''
    const postal = postalCodeFromAddress(addressJa) ?? postalCodeFromAddress(addressEn)
    if (postal && !current.postalCode.trim()) patch.postalCode = postal

    const prefectureJa = longestContained(addressJa, listPrefectureJapanJa)
      ?? longestContained(addressEn, listPrefectureJapanJa)
    const prefectureEn = longestContained(addressEn, listPrefectureJapanEn)
      ?? longestContained(addressJa, listPrefectureJapanEn)
    if (!current.prefectureJa.trim()) {
        const nextJa = prefectureJa || pairedPrefectureJa(prefectureEn ?? '')
        if (nextJa) patch.prefectureJa = nextJa
    }
    if (!current.prefectureEn.trim()) {
        const nextEn = prefectureEn || pairedPrefectureEn(patch.prefectureJa ?? prefectureJa ?? '')
        if (nextEn) patch.prefectureEn = nextEn
    }

    const lineJa = addressRemainder(addressJa, postal, patch.prefectureJa ?? prefectureJa)
    const lineEn = addressRemainder(addressEn, postal, patch.prefectureEn ?? prefectureEn)
    if (lineJa && !current.addressLine1Ja.trim()) patch.addressLine1Ja = lineJa
    if (lineEn && !current.addressLine1En.trim()) patch.addressLine1En = lineEn

    if (!current.mapLatitude.trim() && !current.mapLongitude.trim() && usablePin(source)) {
        patch.mapLatitude = String(source.latitude)
        patch.mapLongitude = String(source.longitude)
    }

    return patch
}

export function postalCodeFromAddress(address: string): string | null {
    const match = address.match(POSTAL_CODE)
    if (!match?.[1] || !match[2]) return null
    return `${match[1]}-${match[2]}`
}

function assignName(
    current: string,
    incoming: string | null,
    key: 'nameEn' | 'nameJa',
    patch: Partial<FacilityMapsFillTarget>
) {
    const value = incoming?.trim() ?? ''
    if (!value || current.trim() || patch[key]) return
    const japanese = JAPANESE_SCRIPT.test(value)
    if (key === 'nameJa' && japanese) patch.nameJa = value
    if (key === 'nameEn' && !japanese && /[A-Za-z]/.test(value)) patch.nameEn = value
}

function longestContained(address: string, names: readonly string[]): string | null {
    if (!address) return null
    const hits = names.filter(name => address.includes(name))
    hits.sort((left, right) => right.length - left.length)
    return hits[0] ?? null
}

function addressRemainder(
    address: string,
    postal: string | null,
    prefecture: string | null | undefined
): string | null {
    if (!address) return null
    let line = address
    if (postal) line = line.replaceAll(postal, ' ')
    line = line.replaceAll('〒', ' ')
    if (prefecture) line = line.replaceAll(prefecture, ' ')
    line = line.replace(/[,、]/g, ' ').replace(/\s+/g, ' ').trim()
    return line.length >= 4 ? line : null
}

function usablePin(source: MapsFillSource): source is MapsFillSource & { latitude: number, longitude: number } {
    const { latitude, longitude } = source
    if (latitude === null || longitude === null) return false
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return false
    return !(latitude === 0 && longitude === 0)
}
