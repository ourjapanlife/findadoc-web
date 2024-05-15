<template>
    <div
        class="p-4 pl-5 border border-secondary-bg/20 flex justify-between items-center bg-gradient-to-t from-secondary-bg/30 via-primary-bg to-primary-bg">
        <div class="flex items-center">
            <HamburgerMenu class="landscape:hidden" />
            <div id="mobile-site-icon"
                class="landscape:hidden font-semibold text-xl group transition-colors flex justify-between items-start">
                <svg role="img" title="site icon"
                    class="mr-1 w-10 h-10 flex-shrink-0 align-middle fill-primary group-hover:fill-primary-hover">
                    <use xlink:href="../assets/images/site-logo.svg#site-logo-svg" />
                </svg>
                <div class="title-text flex flex-col flex-shrink-0" data-testid="logo">
                    <div class="text-lg text-primary group-hover:text-primary-hover">
                        Find a Doc,
                    </div>
                    <div class="text-sm text-primary leading-none group-hover:text-primary-hover">
                        Japan
                    </div>
                </div>
            </div>
            <div id="desktop-site-icon"
                class="portrait:hidden font-semibold text-xl group transition-colors items-start">
                <NuxtLink class="flex" to="/">
                    <svg role="img" title="site icon"
                        class="mr-1 w-10 h-10 flex-shrink-0 align-middle fill-primary group-hover:fill-primary-hover">
                        <use xlink:href="../assets/images/site-logo.svg#site-logo-svg" />
                    </svg>
                    <div class="title-text flex flex-col flex-shrink-0" data-testid="logo">
                        <div class="text-lg text-primary group-hover:text-primary-hover">
                            Find a Doc
                        </div>
                        <div class="text-sm text-primary leading-none group-hover:text-primary-hover">
                            Japan
                        </div>
                    </div>
                </NuxtLink>
            </div>
            <div id="desktop-searchbar" class="portrait:hidden align-middle mr-32">
                <SearchBar />
            </div>
            <nav id="desktop-menu-items" class="portrait:hidden flex gap-4 mx-6"
                v-for="(item, index) in menuStore.menuItems" :key="index">
                <NuxtLink :to="item.route" class="hover:text-primary-hover transition-colors">{{ $t(item.displayText) }}
                </NuxtLink>
            </nav>
            <LocaleSelector class="portrait:hidden" />
            <div id="mobile-search-button" class="landscape:hidden absolute right-5">
                <button id="mobileSearchButton">
                    <svg role="img" alt="search icon" title="search icon"
                        class="search-icon w-8 h-8 mr-1 fill-primary-text-inverted">
                        <use xlink:href="../assets/images/search-icon.svg#search-icon-svg" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useSubmissionStore } from "~/stores/submissionStore";
import { useMenuStore } from "~/stores/menuStore";
import { useNuxtApp } from "#app";
import HamburgerMenu from "./HamburgerMenu.vue";

const { $viewport } = useNuxtApp()

const menuStore = useMenuStore()
</script>
