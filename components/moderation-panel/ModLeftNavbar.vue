<template>
    <div class="w-64 h-screen bg-white p-8 flex flex-col gap-10">
        <div class="flex items-center mb-2">
            <SvgoSiteLogo class="w-12 h-12" />
        </div>

        <nav class="flex flex-col gap-8">
            <button
                class="flex items-center gap-4 text-left group cursor-pointer"
                :class="selectedDashboardView === SelectedModerationListView.Submissions ? 'text-black' : 'text-slate-400'"
                @click="updateView(SelectedModerationListView.Submissions)"
            >
                <span class="text-xl font-bold tracking-tight">
                    {{ t("modDashboardLeftNav.submissions") }}
                </span>
            </button>

            <button
                class="flex items-center gap-4 text-left group cursor-pointer"
                :class="selectedDashboardView === SelectedModerationListView.Facilities ? 'text-black' : 'text-slate-400'"
                @click="updateView(SelectedModerationListView.Facilities)"
            >
                <span class="text-xl font-bold tracking-tight">
                    {{ t("modDashboardLeftNav.facilities") }}
                </span>
            </button>

            <button
                class="flex items-start gap-4 text-left group cursor-pointer"
                :class="selectedDashboardView === SelectedModerationListView.HealthcareProfessionals
                    ? 'text-black' : 'text-slate-400'"
                @click="updateView(SelectedModerationListView.HealthcareProfessionals)"
            >
                <span class="text-xl font-bold tracking-tight leading-tight block">
                    {{ t("modDashboardLeftNav.healthcareProfessionals") }}
                </span>
            </button>
        </nav>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useModerationSubmissionsStore, SelectedModerationListView } from '~/stores/moderationSubmissionsStore'

const { t } = useI18n()
const moderationSubmissionsStore = useModerationSubmissionsStore()

const selectedDashboardView = computed(() => moderationSubmissionsStore.selectedModerationListViewChosen)

const updateView = (view: SelectedModerationListView) => {
    moderationSubmissionsStore.setSelectedModerationListViewChosen(view)
}
</script>
