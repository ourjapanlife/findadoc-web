<template>
    <div
        :id="testId"
        :data-testid="testId"
        class="flex flex-col gap-3 rounded-md bg-secondary-bg p-3 text-sm text-primary-text"
        role="status"
    >
        <p class="m-0">
            {{ possible ? t('submitPage.existingPlacePossible') : t('submitPage.existingPlace') }}
        </p>
        <dl class="grid gap-3">
            <div v-if="mapsHref">
                <dt class="font-semibold text-primary-text">
                    {{ t('submitPage.previewLocation') }}
                </dt>
                <dd>
                    <a
                        :href="mapsHref"
                        class="text-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                        :data-testid="`${testId}-map`"
                    >{{ t('submitPage.previewOpenMap') }}</a>
                </dd>
            </div>
            <div>
                <dt class="font-semibold text-primary-text">
                    {{ t('submitPage.existingPlacePage') }}
                </dt>
                <dd>
                    <NuxtLink
                        :to="pageHref"
                        class="text-primary"
                        :data-testid="`${testId}-page`"
                    >
                        {{ label }}
                    </NuxtLink>
                </dd>
            </div>
            <div v-if="showContact">
                <dt class="font-semibold text-primary-text">
                    {{ t('submitPage.existingPlaceContact') }}
                </dt>
                <dd>
                    <a
                        :href="CONTACT_MAILTO"
                        class="text-primary"
                        :data-testid="`${testId}-contact`"
                    >{{ CONTACT_EMAIL }}</a>
                </dd>
            </div>
        </dl>
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '#imports'
import { facilityPath } from '~/utils/clinicPath'
import type { ExistingFacilityMatch } from '~/utils/existingFacility'
import { facilityMapsUrl } from '~/utils/searchDirectory'
import { CONTACT_EMAIL, CONTACT_MAILTO } from '~/utils/site'
import { isJapaneseLocale } from '~/utils/activeLocale'

const props = withDefaults(defineProps<{
    facility: ExistingFacilityMatch
    testId?: string
    /** Moderators see a possible match. The public form states that the clinic is already listed. */
    possible?: boolean
    showContact?: boolean
}>(), {
    testId: 'existing-facility-notice',
    possible: false,
    showContact: false
})

const { t, locale } = useI18n()
const label = computed(() =>
    isJapaneseLocale(locale.value) ? props.facility.nameJa : props.facility.nameEn)
const pageHref = computed(() => facilityPath({
    id: props.facility.id,
    nameEn: props.facility.nameEn,
    contact: {
        address: {
            prefectureEn: props.facility.prefectureEn,
            cityEn: props.facility.cityEn
        }
    }
}))
const mapsHref = computed(() => facilityMapsUrl({
    nameEn: props.facility.nameEn,
    nameJa: props.facility.nameJa,
    mapLatitude: props.facility.mapLatitude,
    mapLongitude: props.facility.mapLongitude,
    contact: { googleMapsUrl: props.facility.googleMapsUrl }
}, isJapaneseLocale(locale.value)))
</script>
