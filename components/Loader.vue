<template>
    <div
        v-show="loadingStore.isLoading"
        class="h-full w-full bg-primary-bg/70 z-10 absolute"
    >
        <div class="flex justify-center align-middle mt-12">
            <div class="flex text-primary self-center text-4xl">
                {{ t('common.loading') }}
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
import { useI18n } from 'vue-i18n'
import { useLoadingStore } from '../stores/loadingStore.js'
import SVGLoadingIcon from '~/assets/icons/loading.svg'

const { t } = useI18n()
const loadingStore = useLoadingStore()
</script>
