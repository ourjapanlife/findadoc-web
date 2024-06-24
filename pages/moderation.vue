<template>
    <div>
        <Suspense>
            <div
                data-testid="moderation-content"
                class="h-full w-full flex flex-col flex-1 font-sans text-primary-text bg-primary-bg"
            >
                <div
                    v-if="authStore.isLoadingAuth"
                    class="w-full h-full mt-16 mb-16 text-primary-text text-2xl font-bold
                flex self-center justify-items-center justify-center text-center"
                >
                    {{ $t('login.checkingauth') }}
                </div>
                <div
                    v-if="!authStore.isLoadingAuth && !authStore.isAdmin && !authStore.isModerator"
                    data-testid="unauthorized-message"
                >
                    <div
                        class="flex flex-col w-full h-full mt-16 mb-16 text-primary-text text-2xl font-bold
                    self-center justify-items-center justify-center text-center"
                    >
                        <span>{{ $t('login.unauthorizedline1') }}</span>
                        <span>{{ $t('login.unauthorizedline2') }}</span>
                        <NuxtLink
                            :to="'https://forms.gle/4E763qfaq46kEsn99'"
                            target="_blank"
                            class="inline text-primary underline"
                        >
                            {{ $t('login.unauthorizedline3') }}
                        </NuxtLink>
                    </div>
                </div>
                <div
                    v-if="authStore.isLoggedIn"
                    data-testid="moderation-page"
                    class="flex flex-row h-screen"
                >
                    <ModLeftNavbar />
                    <div class="w-full flex flex-col items-stretch">
                        <ModTopbar />
                        <ModMainContent />
                    </div>
                </div>
            </div>
            <!-- loading state via #fallback slot -->
            <template #fallback>
                <div
                    class="w-full h-full mt-16 mb-16 text-primary-text text-2xl font-bold
                flex self-center justify-items-center justify-center text-center"
                >
                    {{ $t('login.checkingauth') }}
                </div>
            </template>
        </Suspense>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { watch } from 'vue'
import { useAuthStore } from '~/stores/authStore'
import { definePageMeta } from '#imports'

// tell nuxt to our moderation layout
definePageMeta({
    layout: 'moderationlayout'
})

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const checkIfUserIsLoggedIn = async () => {
    // This promise is here to make the Suspense component work.
    // It doesn't do anything, but <Suspense> requires an awaited setup method
    await authStore.refreshUserCredentials()

    //ignore if route change is unrelated to moderation
    if (route.path === "/moderation" && !authStore.isLoggedIn && !authStore.isLoadingAuth) {
        // give the user a bit of time to read the message before redirecting
        setTimeout(() => {
            // Redirect to login page if user is not logged in
            router.push("/")
        }, 10000)
    }
}

watch(route, async () => {
    await checkIfUserIsLoggedIn()
})

await checkIfUserIsLoggedIn()
</script>
