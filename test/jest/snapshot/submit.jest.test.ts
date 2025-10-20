import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import Submit from '~/pages/submit.vue'

const i18n = createI18n({
    legacy: false,
    locale: 'en-US',
    messages: { 'en-US': {} }
})

describe('submit.vue', () => {
    it('renders correctly', () => {
        const wrapper = mount(Submit, {
            global: {
                plugins: [i18n]
            }
        })
        expect(wrapper.element).toMatchSnapshot()
    })
})
