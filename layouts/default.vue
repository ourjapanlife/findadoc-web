<script setup lang="ts">
import { useScreenOrientation } from '~/composables/useScreenOrientation'

const { isLandscape } = useScreenOrientation()
</script>

<template>
    <!--
    The main app should se h-dvh (dynamic viewport height) so the app fits the visible viewport on mobile
    which helps us avoid any 100vh / h-screen issue where the browser address bars change the viewport and
    can cause jumpy layouts or inconsistencies with fixed positioning.
  - We often add overflow-y-auto to the main area so the main app should have a
    flex column layout where only the <main> area scrolls. This helps keep the
    TopNav and Footer always visible without needing position.
  - The TopNav and Footer should use shrink-0 they don’t shrink when the middle content grows;
    the main content gets the remaining space via flex-1.
-->
    <div class="h-dvh w-full font-sans text-primary-text bg-primary-bg flex flex-col">
        <TopNav class="shrink-0" />

        <main class="flex-1 overflow-y-auto">
            <NuxtPage />
        </main>

        <Footer
            v-if="isLandscape"
            class="shrink-0"
        />
    </div>
</template>
