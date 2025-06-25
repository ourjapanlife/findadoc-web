<template>
    <!-- The main app should be set to h-screen. This is to ensure that the TopNav and Footer are
        always visible on desktop screens without scrolling.
    -->
    <div
        data-testid="app"
        class="h-screen w-full font-sans text-primary-text bg-primary-bg"
    >
        <TopNav />
        <NuxtPage />
        <Footer />
    </div>
</template>

<script setup lang="ts">
</script>
