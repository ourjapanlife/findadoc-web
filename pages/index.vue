
import MainContentContainer from '~/components/MainContentContainer.vue';

<template>
    <div class="content-container flex overflow-hidden">
        <LeftNavbar class="left-container sm:order-2 flex-0 bg-primary-bg w-[358px]" />
        <div class="main-content-container sm:-order-1 flex-1">
            <div class="flex flex-col md:flex-row h-full">
                <MainContentContainer />
            </div>
        </div>
    </div>
</template>

<style>
@media screen and (max-width: 640px) {
  .content-container {
    flex-direction: column;
  }

  .left-container {
    width: 100%;

  }
}
</style>
