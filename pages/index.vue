<template>
    <div class="content-container flex overflow-hidden sm:flex-col">
        <div class="main-content-container flex-1 sm:flex sm:flex-col">
            <BetaBanner />
            <div class="flex overflow-hidden sm:w-full">
                <LeftNavbar class="flex-0 bg-primary-bg w-[358px] sm:w-full sm:order-2" />
                <div class="flex-1 sm:-order-1">
                    <div class="flex flex-col sm:w-full md:flex-row h-full">
                        <MainContentContainer />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
