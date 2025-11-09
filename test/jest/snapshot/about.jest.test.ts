import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import About from '~/pages/about.vue'

beforeAll(() => {
  global.IntersectionObserver = class {
    constructor(callback: any, options?: any) {
      this.callback = callback
      this.options = options
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  }
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
                    NuxtLink: true, // stub NuxtLink
                    SvgAwa: true    // stub your custom SVG
                }
            }
        })
        expect(wrapper.element).toMatchSnapshot()
    })
})
