<template>
    <div class="h-full">
        <div class="flex flex-col md:flex-row h-full">
            <WelcomeSection />
            <FeaturedNews />
        </div>
        <div class="w-full">
            <MediaSection />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        name: {
            type: String,
            default: ''
        },
        msg: {
            type: String,
            required: false,
            default: ''
        }
    },

    data() {
        return {
            count: 1
        }
    },
    mounted() {}
})
</script>
