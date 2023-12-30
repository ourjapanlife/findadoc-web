<template>
    <div
        class="p-4 pl-8 border border-secondary-bg/20 flex justify-between items-center bg-gradient-to-t from-secondary-bg/30 via-primary-bg to-primary-bg"
    >
        <div v-if="$viewport.isGreaterThan('tablet')" class="flex items-center">
            <div
                class="font-semibold text-xl group transition-colors items-start"
            >
                <NuxtLink class="flex" to="/">
                    <svg
                        role="img"
                        title="site icon"
                        class="mr-1 w-10 h-10 flex-shrink-0 align-middle fill-primary group-hover:fill-primary-hover"
                    >
                        <use
                            xlink:href="../assets/images/site-logo.svg#site-logo-svg"
                        />
                    </svg>
                    <div
                        class="title-text flex flex-col flex-shrink-0"
                        data-testid="logo"
                    >
                        <div
                            class="text-lg text-primary group-hover:text-primary-hover"
                        >
                            Find a Doc
                        </div>
                        <div
                            class="text-sm text-primary leading-none group-hover:text-primary-hover"
                        >
                            Japan
                        </div>
                    </div>
                </NuxtLink>
            </div>
            <div id="searchbar" class="align-middle mr-32">
                <SearchBar />
            </div>
            <nav
                class="flex gap-4 mx-6"
                v-for="(item, index) in menuStore.menuItems"
                :key="index"
            >
                <NuxtLink
                    :to="item.route"
                    class="hover:text-primary-hover transition-colors"
                    >{{ $t(item.displayText) }}</NuxtLink
                >
            </nav>
            <LocaleSelector />
        </div>
        <HamburgerComponent v-else />
    </div>
</template>

<script lang="ts" setup>
import { useSubmissionStore } from "~/stores/submissionStore";
import { useMenuStore } from "~/stores/menuStore";
import { useNuxtApp } from "#app";
import { watch } from "vue";
const { $viewport } = useNuxtApp();

watch($viewport.breakpoint, (newBreakpoint, oldBreakpoint) => {
    console.log("Breakpoint updated:", oldBreakpoint, "->", newBreakpoint);
});

const submissionStore = useSubmissionStore();
const menuStore = useMenuStore();
</script>
