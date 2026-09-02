<template>
    <!--
        The search app is full-bleed: it mounts its own TopNav and Footer as overlays on
        top of the map, so this layout deliberately adds no chrome of its own.
    -->
    <div
        data-testid="search-app"
        class="h-svh w-full font-sans text-primary-text bg-primary-bg"
    >
        <slot />
    </div>
</template>
