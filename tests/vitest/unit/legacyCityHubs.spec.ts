/// <reference types="vitest/globals" />
import { expect } from 'chai'
import { cityHubSlugToLoad, legacyCityHubSlug } from '@/utils/legacyCityHubs'

describe('legacy city hubs', () => {
    it('keeps a slug that is still published', () => {
        const published = new Set(['minato-city', 'east-ward', 'north-ward'])

        expect(cityHubSlugToLoad('tokyo', 'minato-city', published)).to.equal('minato-city')
        expect(cityHubSlugToLoad('fukuoka', 'east-ward', published)).to.equal('east-ward')
        expect(cityHubSlugToLoad('osaka', 'north-ward', published)).to.equal('north-ward')
    })

    it('sends an unpublished old slug to the canonical city', () => {
        const published = new Set(['minato', 'fukuoka', 'kitakyushu'])

        expect(cityHubSlugToLoad('tokyo', 'minato-city', published)).to.equal('minato')
        expect(cityHubSlugToLoad('tokyo', 'chuo-city', published)).to.equal('chuo')
        expect(cityHubSlugToLoad('fukuoka', 'east-ward', published)).to.equal('fukuoka')
        expect(cityHubSlugToLoad('fukuoka', 'kitakyushu-kokurakita-ward', published)).to.equal('kitakyushu')
        expect(legacyCityHubSlug('osaka', 'north-ward')).to.equal(undefined)
        expect(cityHubSlugToLoad('osaka', 'north-ward', published)).to.equal('north-ward')
    })
})
