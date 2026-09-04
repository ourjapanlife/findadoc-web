<template>
    <div
        role="group"
        :aria-label="t('themeManager.label')"
        data-testid="theme-manager"
        class="inline-flex items-center gap-0.5 rounded-full border border-accent-bg bg-secondary-bg p-0.5"
    >
        <button
            v-for="option in options"
            :key="option.value"
            type="button"
            :aria-pressed="scheme === option.value"
            :data-testid="`theme-option-${option.value}`"
            class="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors"
            :class="scheme === option.value
                ? 'bg-primary/10 text-primary'
                : 'text-primary-text-muted hover:text-primary-text'"
            @click="setScheme(option.value)"
        >
            <component
                :is="option.icon"
                class="h-4 w-4 shrink-0"
                aria-hidden="true"
            />
            <span>{{ option.label }}</span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed, h, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { initColorScheme, useColorScheme, type ColorScheme } from '~/composables/useColorScheme'

const { t } = useI18n()
const { scheme, setScheme } = useColorScheme()

/*
 * Small inline icons rather than SVG imports: these three glyphs exist nowhere else, and
 * keeping them here means the picker is one self-contained file.
 */
const iconAttrs = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
}

const SunIcon = () => h('svg', iconAttrs, [
    h('circle', { cx: 12, cy: 12, r: 4 }),
    h('path', { d: 'M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4' })
])

const MoonIcon = () => h('svg', iconAttrs, [
    h('path', { d: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z' })
])

const AutoIcon = () => h('svg', iconAttrs, [
    h('rect', { x: 3, y: 4, width: 18, height: 13, rx: 2 }),
    h('path', { d: 'M8 21h8m-4-4v4' })
])

const options = computed(() => [
    { value: 'light' as ColorScheme, label: t('themeManager.light'), icon: SunIcon },
    { value: 'dark' as ColorScheme, label: t('themeManager.dark'), icon: MoonIcon },
    { value: 'auto' as ColorScheme, label: t('themeManager.auto'), icon: AutoIcon }
])

/*
 * Prerendered pages render the control with `auto` selected; the real value is only known
 * on the client, so it is read after hydration and the pressed state corrects itself then.
 */
onMounted(initColorScheme)
</script>
