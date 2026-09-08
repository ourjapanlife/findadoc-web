<template>
    <ul
        class="m-0 flex list-none flex-col gap-4 p-0"
        data-testid="hub-facility-list"
    >
        <li
            v-for="facility in facilities"
            :key="facility.id"
        >
            <SearchResultCard :result="facility" />
        </li>
    </ul>
</template>

<script setup lang="ts">
import type { FacilitySearchResult } from '~/utils/searchDirectory'

defineProps<{
    facilities: FacilitySearchResult[]
}>()
</script>
