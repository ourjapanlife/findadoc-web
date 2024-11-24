import { http, HttpResponse, passthrough } from 'msw'

const authHandler = http.post('https://findadoc.jp.auth0.com/*', async () => passthrough())

const findADocApiHandler = http.post('https://api.findadoc.jp/*', async () => HttpResponse.json({ message: 'blocked' }, { status: 422 }))

export const handlers = [
    authHandler,
    findADocApiHandler
]
