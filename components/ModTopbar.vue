<template>
    <!-- styling will change from px to rm -->
    <div class="h-[76px] w-full">
        <div class="flex px-6 py-3 justify-between w-full" v-if="store.activeScreen === ModerationScreen.dashboard">
            <h1 class="text-lg font-bold flex items-center">For Review</h1>
            <div class="relative">
                <input type="text" class="rounded-lg border border-[#AEB0B5] px-3 py-4 placeholder:text-black placeholder:text-sm placeholder:font-normal w-96 items-center" placeholder="Search" />
                <MagnifyingGlass class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6" />
            </div>
        </div>
        <div class="h-[76px] w-full" v-else-if="store.activeScreen === ModerationScreen.editSubmission">
            <ModEditSubmissionTopbar data-test-id="mod-edit-submission-topbar" submissionId="" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useModerationScreenStore, ModerationScreen } from '~/stores/moderationScreenStore'
import ModEditSubmissionTopbar from './ModEditSubmissionTopbar.vue';
import MagnifyingGlass from '../assets/icons/magnifying-glass.svg';


const store = useModerationScreenStore()
</script>
