<template>
    <div class="flex align-middle justify-center" v-show="!store.isLoading">
        <span class="text-primary mx-3">Loading</span>
        <svg role="img" alt="loading animation" title="loading animation"
            class="loading-icon fill-primary h-5 w-5 self-center group-hover:fill-primary-text-inverted">
            <use xlink:href="../assets/images/loading.svg#loading-svg" />
        </svg>
    </div>
</template>

<script setup lang="ts">
import { useLoadingStore } from '../stores/loadingStore.js'

const store = useLoadingStore()

</script>
