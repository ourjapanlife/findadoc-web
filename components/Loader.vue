<template>
    <div class="h-full w-full flex align-middle justify-around bg-gray-200/50 z-10 absolute" v-show="store.isLoading">
        <div class="flex w-full text-primary mx-3 text-4xl self-center">Loading...</div>
        <svg role="img" alt="loading animation" title="loading animation"
            class="loading-icon fill-primary h-25 w-25 self-center group-hover:fill-primary-text-inverted">
            <use xlink:href="../assets/images/loading.svg#loading-svg" />
        </svg>
    </div>
</template>

<script setup lang="ts">
import { useLoadingStore } from '../stores/loadingStore.js'

const store = useLoadingStore()

</script>
