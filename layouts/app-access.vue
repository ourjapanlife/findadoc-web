<template>
    <!--
      Shell for logged-in “app” routes: site header without search, permission-based left nav,
      scrollable main column, footer. Inner pages (e.g. moderation) keep their own sub-nav and top bars.
    -->
    <div
        data-testid="app-access-layout"
        class="h-dvh w-full font-sans text-primary-text bg-primary-bg flex flex-col"
    >
        <TopNav
            class="shrink-0"
            hide-search
        />

        <div class="flex flex-1 min-h-0 overflow-hidden">
            <AppAccessLeftNav />
            <main class="flex-1 min-w-0 min-h-0 overflow-y-auto flex flex-col">
                <NuxtPage />
            </main>
        </div>

        <Footer class="shrink-0" />
    </div>
</template>

<script lang="ts" setup>
</script>
