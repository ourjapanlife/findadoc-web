<template>
    <div class="flex flex-col">
        <label
            :for="id"
            class="field-label"
        >
            {{ t('modFacilitySection.citySuggestionLabel') }}
        </label>
        <input
            :id="id"
            v-model="query"
            type="search"
            autocomplete="off"
            class="field"
            :placeholder="t('modFacilitySection.citySuggestionPlaceholder')"
            :data-testid="testId"
            @input="onInput"
        >
        <p
            v-if="loadError"
            class="mt-1.5 text-xs font-sans text-error"
        >
            {{ t('modFacilitySection.citySuggestionUnavailable') }}
        </p>
        <ul
            v-if="suggestions.length"
            class="mt-2 flex flex-col gap-1"
            role="listbox"
        >
            <li
                v-for="suggestion in suggestions"
                :key="suggestion.placeId"
            >
                <button
                    type="button"
                    class="field h-auto min-h-12 py-2 text-left"
                    @click="choose(suggestion)"
                >
                    {{ suggestion.label }}
                    <span
                        v-if="suggestion.city"
                        class="mt-0.5 block text-xs text-primary-text-muted"
                    >
                        {{ suggestion.city.nameEn }} · {{ suggestion.city.nameJa }}
                    </span>
                </button>
            </li>
        </ul>
        <p
            v-if="suggestions.length"
            class="mt-2 flex items-center gap-2 text-xs text-primary-text-muted"
        >
            <img
                src="https://developers.google.com/static/maps/documentation/images/google_on_white.png"
                alt=""
                width="59"
                height="18"
            >
            {{ t('modFacilitySection.citySuggestionAttribution') }}
        </p>
        <p
            v-if="unmapped"
            class="mt-1.5 text-xs font-sans text-primary-text-muted"
        >
            {{ t('modFacilitySection.citySuggestionUnmapped') }}
        </p>
        <p
            v-if="saveError"
            class="mt-1.5 text-xs font-sans text-error"
        >
            {{ t('modFacilitySection.citySuggestionSaveFailed') }}
        </p>
    </div>
</template>

<script lang="ts" setup>
import { onUnmounted, ref } from 'vue'
import { fetchCitySuggestions, recordCityPlaceId, type CitySuggestion } from '~/utils/citySuggestions'
import type { CityOption } from '~/utils/cityOptions'

defineProps<{
    id: string
    testId?: string
}>()

const emit = defineEmits<{
    select: [city: (CityOption & { prefectureJa: string, placeId: string }) | null]
}>()

const { t } = useI18n()
const query = ref('')
const suggestions = ref<CitySuggestion[]>([])
const loadError = ref(false)
const unmapped = ref(false)
const saveError = ref(false)
let requestId = 0
let timer: ReturnType<typeof setTimeout> | undefined

function onInput() {
    unmapped.value = false
    saveError.value = false
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
        void search(query.value)
    }, 300)
}

async function search(value: string) {
    const current = ++requestId
    const trimmed = value.trim()
    if (trimmed.length < 2) {
        suggestions.value = []
        loadError.value = false
        return
    }

    loadError.value = false
    try {
        const next = await fetchCitySuggestions(trimmed)
        if (current !== requestId) return
        suggestions.value = next
    } catch (error) {
        if (current !== requestId) return
        console.error('City suggestions failed', error)
        suggestions.value = []
        loadError.value = true
    }
}

async function choose(suggestion: CitySuggestion) {
    suggestions.value = []
    query.value = ''
    if (!suggestion.city) {
        unmapped.value = true
        emit('select', null)
        return
    }

    unmapped.value = false
    emit('select', { ...suggestion.city, placeId: suggestion.placeId })
    try {
        await recordCityPlaceId(suggestion.city.id, suggestion.placeId)
        saveError.value = false
    } catch (error) {
        console.error('Saving a city place id failed', error)
        saveError.value = true
    }
}

onUnmounted(() => {
    if (timer) clearTimeout(timer)
})
</script>
