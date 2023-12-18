
import SearchResultDetails from './SearchResultDetails.vue';

<template>
    <div
        class="flex flex-1 bg-secondary-bg/20 hover:shadow-inner hover:shadow-secondary-bg/90 sm:flex sm:flex-col sm:w-full sm:order-1">
        <!-- <WelcomeSection /> -->
        <Loader />
        <Modal v-show="store.$state.isOpen" class="min-h-1/2 ml-8 mt-12">
            <SearchResultDetails />
        </Modal>
        <MapContainer />
    </div>
</template>

<script lang="ts" setup>
import { useModalStore } from '~/stores/modalStore'

const store = useModalStore()

</script>
