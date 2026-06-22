<template>
    <div>
        <Suspense>
            <div
                data-testid="moderation-content"
                class="h-full w-full flex flex-col flex-1 min-h-0 font-sans text-primary-text bg-primary-bg"
            >
                <div
                    v-if="authStore.isLoadingAuth"
                    class="w-full h-full mt-16 mb-16 text-primary-text text-2xl font-bold
                flex self-center justify-items-center justify-center text-center"
                >
                    {{ t('login.checkingauth') }}
                </div>
                <div
                    v-if="!doesTheUserHaveAccess"
                    data-testid="unauthorized-message"
                >
                    <div
                        class="flex flex-col w-full h-full mt-16 mb-16 text-primary-text text-2xl font-bold
                    self-center justify-items-center justify-center text-center"
                    >
                        <span>{{ t('login.unauthorizedline1') }}</span>
                        <span>{{ t('login.unauthorizedline2') }}</span>
                        <NuxtLink
                            to="https://forms.gle/4E763qfaq46kEsn99"
                            target="_blank"
                            class="inline text-primary underline"
                        >
                            {{ t('login.unauthorizedline3') }}
                        </NuxtLink>
                    </div>
                </div>
                <div
                    v-if="authStore.isLoggedIn"
                    data-testid="moderation-page"
                    class="flex flex-col md:flex-row flex-1 min-h-0"
                >
                    <ModLeftNavbar />
                    <div class="w-full flex flex-col items-stretch p-3 md:p-4 gap-3 md:gap-4 min-h-0 flex-1">
                        <div
                            class="bg-secondary-bg border border-accent-bg rounded-xl
                            shadow-sm px-3 md:px-5 py-3 md:py-4"
                        >
                            <ModTopbar />
                        </div>
                        <div
                            class="bg-secondary-bg border border-accent-bg rounded-xl shadow-sm
                            flex-1 min-h-0 overflow-hidden"
                        >
                            <ModMainContent />
                        </div>
                    </div>
                </div>
            </div>
            <!-- loading state via #fallback slot -->
            <template #fallback>
                <div
                    class="w-full h-full mt-16 mb-16 text-primary-text text-2xl font-bold
                flex self-center justify-items-center justify-center text-center"
                >
                    {{ t('login.checkingauth') }}
                </div>
            </template>
        </Suspense>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/authStore'
import { definePageMeta, useI18n } from '#imports'

// tell nuxt to our moderation layout
definePageMeta({
    layout: 'moderationlayout'
})

const { t } = useI18n()

const authStore = useAuthStore()
const route = useRoute()
const doesTheUserHaveAccess: Ref<boolean> = ref(true)

const runModerationAuthRedirect = () => {
    void authStore.redirectIfUnauthenticatedUser('/moderation', doesTheUserHaveAccess)
}

watch(
    () => [authStore.isLoggedIn, authStore.isLoadingAuth] as const,
    runModerationAuthRedirect
)
watch(() => route.path, runModerationAuthRedirect)
onMounted(runModerationAuthRedirect)
</script>
