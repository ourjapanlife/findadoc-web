import { beforeAll, describe, it, expect, jest } from '@jest/globals'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import About from '~/pages/about.vue'

type MemberData = {
    avatarImg: string
    name: string
    title: string
    linkedInUrl: string | null
    githubUrl: string | null
    personalWebsite?: string
}

jest.mock('~/utils/arrayUtils', () => ({
    shuffleArray: (arr: MemberData[]) => [...arr]
}))

beforeAll(() => {
    class MockIntersectionObserver {
        constructor(
            public callback: IntersectionObserverCallback,
            public options?: IntersectionObserverInit
        ) {}

        observe(_target: Element) {}
        unobserve(_target: Element) {}
        disconnect() {}
    }

    global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver
})

const i18n = createI18n({
    legacy: false,
    locale: 'en-US',
    messages: { 'en-US': {} }
})

describe('about.vue', () => {
    it('renders correctly', () => {
        const wrapper = mount(About, {
            global: {
                plugins: [i18n],
                stubs: {
                    NuxtLink: true,
                    FadeInTransitionImage: true,
                    SVGLinkedinIcon: true,
                    SVGGithubIcon: true

                }
            }
        })
        expect(wrapper.element).toMatchSnapshot()
    })
})
