export function removeDuplicates<T>(inputArray: T[]): T[] {
    return inputArray.reduce((dedupedArray: T[], currentItem: T) => {
        if (!dedupedArray.includes(currentItem)) {
            dedupedArray.push(currentItem)
        }

        return dedupedArray
    }, [])
}

//This is a helper function that sorts and compares that all the values in a primitive value array are equal
export function arraysAreEqual<T>(array1: T[],
    array2: T[]): boolean {
    if (array1.length !== array2.length) {
        return false
    }

    // Sort both arrays
    const sortedArray1 = [...array1].sort((a, b) => (a > b ? 1 : -1))
    const sortedArray2 = [...array2].sort((a, b) => (a > b ? 1 : -1))

    // Compare each element in the sorted arrays
    return sortedArray1.every((value, index) => value === sortedArray2[index])
}
