export function useSmoothScroll() {
    const scrollTo = (id: string) => {
        if (!import.meta.client) return
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }

    return { scrollTo }
}
