import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import About from '~/pages/about.vue'

const i18n = createI18n({
    legacy: false,
    locale: 'en-US',
    messages: { 'en-US': {} }
})

describe('about.vue', () => {
    it('renders correctly', () => {
        const wrapper = mount(About, {
            global: {
                plugins: [i18n]
            }
        })
        expect(wrapper.element).toMatchSnapshot()
    })
})
