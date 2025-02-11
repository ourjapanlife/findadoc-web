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
          return false;
        }
      }

      return true;
}

function compareElements<T>(ele1: T, ele2: T): number {
    const  ele1Str = canonicalize(ele1);
    const  ele2Str = canonicalize(ele2);
    if (ele1Str < ele2Str) return -1;
    if (ele1Str > ele2Str) return 1;
    return 0
}

//This function handles different data types and returns them as canonicalized strings
function canonicalize(value: any): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    
    if (typeof value !== 'object') {
      return JSON.stringify(value);
    }
    
    if (Array.isArray(value)) {
      return '[' + value.map(canonicalize).join(',') + ']';
    }
    
    const keys = Object.keys(value).sort();
    const keyValuePairs = keys.map(key => `${JSON.stringify(key)}:${canonicalize(value[key])}`);
    return '{' + keyValuePairs.join(',') + '}';
}
