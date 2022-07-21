<template>
    <div class="p-4 border-b flex justify-between">
        <div class="font-semibold text-xl text-gray-800">Find a Doc</div>
        <div>
            <NuxtLink to="/">Home</NuxtLink>
            <NuxtLink to="/about">About</NuxtLink>
            <NuxtLink to="/news">News</NuxtLink>
            <a href="https://ko-fi.com/Z8Z14YNUR" target="_blank">
                <img height="36" style="border: 0px; height: 36px" src="https://cdn.ko-fi.com/cdn/kofi1.png?v=3"
                    alt="Buy Me a Coffee at ko-fi.com" />
            </a>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        msg: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            name: '',
        }
    }
})
</script>
