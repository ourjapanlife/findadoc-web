<template>
    <div class="h-full">
        <TopNav />
        <div class="flex flex-col md:flex-row h-full">
            <Welcome />
            <FeaturedNews />
        </div>
        <div class="w-full">
            <Media />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'IndexPage'
})
</script>
