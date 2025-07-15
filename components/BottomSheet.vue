<!-- From https://github.com/vaban-ru/vue-bottom-sheet?tab=readme-ov-file,
 but copied due to it no longer being maintained -->
<!-- It's been customized to allow for a z-index changes -->
<template>
    <Teleport to="body">
        <div ref="bottomSheet" class="fixed inset-0 flex flex-col items-center justify-end transition-[visibility] mx-1"
            :style="{
                zIndex: zIndex,
                visibility: showSheet ? 'visible' : 'hidden',
                pointerEvents: showSheet ? 'auto' : 'none'
            }" :aria-hidden="!showSheet" role="dialog">
            <transition>
                <div v-show="overlay && showSheet" class="absolute inset-0 -z-10"
                    :style="{ background: props.overlayColor }" @click="clickOnOverlayHandler" />
            </transition>
            <div ref="bottomSheetContent"
                :class="'flex flex-col rounded-t-2xl bg-white overflow-y-hidden w-full box-border pointer-events-auto'"
                :style="{
                    transform: `translate3d(0, ${translateValueString}, 0)`,
                    height: sheetHeight,
                    maxWidth: maxWidthString,
                    transition: !isDragging ? `${transitionDurationString} ease` : undefined,
                }">
                <header ref="bottomSheetHeader" class="bottom-sheet__header">
                    <div ref="bottomSheetDraggableArea" class="w-full mx-auto p-4 cursor-grab">
                        <div class="w-10 h-1 bg-neutral-800 rounded-lg mx-auto" />
                    </div>
                    <slot name="header" />
                </header>
                <main ref="bottomSheetMain" class="flex flex-col overflow-y-scroll box-border touch-auto">
                    <slot />
                </main>
                <footer v-if="$slots.footer" ref="bottomSheetFooter">
                    <slot name="footer" />
                </footer>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import Hammer from 'hammerjs'
import { useBottomSheetStore } from '@/stores/bottomSheetStore'

const bottomSheetStore = useBottomSheetStore()

/**
   * Bottom sheet props interface
   */
interface IProps {
    overlay?: boolean
    overlayColor?: string
    maxWidth?: number
    initialPosition?: number
    customPositions?: number[]
    transitionDuration?: number
    overlayClickClose?: boolean
    canSwipe?: boolean
    canSwipeClose?: boolean
    zIndex?: number
}

/**
   * Touch event interface
   */
interface IEvent {
    type: string
    deltaY: number
    isFinal: boolean
    cancelable: boolean
}

/**
   * Bottom sheet props interface
   * @param height String corresponding to screen height. Passed in as-is
   * @param customPositions Array of numbers between 0 and 100 corresponding to screen height percentage
   */
const props = withDefaults(defineProps<IProps>(), {
    overlay: true,
    overlayColor: '#0000004D',
    maxWidth: 640,
    initialPosition: 75,
    customPositions: [75],
    transitionDuration: 0.5,
    overlayClickClose: true,
    canSwipe: true,
    canSwipeClose: true,
    zIndex: 99999
})

/**
   * Bottom sheet emit interface
   */
const emit = defineEmits(['opened', 'closed', 'dragging-up', 'dragging-down'])

/**
   * Show or hide sheet
   */
const showSheet = ref(false)

/**
   * Dynamic translate value
   */
const translateValue = ref(100)

/**
   * Flag to check if sheet is being dragged
   */
const isDragging = ref(false)

/**
   * Content scrolled value
   */
const contentScroll = ref(0)

/**
   * Return sheet height
   */
const sheetHeight = ref('calc(100vh)')

const enabledPositions = computed(() => props.customPositions)

/**
   * Refs to all sheet HTML elements
   */
const bottomSheet = ref<HTMLElement | null>(null)
const bottomSheetContent = ref<HTMLElement | null>(null)
const bottomSheetDraggableArea = ref<HTMLElement | null>(null)

/**
   * Close bottom sheet when escape key is pressed
   * @param element
   */
const isFocused = (element: HTMLElement) => document.activeElement === element
window.addEventListener('keyup', (event: KeyboardEvent) => {
    const isSheetElementFocused
        = bottomSheet.value && bottomSheet.value.contains(event.target as HTMLElement)
        && isFocused(event.target as HTMLElement)

    if (event.key === 'Escape' && !isSheetElementFocused) {
        close()
    }
})

/**
   * Return transition duration value with seconds
   */
const transitionDurationString = computed(() => `${props.transitionDuration}s`)

/**
   * Return current translate value string with percents
   */
const translateValueString = computed(() => `${translateValue.value}%`)

/**
   * Return max width string
   */
