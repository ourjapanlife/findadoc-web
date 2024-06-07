<template>
    <Suspense>
        <div data-testid="moderation-page" class="flex flex-row h-screen">
            <!-- This button exists solely for testing that the states work and how you can implement it on other components. -->
            <!-- <button @click="store.setActiveScreen(ModerationScreen.editSubmission)">Change state!</button> -->
            <ModLeftNavbar />
            <div class="w-full flex flex-col items-stretch">
                <ModTopbar />
                <ModMainContent />
            </div>
        </div>
        <!-- loading state via #fallback slot -->
        <template #fallback>
            Checking auth...
        </template>
    </Suspense>
</template>

<script setup lang="ts">
import { useModerationScreenStore, ModerationScreen } from "~/stores/moderationScreenStore"
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from "~/stores/authStore"
import { watch } from "vue"

const store = useModerationScreenStore()
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

    const currentPath = route.path.replace("/", "")
    store.setEnableModerationPanelToTrue(currentPath)

    await new Promise((resolve) => {
        resolve(true)
    })
}

watch(route, async () => {
    await checkIfUserIsLoggedIn()
})

await checkIfUserIsLoggedIn()

</script>
