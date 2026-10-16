import { expect } from 'chai'
import { isSearchCrawler } from '@/utils/crawler'
import {
    localeCodeFromPath,
    localizedPath,
    routeMatchesPath,
    unlocalizedPath,
    withLocaleVariants
} from '@/utils/localePath'

describe('locale paths', () => {
    it('strips a non-default prefix and leaves English paths alone', () => {
        expect(unlocalizedPath('/ja-JP/about')).to.equal('/about')
        expect(unlocalizedPath('/ja-JP')).to.equal('/')
        expect(unlocalizedPath('/ja-JP/')).to.equal('/')
        expect(unlocalizedPath('/about/')).to.equal('/about')
        expect(unlocalizedPath('/clinic/tokyo/shibuya/clinic--abc')).to.equal('/clinic/tokyo/shibuya/clinic--abc')
        expect(localeCodeFromPath('/zh-CN/npo')).to.equal('zh-CN')
        expect(localeCodeFromPath('/about')).to.equal('en-US')
    })

    it('prefixes every locale except the default, without changing the slug', () => {
        expect(localizedPath('/clinic/tokyo/shibuya/clinic--abc', 'ja-JP'))
            .to.equal('/ja-JP/clinic/tokyo/shibuya/clinic--abc')
        expect(localizedPath('/ja-JP/about', 'en-US')).to.equal('/about')
        expect(localizedPath('/', 'ja-JP')).to.equal('/ja-JP')
        expect(localizedPath('/my-page?view=facilities', 'ja-JP')).to.equal('/ja-JP/my-page?view=facilities')
        expect(withLocaleVariants(['/about'])[0]).to.equal('/about')
        expect(withLocaleVariants(['/about'])).to.include('/ja-JP/about')
    })

    it('matches nav items on a prefixed URL', () => {
        expect(routeMatchesPath('/ja-JP', '/')).to.equal(true)
        expect(routeMatchesPath('/ja-JP/about', '/about')).to.equal(true)
        expect(routeMatchesPath('/ja-JP/about', '/')).to.equal(false)
        expect(routeMatchesPath('/about', '/search')).to.equal(false)
    })
})

describe('isSearchCrawler', () => {
    it('matches crawlers and leaves browsers alone', () => {
        expect(isSearchCrawler('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')).to.equal(true)
        expect(isSearchCrawler('Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)')).to.equal(true)
        const chrome = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'
        expect(isSearchCrawler(chrome)).to.equal(false)
        expect(isSearchCrawler('')).to.equal(false)
    })
})
