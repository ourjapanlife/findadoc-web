import { defineStore } from 'pinia'
import { ref } from 'vue'

const defaultState = {
    results: ref([]), 
    error: ref(null)
}

export const useResultsStore = defineStore('resultsStore', {
    state: () => (defaultState),
    actions: {

        // async fetchResults(searchParams: string) {
        //     return this.results = await fetch.get(((`${serverBaseUrl }/results`, searchParams)))
        // },

        async fetchResults(searchParams: string): Promise<any> {
            try {
                const data = await fetch(`http://localhost:3000/dummyEndpoint/${searchParams}`)

                if (!data.ok) {
                    throw Error ('This data is not available')
                }
                defaultState.results = await data.json()
            } catch (error: any) {
                defaultState.error.value = error.message                
            }

            return defaultState.results
        },

        // dislikeResult(resultId: any) {
        //     this.results = this.results.filter(result => result.id !== resultId)
        // },

        resetState() {
            defaultState.results = ref([])
        },

        toggleActiveResults(state: any) {
            defaultState.results.value = defaultState.results.value.filter((results: any) => state.results.value === results)
        }
    }
})