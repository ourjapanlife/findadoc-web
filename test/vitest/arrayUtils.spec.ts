import { expect } from 'chai'
import { arraysAreEqual } from '@/utils/arrayUtils'

describe('arraysAreEqual', () => {

    it('should sort and find two arrays with the same primitive values to be equal', () => {
        expect(arraysAreEqual([1,2,3], [3,1,2])).to.be.true
    })

    it('should sort and find two arrays with different primitive values to be not equal', () => {
        expect(arraysAreEqual([1,2,3], [4,5,6])).to.be.false
    })


    it('should sort and find two arrays with the same object values to be equal', () => {
        const arr1 = [{name: "Tony", profession: "tester"}, {name: "Sara", profession: "coder"}]
        const arr2 = [{name: "Sara", profession: "coder"}, {name: "Tony", profession: "tester"}]

        expect(arraysAreEqual(arr1, arr2)).to.be.true
    })

    it('should sort and find two arrays with different object values to be not equal', () => {
        const arr1 = [{name: "Tony", profession: "tester"}, {name: "Sara", profession: "coder"}]
        const arr2 = [{name: "Max", profession: "Truck Driver"}, {name: "Helen", profession: "History Professor"}]

        expect(arraysAreEqual(arr1, arr2)).to.be.false
    })

    it('should sort and find two arrays with the same array values to be equal', () => {
        const arr1 = [[1,2,3], [4,5,6]]
        const arr2 = [ [4,5,6], [1,2,3]]

        expect(arraysAreEqual(arr1, arr2)).to.be.true
    })

    it('should sort and find two arrays with different array values to be not equal', () => {
        const arr1 = [[1,2,3], [4,5,6]]
        const arr2 = [ [7,8,9], [1,2,3]]

        expect(arraysAreEqual(arr1, arr2)).to.be.false
    })
})