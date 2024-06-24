<template>
    <div
        v-show="store.isLoading"
        class="h-full w-full bg-gray-200/70 z-10 absolute"
    >
        <div class="flex justify-center align-middle mt-12">
            <div class="flex text-primary self-center text-4xl">
                Loading
            </div>
            <SVGLoadingIcon
                role="img"
                alt="loading animation"
                title="loading animation"
                class="flex h-12"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useLoadingStore } from '../stores/loadingStore.js'
import SVGLoadingIcon from '~/assets/icons/loading.svg'

const store = useLoadingStore()
</script>
