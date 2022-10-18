<template>
    <div class="p-4 pl-8 border-b-2 border-secondary-bg/40 flex justify-between items-center">
        <HamburgerComponent />
        <div class="font-semibold text-xl">
            <NuxtLink class="flex" to="/">
                <svg role="img" title="site icon" class="mr-1 w-10 h-10 align-middle fill-primary">
                    <use xlink:href="../assets/images/site-logo.svg#site-logo-svg" />
                </svg>
                <div class="title-text flex flex-col">
                    <div class="text-xs text-primary">
                        Find a
                    </div>
                    <div class="text-xl text-primary leading-none">
                        Doc Japan
                    </div>
                </div>
            </NuxtLink>
        </div>
        <div id="searchbar" class="align-middle">
            <SearchBar />
            <div class="cursor-pointer md:hidden">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </div>
        </div>
        <nav class="flex gap-4 mx-6 absolute right-20">
            <NuxtLink to="/about" class="px-2 mx-auto">
                About
            </NuxtLink>
        </nav>
        <div></div>
        <LocaleSelector />
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
