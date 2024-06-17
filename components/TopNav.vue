<template>
    <div
        class="p-4 pl-5 border border-secondary-bg/20 flex justify-between items-center bg-gradient-to-t
          from-secondary-bg/30 via-primary-bg to-primary-bg"
    >
        <div
            id="mobile-site-icon"
            class="landscape:hidden font-semibold text-xl group transition-colors flex justify-between items-start"
        >
            <SVGSiteLogo
                role="img"
                title="site icon"
                class="mt-1 mr-1 w-10 h-10 flex-shrink-0 align-middle fill-primary group-hover:fill-primary-hover"
            />
            <div
                class="title-text flex flex-col flex-shrink-0"
                data-testid="portrait-logo"
            >
                <div class="text-lg text-primary group-hover:text-primary-hover">
                    Find a Doc,
                </div>
                <div class="text-sm text-primary leading-none group-hover:text-primary-hover">
                    Japan
                </div>
            </div>
        </div>
        <div
            id="desktop-site-icon"
            class="portrait:hidden font-semibold text-xl group transition-colors items-start"
        >
            <NuxtLink
                class="flex"
                to="/"
            >
                <SVGSiteLogo
                    role="img"
                    title="site icon"
                    class="mr-1 w-10 h-10 flex-shrink-0 align-middle fill-primary group-hover:fill-primary-hover"
                />
                <div
                    class="title-text flex flex-col flex-shrink-0"
                    data-testid="landscape-logo"
                >
                    <div class="text-lg text-primary group-hover:text-primary-hover">
                        Find a Doc
                    </div>
                    <div class="text-sm text-primary leading-none group-hover:text-primary-hover">
                        Japan
                    </div>
                </div>
            </NuxtLink>
        </div>
        <div
            data-testid="landscape-searchbar"
            class="portrait:hidden flex align-middle mr-32"
        >
            <SearchBar />
        </div>
        <div
            id="right-section"
            class="flex"
        >
            <nav
                id="desktop-menu-items"
                class="portrait:hidden flex gap-4 mx-6 self-center"
            >
                <NuxtLink
                    :to="'/about'"
                    class="hover:text-primary-hover transition-colors"
                >{{ $t('topNav.about') }}
                </NuxtLink>
                <NuxtLink
                    :to="'/'"
                    class="hover:text-primary-hover transition-colors"
                >{{ $t('topNav.home') }}
                </NuxtLink>
                <NuxtLink
                    :to="'/submit'"
                    class="hover:text-primary-hover transition-colors"
                >{{ $t('topNav.submit') }}
                </NuxtLink>
            </nav>
            <LocaleSelector class="portrait:hidden" />
            <HamburgerMenu class="landscape:hidden justify-end" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import SVGSiteLogo from '~/assets/icons/site-logo.svg'
</script>
