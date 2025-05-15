import { defineEventHandler } from 'h3'

export default defineEventHandler(_ => {
    // this code runs on the server only
    const config = useRuntimeConfig()
    return { testingEnvironment: config.cypressTesting }
})
