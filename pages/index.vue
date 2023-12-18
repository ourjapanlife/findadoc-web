<template>
    <div class="content-container flex overflow-hidden sm:flex-col">
        <div class="main-content-container flex-1 sm:flex-col">
            <BetaBanner />
            <div class="flex overflow-hidden sm:w-full">
                <LeftNavbar class="flex-0 bg-primary-bg w-[358px] sm:w-full" />
                <div class="flex-1 sm:order-1">
                    <div class="flex flex-col md:flex-row h-full sm:flex-col">
                        <MainContentContainer />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<!--
<style>
@media screen and (max-width: 640px) {
    .content-container {
        flex-direction: column;
    }

    .left-container {
        width: 100%;

    }
}
</style> -->
