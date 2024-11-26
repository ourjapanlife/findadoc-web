import { faker, fakerJA } from '@faker-js/faker'
import type { ModEditSubmissionFormTestIds } from '../../support/testIds/ModEditSubmissionFormTestIds'
import { prefectures as prefectureJa } from '~/assets/json/prefecturesJapan.json'
import { prefectures as prefectureEn } from '~/assets/json/prefecturesJapanEn.json'
import utils from '~/test/faker/utils'

const getElement = (element: ModEditSubmissionFormTestIds) => cy.getElement<ModEditSubmissionFormTestIds>(element)

// Login custom command
before(() => {
    cy.moderationLogin()
})

describe('Submission Moderation', () => {
    describe('Review Process', () => {
        it('Approve a submission successfully', () => {
            getElement('mod-submission-list-item-1').click()
            getElement('submission-form-nameEn').type(faker.person.fullName())
            getElement('submission-form-nameJa').type(fakerJA.person.fullName())
            getElement('submission-form-phone').type(fakerJA.phone.number({ style: 'international' }))
            getElement('submission-form-email').type(faker.internet.email())
            getElement('submission-form-website').type(faker.internet.url())
            getElement('submission-form-postalCode').type(fakerJA.location.zipCode())
            getElement('submission-form-prefectureEn').select(faker.helpers.arrayElement(prefectureEn))
            getElement('submission-form-cityEn').type(faker.location.streetAddress())
            getElement('submission-form-addressLine1En').type(faker.location.streetAddress())
            getElement('submission-form-prefectureJa').select(faker.helpers.arrayElement(prefectureJa))
            getElement('submission-form-cityJa').type(fakerJA.location.city())
            getElement('submission-form-addressLine1Ja').type(fakerJA.location.streetAddress())
            getElement('submission-form-mapLongitude').type(faker.location.longitude().toString())
            getElement('submission-form-mapLatitude').type(faker.location.latitude().toString())
            getElement('submission-form-accepted-insurances').select(utils.getInsurances())
            getElement('submission-form-degrees').select(utils.getDegrees())
            getElement('submission-form-specialties').select(utils.getSpecialties())
            getElement('btn-update-submission').click()
        })
    })
})
