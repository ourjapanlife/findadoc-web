<template>
    <div class="flex flex-col gap-2">
        <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mb-4">
            <SVGSiteLogo class="w-5 h-5 text-primary" />
        </div>

        <!-- Navigation Links -->
        <button
            @click="setView(SelectedModerationListView.Submissions)"
            :class="[
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                isSubmissionsActive 
                    ? 'bg-white border-l-4 border-primary font-semibold text-primary-text' 
                    : 'text-primary-text-muted hover:bg-white/50'
            ]"
            data-testid="mod-dashboard-leftnav-submissions"
        >
            <SVGSubmissionsIcon class="w-5 h-5" />
            <span class="text-sm">{{ t('modDashboardLeftNav.submissions') }}</span>
        </button>

        <button
            @click="setView(SelectedModerationListView.Facilities)"
            :class="[
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                isFacilitiesActive 
                    ? 'bg-white border-l-4 border-primary font-semibold text-primary-text' 
                    : 'text-primary-text-muted hover:bg-white/50'
            ]"
            data-testid="mod-dashboard-leftnav-facilities"
        >
            <SVGFacilitiesIcon class="w-5 h-5" />
            <span class="text-sm">{{ t('modDashboardLeftNav.facilities') }}</span>
        </button>

        <button
            @click="setView(SelectedModerationListView.HealthcareProfessionals)"
            :class="[
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                isHealthcareProfessionalsActive 
                    ? 'bg-white border-l-4 border-primary font-semibold text-primary-text' 
                    : 'text-primary-text-muted hover:bg-white/50'
            ]"
            data-testid="mod-dashboard-leftnav-healthcare-professionals"
        >
            <SVGHealthcareProfessionalsIcon class="w-5 h-5" />
            <span class="text-sm">{{ t('modDashboardLeftNav.healthcareProfessionals') }}</span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SVGSiteLogo from '~/assets/icons/site-logo.svg'
import SVGSubmissionsIcon from '../assets/icons/submissions-left-navbar.svg'
import SVGFacilitiesIcon from '../assets/icons/facility-left-navbar.svg'
import SVGHealthcareProfessionalsIcon from '../assets/icons/healthcareprofessional-left-navbar.svg'
import { useModerationSubmissionsStore, SelectedModerationListView } from '~/stores/moderationSubmissionsStore'

const { t } = useI18n()
const moderationSubmissionsStore = useModerationSubmissionsStore()

const isSubmissionsActive = computed(() => 
    moderationSubmissionsStore.selectedModerationListViewChosen === SelectedModerationListView.Submissions
)

const isFacilitiesActive = computed(() => 
    moderationSubmissionsStore.selectedModerationListViewChosen === SelectedModerationListView.Facilities
)

const isHealthcareProfessionalsActive = computed(() => 
    moderationSubmissionsStore.selectedModerationListViewChosen === SelectedModerationListView.HealthcareProfessionals
)

function setView(view: SelectedModerationListView) {
    moderationSubmissionsStore.setSelectedModerationListViewChosen(view)
}
</script>
