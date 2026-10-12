/// <reference types="vitest/globals" />
/* eslint-disable camelcase -- The assertions are the Umami property names. */
import { expect } from 'chai'
import {
    LISTING_COUNT_CAP,
    breadcrumbLevel,
    clinicViewedProps,
    notFoundArea,
    resetSearchDetailsContact,
    siteLanguage,
    takeSearchDetailsActed,
    track,
    noteSearchDetailsContact
} from '@/utils/analyticsEvents'
import type { FacilitySearchResult } from '@/utils/searchDirectory'

type SentEvent = { name: string, data?: Record<string, unknown> }

function installTracker(): SentEvent[] {
    const sent: SentEvent[] = []
    window.umami = {
        track(name: string, data?: Record<string, unknown>) {
            sent.push(data === undefined ? { name } : { name, data })
        }
    }
    return sent
}

const looseTrack = track as (name: string, data?: Record<string, unknown>) => void

describe('track', () => {
    afterEach(() => {
        delete window.umami
        resetSearchDetailsContact()
    })

    it('sends each catalog event with only its own properties', () => {
        const sent = installTracker()

        track('Search submitted', { has_specialty: 'yes', has_language: 'no', has_prefecture: 'no' })
        track('Browse clicked', { kind: 'specialty' })
        track('Filters opened')
        track('Filters changed', {
            has_specialty: 'yes',
            has_language: 'no',
            has_prefecture: 'yes',
            has_city: 'no'
        })
        track('Filter unavailable', { control: 'city' })
        track('Filters cleared', { from: 'empty_results' })
        track('Results shown', { outcome: 'empty', has_filters: 'yes' })
        track('Load more results', { shown: 25, total: 40 })
        track('Search failed')
        track('Search retried')
        track('Clinic opened', { from: 'results' })
        track('Doctor opened', { from: 'clinic' })
        track('Clinic viewed', {
            has_phone: 'yes',
            has_website: 'no',
            has_email: 'no',
            has_maps: 'yes',
            has_professionals: 'yes'
        })
        track('Doctor viewed', { has_facility: 'yes', has_specialty: 'yes', has_language: 'no' })
        track('Map toggled', { state: 'shown' })
        track('Map failed')
        track('Map pin clicked')
        track('Call clicked', { surface: 'clinic' })
        track('Website clicked', { surface: 'search_details' })
        track('Email clicked', { surface: 'clinic' })
        track('Maps clicked', { surface: 'search_details' })
        track('Details closed', { acted: 'no' })
        track('Back to search', { from: 'doctor' })
        track('Related clicked', { kind: 'language', from: 'clinic' })
        track('Breadcrumb clicked', { level: 'home' })
        track('Language switched', { to: 'ja' })
        track('Not found', { area: 'clinic' })
        track('Not found escaped', { to: 'search' })
        track('Submit completed')
        track('Submit rejected', { reason: 'validation' })

        expect(sent.map(event => event.name)).to.deep.equal([
            'Search submitted',
            'Browse clicked',
            'Filters opened',
            'Filters changed',
            'Filter unavailable',
            'Filters cleared',
            'Results shown',
            'Load more results',
            'Search failed',
            'Search retried',
            'Clinic opened',
            'Doctor opened',
            'Clinic viewed',
            'Doctor viewed',
            'Map toggled',
            'Map failed',
            'Map pin clicked',
            'Call clicked',
            'Website clicked',
            'Email clicked',
            'Maps clicked',
            'Details closed',
            'Back to search',
            'Related clicked',
            'Breadcrumb clicked',
            'Language switched',
            'Not found',
            'Not found escaped',
            'Submit completed',
            'Submit rejected'
        ])
        expect(sent.find(event => event.name === 'Filters opened')?.data).to.equal(undefined)
        expect(sent.find(event => event.name === 'Call clicked')?.data).to.deep.equal({ surface: 'clinic' })
    })

    it('drops the old call, load-more, and map-pin payloads instead of sending them', () => {
        const sent = installTracker()

        looseTrack('Call button clicked', {
            facilityName: 'Sample Clinic',
            phone: '03-1234-5678',
            website: 'https://clinic.example',
            addressLine1: '1-2-3 Shibuya'
        })
        looseTrack('Load More Results', { currentCount: 25, totalCount: 40 })
        looseTrack('Map Pin Clicked', { facilityId: 'facility-1' })

        expect(sent).to.deep.equal([])
    })

    it('drops a catalog event when a property is extra, missing, or not on its list', () => {
        const sent = installTracker()

        looseTrack('Call clicked', {
            surface: 'clinic',
            phone: '090-1234-5678'
        })
        looseTrack('Call clicked', { surface: 'billing' })
        looseTrack('Call clicked')
        looseTrack('Map pin clicked', { facilityId: 'facility-1' })
        looseTrack('Search submitted', {
            has_specialty: 'yes',
            has_language: 'no',
            has_prefecture: 'dentistry'
        })

        expect(sent).to.deep.equal([])
    })

    it('drops an email-shaped or phone-shaped string even when the key is allowed', () => {
        const sent = installTracker()

        looseTrack('Call clicked', { surface: 'person@example.com' })
        looseTrack('Call clicked', { surface: '+81 90-1234-5678' })

        expect(sent).to.deep.equal([])
    })

    it('caps a listing count so an id cannot ride along as a number', () => {
        const sent = installTracker()

        track('Load more results', { shown: LISTING_COUNT_CAP + 50_000, total: 3 })

        expect(sent).to.deep.equal([{
            name: 'Load more results',
            data: { shown: LISTING_COUNT_CAP, total: 3 }
        }])
    })

    it('does nothing and does not warn when the tracker is missing', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        delete window.umami

        expect(() => track('Map pin clicked')).not.to.throw()
        expect(warn.mock.calls).to.deep.equal([])

        warn.mockRestore()
    })

    it('swallows a tracker failure so the click still finishes', () => {
        window.umami = {
            track() {
                throw new Error('tracker down')
            }
        }

        expect(() => track('Search failed')).not.to.throw()
    })
})

