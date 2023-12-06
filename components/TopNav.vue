<template>
    <div class="p-4 border border-secondary-bg/20 flex justify-around items-center
        bg-gradient-to-t from-secondary-bg/30 via-primary-bg to-primary-bg">
        <HamburgerComponent />
        <div class="font-semibold text-xl group transition-colors items-start">
            <NuxtLink class="flex" to="/">
                <svg role="img" title="site icon"
                    class="mr-1 w-10 h-10 align-middle fill-primary group-hover:fill-primary-hover">
                    <use xlink:href="../assets/images/site-logo.svg#site-logo-svg" />
                </svg>
                <div class="title-text flex flex-col" data-testid="logo">
                    <div class="text-lg text-primary group-hover:text-primary-hover">
                        Find a Doc
                    </div>
                    <div class="text-sm text-primary leading-none group-hover:text-primary-hover">
                        Japan
                    </div>
                </div>
            </NuxtLink>
        </div>
        <div id="searchbar" class="align-middle mr-32">
            <SearchBar />
        </div>
        <nav class="flex gap-4 ml-6 absolute right-10">
            <NuxtLink to="/about" class="hover:text-primary-hover transition-colors">
                {{ $t('topNav.about')}}
            </NuxtLink>
            <NuxtLink to="/submit" class="hover:text-primary-hover transition-colors">
                {{ $t('topNav.submit')}}
            </NuxtLink>
            <LocaleSelector />
        </nav>
        <div></div>
    </div>
</template>
