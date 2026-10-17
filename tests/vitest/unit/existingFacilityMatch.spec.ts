/// <reference types="vitest/globals" />
import { expect } from 'chai'
import type { ExistingFacilityMatch } from '~/utils/existingFacility'
import { facilityMatchToShow } from '~/utils/existingFacilityMatch'

function clinic(id: string): ExistingFacilityMatch {
    return {
        id,
        nameEn: 'A-ONE Dental Clinic',
        nameJa: 'A-ONE歯科クリニック',
        prefectureEn: 'Tokyo',
        cityEn: 'Nakano',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=A-ONE',
        mapLatitude: 35.7,
        mapLongitude: 139.6
    }
}

describe('facilityMatchToShow', () => {
    it('hides the clinic already open for editing and keeps a different one', () => {
        expect(facilityMatchToShow(null, 'same')).to.equal(null)
        expect(facilityMatchToShow(clinic('same'), 'same')).to.equal(null)
        expect(facilityMatchToShow(clinic('same'), '  same  ')).to.equal(null)
        expect(facilityMatchToShow(clinic('other'), 'same')?.id).to.equal('other')
        expect(facilityMatchToShow(clinic('other'), '')?.id).to.equal('other')
    })
})
