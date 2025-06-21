<template>
    <!-- Landscape / Desktop Mode -->
    <div
        v-if="$viewport.isGreaterThan('tablet')"
        id="search-landscape"
    >
        <Loader />
        <Modal class="max-h-[calc(100vh-10rem)] mt-12 overflow-y-auto">
            <SearchResultDetails />
        </Modal>
        <div class="flex h-[calc(100vh-10rem)]">
            <LeftNavbar class="bg-primary-bg w-96" />
            <MapContainer class="grow" />
        </div>
    </div>
    <!-- Portrait / Mobile Mode -->
    <div
        v-else
        id="search-portrait"
    >
        <Loader />
        <Modal class="min-h-1/2 mt-12">
            <SearchResultDetails />
        </Modal>
        <MapContainer class="h-1/4" />
        <SearchResultsList class="h-3/4" />
    </div>
</template>

<script lang="ts" setup>

</script>

