<template>
    <div
        id="index"
        class="h-full w-full overflow-hidden"
    >
        <div
            v-if="!isPortrait"
            class="flex h-full overflow-clip"
        >
            <LeftNavbar class="bg-primary-bg w-96 overflow-y-auto" />
            <MainContentContainer class="overflow-clip" />
        </div>
        <div
            v-else
            class="h-full w-full"
        >
            <MainContentContainer />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useScreenOrientation } from '~/utils/useScreenOrientation'
import { useModalStore } from '~/stores/modalStore'

useModalStore()

const { isPortrait } = useScreenOrientation()
</script>
