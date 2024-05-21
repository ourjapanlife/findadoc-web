<template>
    <div class="h-full w-full bg-gray-200/70 z-10 absolute" v-show="store.isLoading">
        <div class="flex justify-center align-middle">
            <div class="flex text-primary self-center text-4xl">Loading</div>
            <SVGLoadingIcon role="img" alt="loading animation" title="loading animation" class="flex h-28" />
        </div>
    </div>
</template>

<script setup lang="ts">
import SVGLoadingIcon from '~/assets/icons/loading.svg'
import { useLoadingStore } from '../stores/loadingStore.js'

const store = useLoadingStore()

</script>
