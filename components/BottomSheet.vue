<!-- Inspired by https://github.com/vaban-ru/vue-bottom-sheet?tab=readme-ov-file,
 but rewritten due to it no longer being maintained -->
<!-- It's been customized to allow for multiple positions, simplified the code, and added a few features -->
<template>
    <Teleport to="body">
        <div
            ref="bottomSheet"
            :class="[
                'transition-[visibility]',
                showSheet ? 'visible pointer-events-auto' : 'invisible pointer-events-none',
                `z-${zIndex}`,
                `aria-hidden:${showSheet ? 'true' : 'false'}`,
            ]"
            role="dialog"
        >
            <transition>
                <div
                    v-show="overlay && showSheet"
                    class="absolute inset-0 z-10 bg-primary-bg/20"
                    @click="clickOnOverlayHandler"
                />
            </transition>
            <div
                ref="bottomSheetContent"
                class="fixed inset-0 flex flex-col mx-1 rounded-t-2xl bg-primary-bg overflow-x-hidden
                    box-border pointer-events-auto"
                :style="{
                    transform: `translate3d(0, ${translateValue}%, 0)`,
                    height: sheetHeight,
                    transition: !isDragging ? `${props.transitionDuration}s ease` : undefined,
                }"
            >
                <header
                    ref="bottomSheetDraggableArea"
                    class="w-full mx-auto p-6 cursor-grab touch-none select-none"
                >
                    <div class="w-10 h-1 bg-accent/30 rounded-lg mx-auto" />
                </header>
                <main
                    ref="bottomSheetMain"
                    class="flex flex-col grow overflow-y-auto box-border touch-pan-y"
                    @scroll="handleMainScroll"
                >
                    <slot />
                </main>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Hammer from 'hammerjs'
import { useBottomSheetStore } from '@/stores/bottomSheetStore'

const bottomSheetStore = useBottomSheetStore()

/**
   * Bottom sheet props interface
   */
interface IProps {
    overlay?: boolean
    overlayColor?: string
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
    isFirst: boolean
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
    initialPosition: 25,
    customPositions: () => [],
    transitionDuration: 0.5,
    overlayClickClose: true,
    canSwipe: true,
    canSwipeClose: true,
    zIndex: 99999
})

/**
   * Bottom sheet emit interface
   */
const emit = defineEmits(['opened', 'closed', 'dragging-up', 'dragging-down', 'dragging-content', 'scrolled'])

/**
   * Show or hide sheet
   */
const showSheet = ref(false)

/**
   * Dynamic translate value
   * Start at the provided initialPosition so the sheet opens at that height
   */
const translateValue = ref(props.initialPosition)

/**
   * Flag to check if sheet is being dragged
   */
const isDragging = ref(false)

/**
   * Return sheet height
   */
const sheetHeight = ref('calc(100vh)')

const originalTranslateValueBeforeDrag = ref(0)

const enabledPositions = computed(() => props.customPositions && props.customPositions.length
    ? props.customPositions
    : [50])

/**
   * Refs to all sheet HTML elements
   */
const bottomSheet = ref<HTMLElement | null>(null)
const bottomSheetContent = ref<HTMLElement | null>(null)
const bottomSheetMain = ref<HTMLElement | null>(null)
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

// Functions

function initHeight() {
    if (props.initialPosition) {
        translateValue.value = props.initialPosition
    }
}

/**
   * Move sheet while dragging
   * @param event
   * @param type
   */

const dragHandler = (event: HammerInput | IEvent, type: 'draghandle' | 'dragcontent') => {
    if (!props.canSwipe) {
        return
    }

    if (type === 'dragcontent') {
        // If the user is dragging the content, emit an event so the parent can handle it
        // We don't handle content dragging or scrolling here because it can have nested scrollable content
        emit('dragging-content')
        return
    }

    if ('type' in event && event.type === 'panup') {
        emit('dragging-up')
    }
    if ('type' in event && event.type === 'pandown') {
        emit('dragging-down')
    }

    if ('type' in event && event.type === 'panstart') {
        //we want the transition to start from the current position, not the top of the sheet
        originalTranslateValueBeforeDrag.value = translateValue.value
    }

    isDragging.value = true
    const deltaYChange = event.deltaY

    // Not sure why the deltaYChange moves the sheet so intensely, so we divide it by 8 to make it more manageable
    const newDeltaY = originalTranslateValueBeforeDrag.value + (deltaYChange / 8)
    // We don't want the sheet to move outside of the screen
    const isInScreenBounds = newDeltaY < 100 && newDeltaY > 0

    if (isInScreenBounds) {
        // If the content area is dragged up, move the sheet up
        translateValue.value = newDeltaY
    }

    // Triggers when the user "lets go" of the sheet
    if ('isFinal' in event && event.isFinal) {
        const preventDefault = (e: Event) => {
            e.preventDefault()
        }
        bottomSheetMain.value!.removeEventListener('touchmove', preventDefault)

        isDragging.value = false

        // The lowest enabledPosition nearest the bottom of the screen (100)
        const lowestPosition = enabledPositions.value.sort((a, b) => a - b)[0]

        // Find the nearest enabledPosition (closest value)
        const nearest = enabledPositions.value.reduce((prev, curr) =>
            Math.abs(curr - translateValue.value) < Math.abs(prev - translateValue.value) ? curr : prev)

        // If translateValue is beyond the last enabledPosition, close()
        if (translateValue.value > lowestPosition && props.canSwipeClose) {
            close()
        } else {
            // Otherwise, move the sheet to the nearest enabledPosition
            translateValue.value = nearest
        }
    }
}

/**
   * Open bottom sheet method
   */
const open = () => {
    // Honor the initialPosition (already set by initHeight) when opening
    // Do not force to 0, or the sheet will cover the whole screen
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
   * Set current position method
   * @param position - Position percentage (0-100)
   */
const setPosition = (position: number) => {
    if (position >= 0 && position <= 100) {
        translateValue.value = position
    }
}

let hammerMainInstance: HammerManager | null = null

onMounted(() => {
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
            dragHandler(e, 'draghandle')
        })
    }
    if (bottomSheetMain.value) {
        hammerMainInstance = new Hammer(bottomSheetMain.value, {
            inputClass: Hammer.TouchMouseInput,
            touchAction: 'pan-y'
        })
        hammerMainInstance.add(
            new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL })
        )
        hammerMainInstance.on('panstart panup pandown panend', (e: HammerInput) => {
            if (translateValue.value > 25) {
                dragHandler(e, 'dragcontent')
            }
        })
    }
})

watch(translateValue, value => {
    const pan = hammerMainInstance?.get('pan')
    if (value <= 25) {
        // Fully expanded -> enable scroll
        pan?.set({ enable: false })
    } else {
        pan?.set({ enable: true })
    }
})

const handleMainScroll = () => {
    if (translateValue.value > 25) {
        emit('scrolled')
    }
}
/**
   * Define public methods
   */
defineExpose({ open, close, setPosition })
</script>
