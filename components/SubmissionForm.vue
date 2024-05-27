<template>
  <div class="flex flex-col place-self-center">
    <h1
        data-testid="submit-heading" class="mb-3.5 text-center text-zinc-900 text-2xl font-bold font-['Noto Sans JP'] leading-normal"
    >{{ $t('submitPage.heading')}}</h1>
    <p
        data-testid="submit-subheading" class="mb-10 w-[350px] text-center text-neutral-600 text-sm font-normal font-['Noto Sans JP']"
    >{{ $t('submitPage.subheading')}}</p>
    <span
        class="mb-2 text-neutral-600 text-sm font-normal font-['Noto Sans JP']"
    >{{ $t('submitPage.googleMaps')}}</span>
    <input data-testid="submit-input-googlemaps"
      type="text"
      class="mb-5 px-3 py-3.5 w-[350px] h-[50px] bg-white rounded-lg border border-zinc-400 text-neutral-600 text-sm font-normal font-['Noto Sans JP']"
      :placeholder="$t('submitPage.location')"
      v-model="submissionStore.location"
    />
    <span
      class="mb-2 text-neutral-600 text-sm font-normal font-['Noto Sans JP']"
    >{{ $t('submitPage.healthcareProfessionalName')}}</span>
    <div>
      <input data-testid="submit-input-lastname"
        class="mb-5 mr-2 px-3 py-3.5 w-[170px] h-[50px] bg-white rounded-lg border border-zinc-400 text-neutral-600 text-sm font-normal font-['Noto Sans JP']"
        type="text"
        :placeholder="$t('submitPage.lastName')"
        v-model="submissionStore.lastName"
      />
      <input data-testid="submit-input-firstname"
        class="mb-5 px-3 py-3.5 w-[170px] h-[50px] bg-white rounded-lg border border-zinc-400 text-neutral-600 text-sm font-normal font-['Noto Sans JP']"
        type="text"
        :placeholder="$t('submitPage.firstName')"
        v-model="submissionStore.firstName"
      />
    </div>
    <span
      class="mb-2 text-neutral-600 text-sm font-normal font-['Noto Sans JP']"
    >{{ $t('submitPage.spokenLanguage1')}}</span>
    <select data-testid="submit-select-language1"
      class="mb-5 px-3 py-3.5 w-[350px] h-[50px] bg-white rounded-lg border border-zinc-400 text-primary-text"
      :placeholder="$t('submitPage.selectLanguage1')"
      v-model="submissionStore.selectLanguage1"
    >
      <option
        :key="index"
        v-for="(locale, index) in localeStore.localeDisplayOptions"
        selected
        :value="locale.code"
      >{{ locale.displayText }}</option>
    </select>
    <span
      class="mb-2 text-neutral-600 text-sm font-normal font-['Noto Sans JP']"
    >{{ $t('submitPage.spokenLanguage2')}}</span>
    <select
    data-testid="submit-select-language2"
      class="mb-5 px-3 py-3.5 w-[350px] h-[50px] bg-white rounded-lg border border-zinc-400 text-primary-text"
      :placeholder="$t('submitPage.selectLanguage2')"
      v-model="submissionStore.selectLanguage2"
    >
      <option
        :key="index"
        v-for="(locale, index) in localeStore.localeDisplayOptions"
        selected
        :value="locale.code"
      >{{ locale.displayText }}</option>
    </select>
    <span
      class="mb-2 text-neutral-600 text-sm font-normal font-['Noto Sans JP']"
    >{{ $t('submitPage.otherNotes')}}({{ $t('submitPage.optional')}})</span>
    <input
    data-testid="submit-input-notes"
      class="mb-[71px] px-3 py-3.5 w-[350px] h-[50px] bg-white rounded-lg border border-zinc-400"
      type="text"
      v-model="submissionStore.otherNotes"
    />
    <button
    data-testid="submit-submitbutton"
      class="px-20 py-3 rounded-full bg-currentColor w-[350px] text-center text-white text-base font-medium font-['Noto Sans JP']"
      @click="submissionStore.submit()"
    >{{ $t('submitPage.submitButton')}}</button>
  </div>
</template>

  <script lang="ts" setup>
import { useSubmissionStore } from "~/stores/submissionStore"
import { useLocaleStore } from "~/stores/localeStore"

const submissionStore = useSubmissionStore()
const localeStore = useLocaleStore()
</script>