describe('listing flags', () => {
    it('treats a placeholder phone as no contact method', () => {
        expect(clinicViewedProps({
            contact: { phone: 'none', website: '', email: 'email@email.com', googleMapsUrl: '' },
            healthcareProfessionals: []
        } as unknown as FacilitySearchResult)).to.deep.equal({
            has_phone: 'no',
            has_website: 'no',
            has_email: 'no',
            has_maps: 'no',
            has_professionals: 'no'
        })
    })

    it('counts a real phone, site, email, map link, and doctor', () => {
        expect(clinicViewedProps({
            contact: {
                phone: '03-1234-5678',
                website: 'www.clinic.example',
                email: 'desk@clinic.example',
                googleMapsUrl: 'https://maps.app.goo.gl/abc'
            },
            healthcareProfessionals: [{}]
        } as unknown as FacilitySearchResult)).to.deep.equal({
            has_phone: 'yes',
            has_website: 'yes',
            has_email: 'yes',
            has_maps: 'yes',
            has_professionals: 'yes'
        })
    })
})

describe('path classification', () => {
    it('classifies a missed url without keeping the path', () => {
        expect(notFoundArea('/clinic/tokyo/shibuya/some-name')).to.equal('clinic')
        expect(notFoundArea('/doctor/some-name')).to.equal('doctor')
        expect(notFoundArea('/tokyo/shibuya')).to.equal('area')
        expect(notFoundArea('/search?q=a-name')).to.equal('other')
        expect(notFoundArea('/my-page/edit-facility/1')).to.equal('other')
    })

    it('reads a breadcrumb target as home, prefecture, or city', () => {
        expect(breadcrumbLevel('/')).to.equal('home')
        expect(breadcrumbLevel('/tokyo')).to.equal('prefecture')
        expect(breadcrumbLevel('/tokyo/shibuya')).to.equal('city')
        expect(breadcrumbLevel('/doctor/some-name')).to.equal(null)
    })
})

describe('siteLanguage', () => {
    it('maps the language picker and ignores anything else', () => {
        expect(siteLanguage('en_US')).to.equal('en')
        expect(siteLanguage('ja_JP')).to.equal('ja')
        expect(siteLanguage('en-US')).to.equal(null)
        expect(siteLanguage('dentistry')).to.equal(null)
    })
})

describe('search details contact', () => {
    afterEach(() => {
        resetSearchDetailsContact()
    })

    it('reports whether a contact control was used, then forgets it', () => {
        expect(takeSearchDetailsActed()).to.equal('no')
        noteSearchDetailsContact()
        expect(takeSearchDetailsActed()).to.equal('yes')
        expect(takeSearchDetailsActed()).to.equal('no')
    })
})
