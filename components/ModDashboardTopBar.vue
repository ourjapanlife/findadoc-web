<template>
    <h1 class="text-lg font-bold flex items-center">{{ $t('modDashboardTopBar.forReview')}}</h1>
            <div class="relative">
                <form @submit.prevent="submitSearch">
                <input @input="event => searchInput = event.target.value"
                    type="text"
                    class="rounded-lg border  border-slate-400 px-3 py-4 placeholder:text-black placeholder:text-sm placeholder:font-normal w-96 items-center"
                    :placeholder="$t('searchBar.search')" />
                <MagnifyingGlass @click="submitSearch" class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6" />
                </form>
            </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import MagnifyingGlass from '../assets/icons/magnifying-glass.svg';
const searchInput: Ref<string> = ref("")

const submitSearch = () => {
    console.log(searchInput.value)
    //logic to trigger the search

}

</script>
