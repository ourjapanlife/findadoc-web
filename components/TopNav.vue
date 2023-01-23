<template>
    <div class="p-4 pl-8 border border-secondary-bg/20 flex justify-between items-center bg-gradient-to-t from-secondary-bg/30 via-primary-bg to-primary-bg">
        <HamburgerComponent />
        <div class="font-semibold text-xl group transition-colors">
            <NuxtLink class="flex" to="/">
                <svg role="img" title="site icon" class="mr-1 w-10 h-10 align-middle fill-primary group-hover:fill-primary-hover">
                    <use xlink:href="../assets/images/site-logo.svg#site-logo-svg" />
                </svg>
                <div class="title-text flex flex-col">
                    <div class="text-xs text-primary group-hover:text-primary-hover">
                        Find a
                    </div>
                    <div class="text-xl text-primary leading-none group-hover:text-primary-hover">
                        Doc Japan
                    </div>
                </div>
            </NuxtLink>
        </div>
        <div id="searchbar" class="align-middle">
            <SearchBar />
            <div class="cursor-pointer md:hidden">
                <img src="../assets/images/hamburgerMenu.svg" alt="hamburger menu" />
            </div>
        </div>
        <nav class="flex gap-4 mx-6 absolute right-20">
            <NuxtLink to="/about" class="px-2 mx-auto hover:text-primary-hover transition-colors">
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
            required: false,
            default: ''
        }
    },
    data() {
        return {
            name: '',
            showMenu: false
        }
    },
    methods: {
        toggleMenu() {
            this.showMenu = !this.showMenu
        }
    }
})
</script>
