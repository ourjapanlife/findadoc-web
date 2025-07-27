/**
 * Creates a debounced function that delays invoking `func` until after `delay` milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @param func The function to debounce.
 * @param delay The number of milliseconds to delay.
 * @returns Returns the new debounced function.
 */
// eslint-disable-next-line
export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
        // Clear the previous timeout if it exists
        if (timeoutId) {
            clearTimeout(timeoutId)
        }

        // Set a new timeout
        timeoutId = setTimeout(() => {
            // Execute the original function (func) after the delay
            func.apply(this, args) // Use apply to correctly set 'this' context
        }, delay)
    }
}
