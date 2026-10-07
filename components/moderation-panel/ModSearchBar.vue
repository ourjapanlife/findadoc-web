<template>
    <div
        class="relative flex w-full gap-1"
        :class="[
            isNearPageBottom ? 'flex-col-reverse' : 'flex-col',
        ]"
    >
        <div
            class="flex h-12 w-full items-center gap-2 rounded-lg border border-border-strong bg-secondary-bg px-3
                focus-within:border-primary"
        >
            <input
                ref="searchInputElement"
                type="text"
                :placeholder="placeHolderText"
                :data-testid="`${dataTestId}`"
                class="min-w-0 grow bg-transparent text-primary-text placeholder-primary-text-muted
                    focus-visible:outline-none"
                @blur="handleSearchInputBlur"
                @keydown.esc="handleSearchInputBlur"
                @keydown.down="handleSearchInputArrowDown"
                @keydown.up="handleSearchInputArrowUp"
                @keydown.enter="handleSearchInputEnter"
                @input="handleSearchInputChange"
                @focus="handleSearchInputFocus"
            >
            <span
                v-if="isInputFocused && searchResultCount > 0"
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
        <div class="relative w-full">
            <ul
                v-if="isInputFocused"
                id="search-list"
                class="absolute z-20 flex max-h-64 w-full flex-col divide-y divide-accent-bg
                    overflow-y-auto overflow-x-hidden rounded-lg border border-accent-bg
                    bg-primary-bg shadow-raised"
                :class="[
                    isNearPageBottom ? '-translate-y-full' : '',
                ]"
            >
                <li
                    v-for="(item, index) in filteredItems"
                    :id="`search-list-item-${index}`"
                    :key="item.id"
                    class="flex cursor-pointer justify-between"
                    :class="[
                        selectedItems.includes(item) ? 'bg-primary/10' : '',
                        selectedItemIndex === index ? 'bg-accent-bg' : '',
                    ]"
                    data-testid="mod-search-bar-search-result"
                    role="button"
                    tabindex="0"
                    @click="handleListItemClick"
                    @mousedown="handleListItemMouseDown"
                    @mouseover="() => { handleListItemMouseOver(index) }"
                    @focus="() => { handleListItemMouseOver(index) }"
                    @keydown.enter="handleListItem"
                    @keydown.space.prevent="handleListItem"
                >
                    <div class="flex min-w-0 items-center gap-3 px-3 py-2">
                        <div class="flex min-w-0 flex-col">
                            <span class="truncate font-medium text-primary-text">
                                {{ fieldsToDisplayCallback(item as ArrayType<T>).join(' · ') }}
                            </span>
                            <span
                                v-if="showResultId(item)"
                                class="truncate text-xs text-primary-text-muted"
                            >
                                {{ item.id }}
                            </span>
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
    defaultSuggestions: ArrayType<T>[]

    //Optional test id for testing the component
    dataTestId?: string
}

const { placeHolderText, noMatchText, fieldsToDisplayCallback, defaultSuggestions } = defineProps<Props>()

const showResultId = (item: { id?: unknown }) => {
    const id = item.id == null ? '' : String(item.id)
    if (!id) return false
    return !fieldsToDisplayCallback(item as ArrayType<T>).some(field => String(field) === id)
}

const searchInputElement = ref<HTMLInputElement>()
const searchInputValue = ref('')
const filteredItems = ref<ArrayType<T>[]>([])
const selectedItemIndex = ref(0)
const searchResultCount = ref(0)
const isInputFocused = ref(false)

const handleListScroll = () => {
    if (!import.meta.client) return
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

const handleSearchInputBlur = () => {
    isInputFocused.value = false

    if (searchInputElement.value) {
        searchInputElement.value.value = ''
    }

    searchInputValue.value = ''
    filteredItems.value = defaultSuggestions
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
        filteredItems.value = defaultSuggestions
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

const handleSearchInputFocus = (event: Event) => {
    isInputFocused.value = true
    handleSearchInputChange(event)
}

// Displays the dropdown above the searchInputElement if its position is greater than window.innerHeight / 1.5
const isNearPageBottom = computed(() => {
    if (!import.meta.client || !searchInputElement.value) return
    return searchInputElement.value.getBoundingClientRect().bottom >= window.innerHeight / 1.5
})

watch(() => filteredItems.value, value => {
    searchResultCount.value = value.length
})
</script>
