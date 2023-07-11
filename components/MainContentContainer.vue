
import SearchResultDetails from './SearchResultDetails.vue';

<template>
    <div class="flex flex-1 bg-secondary-bg/20 hover:shadow-inner hover:shadow-secondary-bg/90">
        <!-- <WelcomeSection /> -->
        <Modal v-show="useModalStore().$state.isOpen" class="min-h-1/2 ml-8 mt-12">
            <SearchResultDetails />
        </Modal>
        <MapContainer />
    </div>
</template>

<script lang="ts" setup>
import { useModalStore } from '~/stores/modalStore'
</script>
