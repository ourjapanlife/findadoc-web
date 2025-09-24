<template>
    <div
        class="h-full flex flex-col border-r overflow-hidden"
        :class="[
            'border-secondary-bg/40',
            'hover:shadow-inner',
            'hover:shadow-secondary-bg/50',
            'transition-shadow',
        ]"
    >
        <div class="flex-1 overflow-y-auto">
            <SearchResultsList />
        </div>
    </div>
</template>
