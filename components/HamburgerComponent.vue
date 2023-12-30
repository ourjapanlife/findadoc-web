<template>
    <div class="cursor-pointer w-full">
        <div class="flex justify-between w-full">
            <div>
                <img
                    @click="menuStore.toggleMenu()"
                    src="../assets/images/hamburger-menu.svg"
                    alt="hamburger menu"
                />
                <div
                    v-show="menuStore.menuOpen"
                    class="z-20 absolute top-[50px] w-[200px] p-8 rounded bg-white border-2"
                >
                    <div
                        v-for="(item, index) in menuStore.menuItems"
                        :key="index"
                    >
                        <NuxtLink :to="item.route">
                            <span
                                @click="menuStore.toggleMenu()"
                                class="block hover:-translate-y-1 hover:scale-110 duration-300"
                                >{{ $t(item.displayText) }}</span
                            >
                        </NuxtLink>
                    </div>
                </div>
            </div>
            <div>
                <span class="text-black text-md font-bold font-['Noto Sans JP']"
                    >Find a Doc, Japan</span
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useMenuStore } from "~/stores/menuStore";

const menuStore = useMenuStore();
</script>
