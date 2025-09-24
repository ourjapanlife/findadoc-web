<template>
    <div
        class="h-full min-h-0 flex flex-col border-r overflow-hidden"
        :class="[
            'border-secondary-bg/40',
            'hover:shadow-inner',
            'hover:shadow-secondary-bg/50',
            'transition-shadow',
        ]"
    >
        <div class="flex-1 min-h-0">
            <SearchResultsList />
        </div>
    </div>
</template>
