import vSelect from 'vue-select';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('v-select', vSelect);
})