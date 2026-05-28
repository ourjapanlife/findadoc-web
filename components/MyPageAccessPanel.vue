<template>
    <div
        data-testid="mod-access-panel"
        class="mb-6 pb-5 border-b border-accent-bg text-base"
    >
        <div
            v-if="!accessStore.isLoaded && !accessStore.loadError"
            class="text-primary-text-muted"
        >
            {{ t('accessPanel.loading') }}
        </div>
        <div
            v-else-if="accessStore.loadError"
            class="text-error"
        >
            {{ t('accessPanel.loadError') }}
        </div>
        <template v-else>
            <div class="mb-3">
                <span class="font-medium text-primary-text block mb-1">{{ t('accessPanel.signedInAs') }}</span>
                <span class="text-primary-text-muted">{{ authStore.userId }}</span>
            </div>
            <div class="mb-3">
                <span class="font-medium text-primary-text block mb-2">{{ t('accessPanel.roles') }}</span>
                <div class="flex flex-wrap gap-2">
                    <span
                        v-for="role in accessRoles"
                        :key="role"
                        class="inline-flex items-center px-3 py-1.5 rounded-full
                        text-sm font-semibold bg-accent-bg/40 text-primary-text"
                    >
                        {{ role }}
                    </span>
                    <span
                        v-if="accessRoles.length === 0"
                        class="text-primary-text-muted"
                    >
                        {{ t('accessPanel.none') }}
                    </span>
                </div>
            </div>

            <div class="flex flex-col gap-3">
                <div
                    v-if="settingsPages.length > 0"
                    class="flex flex-col gap-1"
                >
                    <button
                        type="button"
                        class="md:hidden flex items-center justify-between py-1 text-left"
                        @click="settingsExpanded = !settingsExpanded"
                    >
                        <span class="font-bold text-primary-text">{{ t('accessPanel.sections.settings') }}</span>
                        <SVGAccordionArrow
                            class="w-4 h-4 fill-primary-text transition-transform"
                            :class="settingsExpanded ? 'rotate-180' : ''"
                            aria-hidden="true"
                        />
                    </button>
                    <span class="hidden md:block font-bold text-primary-text">
                        {{ t('accessPanel.sections.settings') }}
                    </span>
                    <ul class="hidden md:flex md:flex-col md:gap-1 pl-0 list-none">
                        <li
                            v-for="page in settingsPages"
                            :key="page.id"
                        >
                            <NuxtLink
                                :to="pageRoute(page)"
                                class="text-primary-text hover:text-primary block py-1.5 px-2 rounded-md
                                hover:bg-accent-bg/30 text-base font-semibold underline underline-offset-2"
                                :data-testid="`access-page-link-${page.id}`"
                                @click="onPageClick(page.listView)"
                            >
                                {{ page.label }}
                            </NuxtLink>
                        </li>
                    </ul>
                    <ul
                        v-show="settingsExpanded"
                        class="md:hidden flex flex-col gap-1 pl-0 list-none"
                    >
                        <li
                            v-for="page in settingsPages"
                            :key="`${page.id}-mobile`"
                        >
                            <NuxtLink
                                :to="pageRoute(page)"
                                class="text-primary-text hover:text-primary block py-1.5 px-2 rounded-md
                                hover:bg-accent-bg/30 text-base font-semibold underline underline-offset-2"
                                :data-testid="`access-page-link-${page.id}-mobile`"
                                @click="onPageClick(page.listView)"
                            >
                                {{ page.label }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <div
                    v-if="moderationPages.length > 0"
                    class="flex flex-col gap-1"
                >
                    <button
                        type="button"
                        class="md:hidden flex items-center justify-between py-1 text-left"
                        @click="moderationExpanded = !moderationExpanded"
                    >
                        <span class="font-bold text-primary-text">{{ t('accessPanel.sections.moderation') }}</span>
                        <SVGAccordionArrow
                            class="w-4 h-4 fill-primary-text transition-transform"
                            :class="moderationExpanded ? 'rotate-180' : ''"
                            aria-hidden="true"
                        />
                    </button>
                    <span class="hidden md:block font-bold text-primary-text">
                        {{ t('accessPanel.sections.moderation') }}
                    </span>
                    <ul class="hidden md:flex md:flex-col md:gap-1 pl-0 list-none">
                        <li
                            v-for="page in moderationPages"
                            :key="page.id"
                        >
                            <NuxtLink
                                :to="pageRoute(page)"
                                class="text-primary-text hover:text-primary block py-1.5 px-2 rounded-md
                                hover:bg-accent-bg/30 text-base font-semibold underline underline-offset-2"
                                :data-testid="`access-page-link-${page.id}`"
                                @click="onPageClick(page.listView)"
                            >
                                {{ page.label }}
                            </NuxtLink>
                        </li>
                    </ul>
                    <ul
                        v-show="moderationExpanded"
                        class="md:hidden flex flex-col gap-1 pl-0 list-none"
                    >
                        <li
                            v-for="page in moderationPages"
                            :key="`${page.id}-mobile`"
                        >
                            <NuxtLink
                                :to="pageRoute(page)"
                                class="text-primary-text hover:text-primary block py-1.5 px-2 rounded-md
                                hover:bg-accent-bg/30 text-base font-semibold underline underline-offset-2"
                                :data-testid="`access-page-link-${page.id}-mobile`"
                                @click="onPageClick(page.listView)"
                            >
                                {{ page.label }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <div
                    v-if="settingsPages.length === 0 && moderationPages.length === 0"
                    class="text-primary-text-muted py-1 px-2"
                >
                    {{ t('accessPanel.none') }}
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '~/stores/authStore'
import { useCurrentUserAccessStore } from '~/stores/currentUserAccessStore'
import {
    SelectedModerationListView,
    type SelectedModerationListView as SelectedModerationListViewType
} from '~/stores/moderationSubmissionsStore'
import { useModerationSubmissionsStore } from '~/stores/moderationSubmissionsStore'
import SVGAccordionArrow from '~/assets/icons/accordion-arrow.svg'

interface NavPage {
    id: string
    route: string
    label: string
    listView?: SelectedModerationListViewType
}

const { t } = useI18n()
const authStore = useAuthStore()
const accessStore = useCurrentUserAccessStore()
const moderationSubmissionsStore = useModerationSubmissionsStore()

const accessRoles = computed(() => accessStore.roles)
const settingsExpanded = ref(false)
const moderationExpanded = ref(false)

const settingsPages = computed<NavPage[]>(() => [{
    id: 'my-page',
    route: '/my-page',
    label: t('topNav.myPage')
}])

const moderationPages = computed<NavPage[]>(() => [
    ...(accessStore.hasScope('read:submissions')
        ? [{
            id: 'moderation-submissions',
            route: '/my-page',
            label: t('modDashboardLeftNav.submissions'),
            listView: SelectedModerationListView.Submissions
        }]
        : []),
    ...(accessStore.hasScope('read:facilities')
        ? [{
            id: 'moderation-facilities',
            route: '/my-page',
            label: t('modDashboardLeftNav.facilities'),
            listView: SelectedModerationListView.Facilities
        }]
        : []),
    ...(accessStore.hasScope('read:healthcareprofessionals')
        ? [{
            id: 'moderation-healthcare-professionals',
            route: '/my-page',
            label: t('modDashboardLeftNav.healthcareProfessionals'),
            listView: SelectedModerationListView.HealthcareProfessionals
        }]
        : [])
])

function onPageClick(listView?: SelectedModerationListViewType): void {
    if (listView) {
        moderationSubmissionsStore.setSelectedModerationListViewChosen(listView)
    }
}

function pageRoute(page: NavPage): string | { path: string, query: { view: string } } {
    if (!page.listView) {
        return page.route
    }

    const view = page.listView === SelectedModerationListView.Submissions
        ? 'submissions'
        : page.listView === SelectedModerationListView.Facilities
            ? 'facilities'
            : 'healthcare-professionals'

    return {
        path: page.route,
        query: { view }
    }
}

async function loadIfLoggedIn(): Promise<void> {
    if (!authStore.isLoggedIn || authStore.isLoadingAuth) {
        return
    }
    await accessStore.fetchAccess()
}

onMounted(() => {
    void loadIfLoggedIn()
})

watch(
    () => [authStore.isLoggedIn, authStore.isLoadingAuth] as const,
    ([loggedIn, loading]) => {
        if (loggedIn && !loading && !accessStore.isLoaded) {
            void accessStore.fetchAccess()
        }
        if (!loggedIn) {
            accessStore.reset()
        }
    }
)
</script>
