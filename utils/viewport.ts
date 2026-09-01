export const VIEWPORT_BREAKPOINTS = {
    desktop: 1024,
    desktopMedium: 1280,
    desktopWide: 1600,

    mobile: 320,
    mobileMedium: 375,
    mobileWide: 425,

    tablet: 768
} as const

export const VIEWPORT_FALLBACK_BREAKPOINT = 'desktop' as const

/** Landscape desktop size used for SSR and the first client render. */
export const SSR_VIEWPORT_SIZE: { width: number, height: number } = {
    width: VIEWPORT_BREAKPOINTS.desktop,
    height: VIEWPORT_BREAKPOINTS.tablet
}
