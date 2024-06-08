<template>
    <Suspense>
        <div data-testid="unauthorized-message" v-if="!authStore.isAdmin && !authStore.isModerator">
            <div class="flex flex-col">
                <span>{{ $t('login.unauthorizedline1') }}</span>
                <span>{{ $t('login.unauthorizedline2') }}</span>
                <span class="inline">{{ $t('login.unauthorizedline3') }}</span>
            </div>
        </div>
        <div data-testid="moderation-page" class="flex flex-row h-screen" v-if="authStore.isLoggedIn">
            <ModLeftNavbar />
            <div class="w-full flex flex-col items-stretch">
                <ModTopbar />
                <ModMainContent />
            </div>
        </div>
        <!-- loading state via #fallback slot -->
        <template #fallback>
            {{ $t('login.checkingauth') }}
        </template>
    </Suspense>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from "~/stores/authStore"
import { watch } from "vue"

const authStore = useAuthStore()
const route = useRoute()

const checkIfUserIsLoggedIn = async () => {
    //ignore if route change is unrelated to moderation
    if (route.path !== "/moderation") {
        return
    }

    // Redirect to login page if user is not logged in
    if (!authStore.isLoggedIn) {
        const router = useRouter()
        router.push("/login")

        return
    }

    // This promise is here to make the Suspense component work.
    // It doesn't do anything, but <Suspense> requires an awaited setup method
    await new Promise((resolve) => {
        resolve(true)
    })
}

watch(route, async () => {
    await checkIfUserIsLoggedIn()
})

await checkIfUserIsLoggedIn()

</script>
