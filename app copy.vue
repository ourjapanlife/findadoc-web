<template>
    <div class="h-screen flex flex-col font-sans text-primary-text bg-primary-bg theme-violet">
        <TopNav />
        <NuxtPage class="flex flex-1" />
        <Footer />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>
