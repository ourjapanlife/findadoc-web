<template>
    <div
        id="index"
        class="h-full w-full overflow-hidden"
    >
        <div
            v-if="screenOrientation?.includes('landscape')"
            class="flex h-full overflow-clip"
        >
            <LeftNavbar class="bg-primary-bg w-[358px] overflow-y-auto" />
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
import { useScreenOrientation } from '@vueuse/core'
import { onMounted, watch, ref, type Ref } from 'vue'
import { useModalStore } from '~/stores/modalStore'

const screenOrientation: Ref<OrientationType | undefined> = ref('landscape-primary')

useModalStore()

watch(screenOrientation, newScreenOrientation => {
    screenOrientation.value = newScreenOrientation
})

onMounted(() => {
    screenOrientation.value = useScreenOrientation().orientation.value
})
</script>
