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
            showMenu: false
        }
    },
    methods:{
        toggleMenu(){
            this.showMenu = !this.showMenu
        }
    }
})
</script>
