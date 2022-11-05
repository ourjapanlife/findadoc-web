import { defineStore } from 'pinia'

export const useResultsStore = defineStore('resultsStore', {
    state:() => ({
        results: [
            {
                facilityID : Math.floor(Math.random() * 25000), 
                name: 'English Doctor',
                activeResult : false
            },
            {
                facilityID : Math.floor(Math.random() * 25000), 
                name: 'Spanish Doctor',
                activeResult : false
            },
            {
                facilityID : Math.floor(Math.random() * 25000), 
                name: 'Italian Doctor',
                activeResult : false
            },
        ]
        
        
    }),
    actions : {
        getResults(){
            return this.results
        },

        // setActiveResult(facilityID: number){
        //     const result = this.results.find(result => result.facilityID === facilityID)
        //     result.activeResult = true
        // },

        // clearResults(facilityID: number){
        //     const resultToClear = this.results.find(result => result.facilityID === facilityID)
        //     resultToClear.activeResult = false
        // }

        toggleActiveResult(facilityID: number){
            const result = this.results.find(result => result.facilityID === facilityID)
            return result.activeResult = !result.activeResult
        }
    }
})