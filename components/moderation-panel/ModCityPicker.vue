<template>
    <div class="flex flex-col">
        <label
            :for="id"
            class="field-label"
        >
            {{ label }}
        </label>
        <select
            :id="id"
            :value="cityId"
            :required="required"
            :disabled="!prefectureEn || loading"
            :data-testid="testId"
            class="field disabled:cursor-not-allowed disabled:opacity-60"
            @change="onChange"
        >
            <option value="">
                {{ t('modFacilitySection.placeholderSelectCity') }}
            </option>
            <option
                v-for="city in cities"
                :key="city.id"
                :value="city.id"
            >
                {{ city.nameEn }} · {{ city.nameJa }}
            </option>
        </select>
        <p
            v-if="loadError"
            class="mt-1.5 text-xs font-sans text-error"
        >
            {{ t('modFacilitySection.cityListUnavailable') }}
        </p>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { fetchCities, type CityOption } from '~/utils/cityOptions'

const props = defineProps<{
    id: string
    label: string
    prefectureEn: string
    cityId: string
    testId?: string
    required?: boolean
}>()

const emit = defineEmits<{
    select: [city: CityOption | null]
}>()

const { t } = useI18n()
const cities = ref<CityOption[]>([])
const loading = ref(false)
const loadError = ref(false)
let loadRequest = 0

async function loadCities() {
    const request = ++loadRequest
    if (!props.prefectureEn.trim()) {
        cities.value = []
        loadError.value = false
        return
    }

    loading.value = true
    loadError.value = false
    try {
        const nextCities = await fetchCities(props.prefectureEn)
        if (request !== loadRequest) return
        cities.value = nextCities
    } catch (error) {
        if (request !== loadRequest) return
        console.error('Loading cities failed', error)
        cities.value = []
        loadError.value = true
    } finally {
        if (request === loadRequest) loading.value = false
    }
}

function onChange(event: Event) {
    const selectedId = (event.target as HTMLSelectElement).value
    emit('select', cities.value.find(city => city.id === selectedId) ?? null)
}

watch(() => props.prefectureEn, () => {
    void loadCities()
}, { immediate: true })
</script>
