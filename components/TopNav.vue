<template>
    <div class="p-4 border-b flex justify-between">
        <div class="font-semibold text-xl text-gray-800">
            <NuxtLink class="align-middle" to="/">
                <img class="inline align-middle pr-2"
                    src="../assets/images/logo-32-px-color.svg" />Find a Doc
            </NuxtLink>
        </div>
        <div>
            <NuxtLink to="/aboutPage">
                About
            </NuxtLink>
            <a href="https://ko-fi.com/Z8Z14YNUR" target="_blank">
                <img height="36" style="border: 0px; height: 36px" src="https://cdn.ko-fi.com/cdn/kofi1.png?v=3"
                    alt="Buy Me a Coffee at ko-fi.com" />
            </a>
            <div class="cursor-pointer md:hidden">
                <img src="../assets/images/hamburgerMenu.svg" alt="hamburger menu" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
   
    props: {
        msg: {
            type: String,
            required: false
        }
    },
    data() {
        return {
            name: '',
        }
    }
})
</script>
