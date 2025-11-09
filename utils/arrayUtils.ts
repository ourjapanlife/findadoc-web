export function removeDuplicates<T>(inputArray: T[]): T[] {
    return inputArray.reduce((dedupedArray: T[], currentItem: T) => {
        if (!dedupedArray.includes(currentItem)) {
            dedupedArray.push(currentItem)
        }

        return dedupedArray
    }, [])
}

//This is a helper function that sorts and compares that all the values in an array are equal
export function arraysAreEqual<T>(array1: T[],
    array2: T[]): boolean {
    if (array1.length !== array2.length) {
        return false
    }

    // Sort both arrays
    const sortedArray1 = [...array1].sort(compareElements)
    const sortedArray2 = [...array2].sort(compareElements)

    // Compare each element in the sorted arrays
    for (let i = 0; i < sortedArray1.length; i++) {
        if (canonicalize(sortedArray1[i]) !== canonicalize(sortedArray2[i])) {
            return false
        }
    }

    return true
}

// this function takes an array and returns a copied array with the elements in a random order
export function shuffleArray<T>(inputArray: T[]): T[] {
    // make copied array to avoid altering original array
    const copiedArray = [...inputArray]

    // Fisher-Yates shuffle algorithm
    for (let i = copiedArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copiedArray[i], copiedArray[j]] = [copiedArray[j], copiedArray[i]];
    }
    return copiedArray;
}

//This function helps sort elements in an array
function compareElements<T>(ele1: T, ele2: T): number {
    const ele1Str = canonicalize(ele1)
    const ele2Str = canonicalize(ele2)
    if (ele1Str < ele2Str) return -1
    if (ele1Str > ele2Str) return 1
    return 0
}

/*This function handles different data types and returns them as canonicalized strings.
For example, two objects might contain the same key/value pairs but in different orders.
This function would sort those objects and turn them into a "canon" comparable representation*/
function canonicalize<T>(value: T): string {
    if (value === null) return 'null'
    if (value === undefined) return 'undefined'

    if (typeof value !== 'object') {
        return JSON.stringify(value)
    }

    //Recursively handle arrays
    if (Array.isArray(value)) {
        return `[${value.map(canonicalize).join(',')}]`
    }

    //sort and recursively handle objects
    const obj = value as { [key: string]: unknown }
    const keys = Object.keys(obj).sort()
    const keyValuePairs = keys.map(
        key => `${JSON.stringify(key)}:${canonicalize(obj[key])}`
    )
    return `{${keyValuePairs.join(',')}}`
}
