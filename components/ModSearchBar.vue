<template>
    <div
        class="container flex gap-1 w-fit"
        :class="[
            isNearPageBottom ? 'flex-col-reverse' : 'flex-col',
        ]"
    >
        <div
            class="flex items-center px-3 py-3.5 w-96 h-12 bg-secondary-bg
    rounded-lg border border-primary-text-muted text-primary-text
    text-sm font-normal font-sans placeholder-primary-text-muted
    outline outline-0 -outline-offset-2 gap-2 divide-x-2
    focus-within:outline-currentColor
    focus-within:outline-2
    "
        >
            <input
                ref="searchInputElement"
                type="text"
                :placeholder="placeHolderText"
                :data-testid="`${dataTestId}`"
                class="grow focus-visible:outline-none"
                @blur="handleSearchInputBlur"
                @keydown.esc="handleSearchInputBlur"
                @keydown.down="handleSearchInputArrowDown"
                @keydown.up="handleSearchInputArrowUp"
                @keydown.enter="handleSearchInputEnter"
                @input="handleSearchInputChange"
            >
            <span
                v-if="searchResultCount > 0"
                class="pl-2"
            >
                {{ searchResultCount }}
            </span>
            <button
                type="button"
                @click="searchInputElement?.focus()"
            >
                <SVGLookingGlass
                    role="img"
                    title="searching icon"
                    class="h-6 pl-2"
                />
            </button>
        </div>
        <div class="container relative">
            <ul
                v-if="searchInputValue.trim() !== ''"
                id="search-list"
                class="bg-primary-bg shadow-md border-2 border-primary/50 rounded-lg absolute
                w-full flex flex-col divide-y-2 max-h-64 overflow-y-auto overflow-x-hidden
                "
                :class="[
                    isNearPageBottom ? '-translate-y-full' : '',
                ]"
            >
                <li
                    v-for="(item, index) in filteredItems"
                    :id="`search-list-item-${index}`"
                    :key="item.id"
                    class="flex justify-between divide-x cursor-pointer"
                    :class="[
                        selectedItems.includes(item) ? 'bg-primary/90' : '',
                        selectedItemIndex === index ? 'bg-primary-hover text-primary-inverted' : 'opacity-95',
                    ]"
                    data-testid="mod-search-bar-search-result"
                    @click="handleListItemClick"
                    @mousedown="handleListItemMouseDown"
                    @mouseover="() => { handleListItemMouseOver(index) }"
                >
                    <div class="flex items-center m-3 gap-3 overflow-x-auto">
                        <span>{{ index + 1 }}</span>
                        <div class="flex flex-col overflow-x-auto whitespace-nowrap">
                            <span class="text-xs">{{ item.id }}</span>
                            <div class="divide-x-2 mt-1">
                                <!--
                                    Originally, the 'item' type is UnwrapRefSimple<ArrayType<T>>,
                                    but we don't have access to UnwrapRefSimple,
                                    so we need to directly set the type as ArrayType<T>.
                                -->
                                <span
                                    v-for="(field, fieldIndex) in fieldsToDisplayCallback(item as ArrayType<T>)"
                                    :key="fieldIndex"
                                    class="px-2 first-of-type:pl-0 last-of-type:pr-0"
                                >
                                    {{ field }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <SVGCheckMark
                            class="h-4 m-3"
                            :class="[
                                selectedItems.includes(item) ? 'opacity-100' : 'opacity-10',
                            ]"
                        />
                    </div>
                </li>
                <!-- Fallback for empty search results -->
                <li
                    v-if="!filteredItems.length"
                    data-testid="mod-search-bar-search-no-match"
                    class="m-3 cursor-default"
                >
                    <span>{{ noMatchText }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts" generic="T extends Array<any>">
/*
    Vue Generics: https://vuejs.org/api/sfc-script-setup.html#generics
    Defining generic types using props
*/
import { computed, ref, watch, type Ref } from 'vue'
import SVGCheckMark from '~/assets/icons/check-mark.svg'
import SVGLookingGlass from '~/assets/icons/looking-glass.svg'

// Obtain the array inner type
type ArrayType<V> = V extends Array<infer U> ? U : never

const emit = defineEmits<{
    searchInputBlur: []
    searchInputArrowDown: []
    searchInputArrowUp: []
    searchInputEnter: []
    searchInputChange: [filteredItems: Ref<ArrayType<T>[]>, inputValue: string]
}>()

// Using a type from the user. T is defined when selectedItems is passed down.
const selectedItems = defineModel<T>({ required: true })

type Props = {
    placeHolderText: string
    noMatchText: string
    // Callback to display the desired output
    fieldsToDisplayCallback: (item: ArrayType<T>) => string[]

    //Optional test id for testing the component
    dataTestId?: string
}

const { placeHolderText, noMatchText, fieldsToDisplayCallback } = defineProps<Props>()

const searchInputElement = ref<HTMLInputElement>()
const searchInputValue = ref('')
const filteredItems = ref<ArrayType<T>[]>([])
const selectedItemIndex = ref(0)
const searchResultCount = ref(0)

const handleListScroll = () => {
    const selectedElement = document.getElementById(`search-list-item-${selectedItemIndex.value}`)

    if (!selectedElement) return

    selectedElement.scrollIntoView({
        block: 'nearest',
        inline: 'nearest'
    })
}

const handleListItem = () => {
    if (filteredItems.value.length === 0) return

    const item = filteredItems.value[selectedItemIndex.value]

    if (selectedItems.value.includes(item)) {
        const itemIndex = selectedItems.value.indexOf(item)
        selectedItems.value.splice(itemIndex, 1)
        return
    }

    selectedItems.value.push(item)
}

const handleListItemClick = (event: MouseEvent) => {
    event.preventDefault()
    handleListItem()
}

const handleListItemMouseOver = (index: number) => {
    selectedItemIndex.value = index
}

const handleListItemMouseDown = (event: MouseEvent) => {
    // Prevent search input from being blurred
    event.preventDefault()
}

const handleSearchInputBlur = (event: Event) => {
    if (!searchInputElement.value) return
    searchInputElement.value.value = ''
    handleSearchInputChange(event)
    emit('searchInputBlur')
}

const handleSearchInputArrowUp = (event: KeyboardEvent) => {
    event.preventDefault()
    if (selectedItemIndex.value > 0) {
        --selectedItemIndex.value
        handleListScroll()
    }
    emit('searchInputArrowUp')
}

const handleSearchInputArrowDown = (event: KeyboardEvent) => {
    event.preventDefault()
    if (selectedItemIndex.value < filteredItems.value.length - 1) {
        ++selectedItemIndex.value
        handleListScroll()
    }
    emit('searchInputArrowDown')
}

const handleSearchInputEnter = (event: KeyboardEvent) => {
    event.preventDefault()
    handleListItem()
    emit('searchInputEnter')
}

const handleSearchInputChange = (event: Event) => {
    const eventTarget = event.target as HTMLInputElement

    searchInputValue.value = eventTarget.value

    const inputValue = eventTarget.value.toLowerCase()

    selectedItemIndex.value = 0

    if (inputValue.trim() === '') {
        filteredItems.value = []
        return
    }

    /*
        We need to unwrap the `filteredItems` type since the original type is:
        Ref<UnwrapRefSimple<ArrayType<T>>[], ArrayType<T>[] | UnwrapRefSimple<ArrayType<T>>[]>
        We can't use UnwrapRefSimple as it is an internal Vue type. So, we need to explicitly
        define this variable as Ref<ArrayType<T>[]>.
    */
    emit('searchInputChange', filteredItems as Ref<ArrayType<T>[]>, inputValue)
}

// Displays the dropdown above the searchInputElement if its position is greater than window.innerHeight / 1.5
const isNearPageBottom = computed(() => {
    if (!searchInputElement.value) return
    return searchInputElement.value.getBoundingClientRect().bottom >= window.innerHeight / 1.5
})

watch(() => filteredItems.value, value => {
    searchResultCount.value = value.length
})
</script>
