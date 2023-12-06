export function removeDuplicates<T>(inputArray: T[]): T[] {
    return inputArray.reduce((dedupedArray: T[], currentItem: T) => {
        if (!dedupedArray.includes(currentItem)) {
            dedupedArray.push(currentItem)
        }

        return dedupedArray
    }, [])
}
