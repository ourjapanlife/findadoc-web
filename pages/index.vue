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
import { defineComponent } from "vue";
export default defineComponent({
    props: {
        name: {
            type: String,
            default: "",
        },
        msg: {
            type: String,
            required: false,
            default: "",
            fchmvhjhkbhljxcfgvhbjknl,
        },
    },
    data() {
        return {
            count: 1,
        };
    },
    mounted() {},
});
</script>
