/// <reference types="vitest/globals" />
import { expect } from 'chai'
import {
    facetLanguageDocumentTitle,
    facetSpecialtyDocumentTitle,
    INDEXABLE_FACET_MIN_RESULTS,
    isFacetSecondSegment,
    languageFacetPathFromSlugs,
    languageFacetSlug,
    languageFromFacetSlug,
    parsePrefectureSecondSegment,
    specialtyFacetPathFromSlugs,
    specialtyFacetSlug,
    specialtyFromFacetSlug
} from '@/utils/facetPath'
import { formatPageTitle } from '@/utils/site'
import { Locale, Specialty } from '~/typedefs/gqlTypes'

describe('facet slugs', () => {
    it('round-trips every specialty enum value', () => {
        for (const specialty of Object.values(Specialty)) {
            const slug = specialtyFacetSlug(specialty)
            expect(slug, specialty).to.be.a('string')
            expect(specialtyFromFacetSlug(slug!)).to.equal(specialty)
        }
    })

    it('uses english-speaking for en_US and keeps Chinese locales distinct', () => {
        expect(languageFacetSlug(Locale.EnUs)).to.equal('english-speaking')
        expect(languageFromFacetSlug('english-speaking')).to.equal(Locale.EnUs)
        expect(languageFacetSlug(Locale.ZhCn)).to.not.equal(languageFacetSlug(Locale.ZhTw))
        expect(languageFromFacetSlug(languageFacetSlug(Locale.ZhCn)!)).to.equal(Locale.ZhCn)
        expect(languageFromFacetSlug(languageFacetSlug(Locale.ZhTw)!)).to.equal(Locale.ZhTw)
    })

    it('parses the second segment as language, then specialty, then city', () => {
        expect(parsePrefectureSecondSegment('english-speaking')).to.deep.equal({
            kind: 'language',
            locale: Locale.EnUs,
            slug: 'english-speaking'
        })
        expect(parsePrefectureSecondSegment('dentistry')).to.deep.include({
            kind: 'specialty',
            specialty: Specialty.Dentistry
        })
        expect(parsePrefectureSecondSegment('shibuya')).to.deep.equal({
            kind: 'city',
            slug: 'shibuya'
        })
        expect(isFacetSecondSegment('dentistry')).to.equal(true)
        expect(isFacetSecondSegment('english-speaking')).to.equal(true)
        expect(isFacetSecondSegment('shibuya')).to.equal(false)
    })

    it('builds prefecture facet paths and skips reserved prefectures', () => {
        expect(specialtyFacetPathFromSlugs('tokyo', Specialty.Dentistry)).to.equal('/tokyo/dentistry')
        expect(languageFacetPathFromSlugs('tokyo', Locale.EnUs)).to.equal('/tokyo/english-speaking')
        expect(specialtyFacetPathFromSlugs('search', Specialty.Dentistry)).to.equal(undefined)
        expect(INDEXABLE_FACET_MIN_RESULTS).to.equal(3)
    })
})

describe('facet document titles', () => {
    it('stay under 60 characters once branded', () => {
        expect(formatPageTitle(facetSpecialtyDocumentTitle('Dentistry', 'Tokyo')).length)
            .to.be.at.most(60)
        expect(formatPageTitle(facetLanguageDocumentTitle('English', 'Tokyo')))
            .to.equal(formatPageTitle('English-speaking care in Tokyo'))
    })
})
