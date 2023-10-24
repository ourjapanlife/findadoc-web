
import MainContentContainer from '~/components/MainContentContainer.vue';

<template>
    <div class="flex overflow-hidden">
        <LeftNavbar class="flex-0 bg-primary-bg w-[358px]" />
        <div class="flex-1">
            <div class="flex flex-col md:flex-row h-full">
                <MainContentContainer />
            </div>
        </div>
    </div>
</template>
