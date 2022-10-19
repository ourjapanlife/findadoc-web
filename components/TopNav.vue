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
