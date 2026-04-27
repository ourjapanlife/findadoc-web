<template>
    <div class="h-screen w-screen overflow-hidden flex bg-primary/10 font-sans">
        <Suspense>
            <template #default>
                <div
                    data-testid="moderation-content"
                    class="flex w-full h-full"
                >
                    <aside class="w-70 h-full bg-white border-r border-gray-200 shrink-0">
                        <ModLeftNavbar />
                    </aside>

                    <div class="flex-1 flex flex-col min-w-0 h-full">
                        <header class="w-full bg-white border-b border-gray-200 flex items-center px-12 shrink-0">
                            <ModTopbar class="w-full" />
                        </header>

                        <main class="flex-1 overflow-y-auto px-12 pb-12">
                            <div class="h-10" />

                            <ModLayoutButtons />

                            <section
                                class="w-full max-w-350 mx-auto bg-white rounded-xl
                            shadow-sm border border-gray-200 min-h-150 flex flex-col"
                            >
                                <div
                                    v-if="authStore.isLoadingAuth"
                                    class="p-10 text-center font-bold"
                                >
                                    {{ t('login.checkingauth') }}
                                </div>

                                <div
                                    v-if="!doesTheUserHaveAccess"
                                    class="p-10 text-center"
                                >
                                    <h2 class="text-2xl font-bold">
                                        {{ t('login.unauthorizedline1') }}
                                    </h2>
                                    <NuxtLink
                                        to="https://forms.gle/4E763qfaq46kEsn99"
                                        target="_blank"
                                        class="text-primary underline"
                                    >
                                        {{ t('login.unauthorizedline3') }}
                                    </NuxtLink>
                                </div>

                                <div
                                    v-if="authStore.isLoggedIn"
                                    class="p-8"
                                >
                                    <ModMainContentTopbar />
                                    <ModMainContent />
                                </div>
                            </section>
                        </main>
                    </div>
                </div>
            </template>
            <!-- loading state via #fallback slot -->
            <template #fallback>
                <div class="h-screen w-screen flex items-center justify-center text-2xl font-bold bg-white">
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

watch(() => route.path, runModerationAuthRedirect)
onMounted(runModerationAuthRedirect)
</script>
