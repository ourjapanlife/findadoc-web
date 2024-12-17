import { type Ref, ref } from 'vue'
/**
 * @param {string} elementOrClassSelector This uses # or . before the string in order to extract the options
 * @param {Ref<Array<T>> }arrayToUpdate defaults to an empty ref if one isn't provided as one to update from the component
 * @param {(option: HTMLOptionElement) => T} extractOption - This is a provided function to extractthe value from the
 * option element.This function should return a value of type T in order to be flexible with typing.
 * @returns {void} This function is being used to update a Ref so returns void
 */
export const multiSelectWithoutKeyboard = <T extends string>(
    elementOrClassSelector: string,
    arrayToUpdate: Ref<Array<T>> = ref([]),
    extractOption: (option: HTMLOptionElement) => T
) => {
    const selectElement = document.querySelector<HTMLSelectElement>(elementOrClassSelector)
    if (!selectElement) {
        console.error('Select element not found')
        return
    }

    selectElement.addEventListener('mousedown', (event: MouseEvent) => {
        const target = event.target as HTMLOptionElement
        if (target.tagName !== 'OPTION') {
            return
        }

        event.preventDefault()
        target.parentElement?.focus()
        target.selected = !target.selected

        const value = extractOption(target)
        if (arrayToUpdate.value) {
            const index = arrayToUpdate.value.indexOf(value)
            if (index === -1) {
                arrayToUpdate.value.push(value)
                return
            }

            arrayToUpdate.value.splice(index, 1)
        }
    }, false)
}
