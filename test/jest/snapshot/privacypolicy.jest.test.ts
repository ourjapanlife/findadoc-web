import { beforeAll, describe, it, expect } from '@jest/globals'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import PrivacyPolicy from '~/pages/privacypolicy.vue'

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

describe('privacypolicy.vue', () => {
    it('renders correctly', () => {
        const wrapper = mount(PrivacyPolicy, {
            global: {
                plugins: [i18n]
            }
        })
        expect(wrapper.element).toMatchSnapshot()
    })
})
