<template>
  <div class="w-24">
    <select
      v-model="selectedLocale"
      class="rounded-full w-full px-1 border-2 border-primary/80 drop-shadow-md text-primary-text bg-secondary-bg/5 hover:text-primary-hover transition-colors"
    >
      <option
        v-for="(localeOption) in localeStore.mvpLocaleDisplayOptions"
        :key="localeOption.code"
        :value="localeOption.code"
      >{{ localeOption.displayText }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useLocaleStore } from "../stores/localeStore";
import { Locale } from "~/typedefs/gqlTypes.js";
import { useI18n, useLocalePath } from "#imports";

// let i18n = useI18n();
const { locale } = useI18n();

// console.log("$i18n = ", i18n);

const localeStore = useLocaleStore();
const selectedLocale = ref(Locale.EnUs);

watch(selectedLocale, (newLocale: any) => {
  localeStore.setLocale(newLocale);
  //@ts-ignore-next-line
  locale.value = newLocale;
});
</script>