const maxWidthString = computed(() => `${props.maxWidth}px`)

// Functions

function initHeight() {
    if (props.initialPosition) {
        const invertedPosition = 100 - props.initialPosition
        translateValue.value = invertedPosition
    }
}

/**
   * Move sheet while dragging
   * @param event
   * @param type
   */

const dragHandler = (event: HammerInput | IEvent, type: 'area' | 'main') => {
    if (props.canSwipe) {
        isDragging.value = true

        const preventDefault = (e: Event) => {
            e.preventDefault()
        }

        if (event.deltaY > 0) {
            if (type === 'main' && event.type === 'panup') {
                translateValue.value = event.deltaY
                if ('cancelable' in event && event.cancelable) {
                    bottomSheetContent.value!.addEventListener('touchmove', preventDefault)
                }
            }

            if (type === 'main' && event.type === 'pandown' && contentScroll.value === 0) {
                // HammerInput has deltaY, DOM events may not
                if ('deltaY' in event) {
                    translateValue.value = event.deltaY
                }
            }

            if (type === 'area') {
                if ('deltaY' in event) {
                    translateValue.value = event.deltaY
                }
            }

            if ('type' in event && event.type === 'panup') {
                emit('dragging-up')
            }
            if ('type' in event && event.type === 'pandown') {
                emit('dragging-down')
            }
        }

        // Triggers when the user "lets go" of the sheet
        if ('isFinal' in event && event.isFinal) {
            bottomSheetContent.value!.removeEventListener('touchmove', preventDefault)

            if (type === 'main') {
                contentScroll.value = bottomSheetContent.value!.scrollTop
            }
            isDragging.value = false

            // Move the sheet to the nearest enabledPosition
            if (enabledPositions && enabledPositions.value && enabledPositions.value.length > 0) {
                // Sort enabledPositions descending and invert the values. (translateValue is a negative value)
                const invertedScreenPositions = enabledPositions.value.map((pos) => 100 - pos)
                // The lowest enabledPosition nearest the bottom of the screen
                const minPosition = invertedScreenPositions[invertedScreenPositions.length - 1]

                // Find the nearest enabledPosition (closest value)
                const nearest = invertedScreenPositions.reduce((prev, curr) =>
                    Math.abs(curr - translateValue.value) < Math.abs(prev - translateValue.value) ? curr : prev
                    , invertedScreenPositions[0])

                // If translateValue is beyond the last enabledPosition, close()
                if (translateValue.value > minPosition && props.canSwipeClose) {
                    close()
                } else {
                    // Otherwise, move the sheet to the nearest enabledPosition
                    translateValue.value = nearest
                }

                return
            }

            // If the sheet is dragged down, close it
            if (translateValue.value >= 10 && props.canSwipeClose) {
                close()
            }
            // Otherwise, reset the sheet position to original height
            else {
                translateValue.value = 0
            }
        }
    }
}

nextTick(() => {
    initHeight()

    /**
     * Create instances of Hammerjs
     */
    if (bottomSheetDraggableArea.value) {
        const hammerAreaInstance = new Hammer(bottomSheetDraggableArea.value, {
            inputClass: Hammer.TouchMouseInput,
            recognizers: [[Hammer.Pan, { direction: Hammer.DIRECTION_VERTICAL }]]
        })
        hammerAreaInstance.on('panstart panup pandown panend', (e: HammerInput) => {
            dragHandler(e, 'area')
        })
    }

    if (bottomSheetContent.value) {
        const hammerMainInstance = new Hammer(bottomSheetContent.value, {
            inputClass: Hammer.TouchMouseInput,
            recognizers: [[Hammer.Pan, { direction: Hammer.DIRECTION_VERTICAL }]]
        })
        hammerMainInstance.on('panstart panup pandown panend', (e: HammerInput) => {
            dragHandler(e, 'main')
        })
    }
})

/**
   * Open bottom sheet method
   */
const open = () => {
    translateValue.value = 0
    document.documentElement.style.overflowY = 'hidden'
    document.documentElement.style.overscrollBehavior = 'none'
    showSheet.value = true
    emit('opened')
}

/**
   * Close bottom sheet method
   */
const close = async () => {
    bottomSheetStore.isOpen = false
    showSheet.value = false
    translateValue.value = 100
    setTimeout(() => {
        document.documentElement.style.overflowY = 'auto'
        document.documentElement.style.overscrollBehavior = ''
        emit('closed')
    }, props.transitionDuration * 1000)
}

/**
   * Click on overlay handler
   */
const clickOnOverlayHandler = () => {
    if (props.overlayClickClose) {
        close()
    }
}

/**
   * Define public methods
   */
defineExpose({ open, close })
</script>
