<template>
    <div class="p-4 border-b flex justify-between items-center">
        <HamburgerComponent />
        <div class="font-semibold text-xl text-gray-800">
            <NuxtLink class="align-middle" to="/">
                <img class="inline align-middle pr-2"
                    src="../assets/images/logo-32-px-color.svg" />
                <span>Find a Doc</span>
            </NuxtLink>
        </div>
        <div id="searchbar" class="align-middle">
            <SearchBar />
        </div>
        <nav class="flex gap-4 mx-6 absolute right-20">
            <NuxtLink to="/about" class="px-2 mx-auto">
                About
            </NuxtLink>
        </nav>
        <div></div>
        <LocaleSelector />
    </div>
</template>
