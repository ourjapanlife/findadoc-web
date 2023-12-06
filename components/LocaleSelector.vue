<template>
    <div class="w-24">
        <select v-model="selectedLocale" class="rounded-full w-full px-1 border-2 border-primary/80 drop-shadow-md text-primary-text
            bg-secondary-bg/5 hover:text-primary-hover transition-colors">
            <option v-for="(localeOption) in localeStore.localeDisplayOptions" :key="localeOption.code">
                {{ localeOption.displayText }}
            </option>
        </select>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLocaleStore } from '../stores/localeStore'
import { Locale } from '~/typedefs/gqlTypes.js';

const localeStore = useLocaleStore()
const selectedLocale = ref(Locale.EnUs)

watch(selectedLocale, (newLocale) => {
    localeStore.setLocale(newLocale)
    //@ts-ignore-next-line
    $i18n.locale = newLocale
})

</script>
