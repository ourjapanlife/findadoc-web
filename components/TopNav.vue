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
        <div>
            <select v-model="selected" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" >
                <option disabled value="">Languages</option>
                <option>English</option>
                <option>Japanese</option>
            </select>
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
