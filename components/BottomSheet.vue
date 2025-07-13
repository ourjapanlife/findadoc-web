<!-- From https://github.com/vaban-ru/vue-bottom-sheet?tab=readme-ov-file,
 but copied due to it no longer being maintained -->
 <!-- It's been customized to allow for a z-index changes -->
<template>
    <Teleport to="body">
        <div
            ref="bottomSheet"
            class="fixed inset-0 flex flex-col items-center justify-end transition-[visibility]"
            :style="{ zIndex: zIndex, visibility: showSheet ? 'visible' : 'hidden', pointerEvents: showSheet ? 'auto' : 'none' }"
            :aria-hidden="!showSheet"
            role="dialog"
        >
            <transition>
                <div
                    v-show="overlay && showSheet"
                    class="absolute inset-0 -z-10"
                    :style="{ background: props.overlayColor }"
                    @click="clickOnOverlayHandler"
                />
            </transition>
            <div
                ref="bottomSheetContent"
                :class="
                    'flex flex-col rounded-t-2xl bg-white overflow-y-hidden w-full box-border pointer-events-auto'"
                :style="{
                    transform: `translate3d(0, ${translateValueString}, 0)`,
                    height: sheetHeightString,
                    maxWidth: maxWidthString,
                    maxHeight: maxHeightString,
                    transition: !isDragging ? `${transitionDurationString} ease` : undefined,
                }"
            >
                <header
                    ref="bottomSheetHeader"
                    class="bottom-sheet__header"
                >
                    <div
                        ref="bottomSheetDraggableArea"
                        class="w-full mx-auto p-4 cursor-grab"
                    >
                        <div class="w-10 h-1 bg-neutral-800 rounded-lg mx-auto" />
                    </div>
                    <slot name="header" />
                </header>
                <main
                    ref="bottomSheetMain"
                    class="flex flex-col overflow-y-scroll box-border touch-auto"
                >
                    <slot />
                </main>
                <footer
                    v-if="$slots.footer"
                    ref="bottomSheetFooter"
                >
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
    maxHeight?: number
    transitionDuration?: number
    overlayClickClose?: boolean
    canSwipe?: boolean
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
   */
const props = withDefaults(defineProps<IProps>(), {
    overlay: true,
    overlayColor: '#0000004D',
    maxWidth: 640,
    transitionDuration: 0.5,
    overlayClickClose: true,
    canSwipe: true,
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
   * Sheet height value
   */
const sheetHeight = ref(0)

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
   * Refs to all sheet HTML elements
   */
const bottomSheet = ref<HTMLElement | null>(null)
const bottomSheetHeader = ref<HTMLElement | null>(null)
const bottomSheetMain = ref<HTMLElement | null>(null)
const bottomSheetFooter = ref<HTMLElement | null>(null)
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
   * Return all classes for bottom sheet content
   */

/**
   * Return transition duration value with seconds
   */
const transitionDurationString = computed(() => `${props.transitionDuration}s`)

/**
   * Return sheet height string with px
   */
const sheetHeightString = computed(() => sheetHeight.value && sheetHeight.value > 0 ? `${sheetHeight.value + 1}px` : 'auto')

/**
   * Return max height string
   */
const maxHeightString = computed(() => props.maxHeight ? `${props.maxHeight}px` : 'inherit')

/**
   * Return current translate value string with percents
   */
const translateValueString = computed(() => `${translateValue.value}%`)

/**
   * Return max width string
   */
const maxWidthString = computed(() => `${props.maxWidth}px`)

/**
   * Calculate sheet height
   */
const initHeight = async () => {
    await nextTick()
    sheetHeight.value
      = bottomSheetHeader.value!.offsetHeight
        + bottomSheetMain.value!.clientHeight
        + bottomSheetFooter.value!.offsetHeight
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
                translateValue.value = pixelToVh(event.deltaY)
                if ('cancelable' in event && event.cancelable) {
                    bottomSheetMain.value!.addEventListener('touchmove', preventDefault)
                }
            }

            if (type === 'main' && event.type === 'pandown' && contentScroll.value === 0) {
                // HammerInput has deltaY, DOM events may not
                if ('deltaY' in event) {
                    translateValue.value = pixelToVh(event.deltaY)
                }
            }

            if (type === 'area') {
                if ('deltaY' in event) {
                    translateValue.value = pixelToVh(event.deltaY)
                }
            }

            if ('type' in event && event.type === 'panup') {
                emit('dragging-up')
            }
            if ('type' in event && event.type === 'pandown') {
                emit('dragging-down')
            }
        }

        if ('isFinal' in event && event.isFinal) {
            bottomSheetMain.value!.removeEventListener('touchmove', preventDefault)

            if (type === 'main') {
                contentScroll.value = bottomSheetMain.value!.scrollTop
            }
            isDragging.value = false
            if (translateValue.value >= 10) {
                close()
            } else {
                translateValue.value = 0
            }
        }
    }
}

nextTick(() => {
    /**
     * Set initial card height
     */
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

    if (bottomSheetMain.value) {
        const hammerMainInstance = new Hammer(bottomSheetMain.value, {
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
   * Convert pixels to vh
   * @param pixel
   */
const pixelToVh = (pixel: number) => {
    const height
      = props.maxHeight && props.maxHeight <= sheetHeight.value ? props.maxHeight : sheetHeight.value
    return (pixel / height) * 100
}

/**
   * Define public methods
   */
defineExpose({ open, close })
</script>
