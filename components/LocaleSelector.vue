<template>
  <div class="w-24">
    <select
      v-model="selectedLocale"
      class="rounded-full px-2 py-1 border-2 border-primary/80 drop-shadow-md text-primary-text bg-secondary-bg/5 hover:text-primary-hover transition-colors"
    >
      <option
        v-for="(localeOption) in localeStore.mvpLocaleDisplayOptions"
        :key="localeOption.code"
        :value="localeOption.code"
      >{{ localeOption.simpleText }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useLocaleStore } from "../stores/localeStore"
import { Locale } from "~/typedefs/gqlTypes.js"
import { useI18n } from "#imports"

const { locale } = useI18n();
const localeStore = useLocaleStore();
const selectedLocale = ref(Locale.EnUs);

watch(selectedLocale, (newLocale: any) => {
  localeStore.setLocale(newLocale);
  locale.value = newLocale;
});
</script>
