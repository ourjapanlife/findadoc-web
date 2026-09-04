import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { graphQLClientRequestWithRetry } from '~/utils/graphql'

/*
 * The retry loop only fires on rejection, so before `abortAfterMs` a connection the server
 * accepted and then never answered produced a promise that never settled. The search page sat
 * on skeletons indefinitely with no error and no way to retry.
 */
describe('graphQLClientRequestWithRetry: per-attempt deadline', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    /*
     * retryAmount is read as `retryOptions?.retryAmount || 3`, so 0 is indistinguishable from
     * unset and still retries three times. 1 is the smallest value that actually limits it.
     */
    const publicOptions = { skipAuth: true, retryAmount: 1, requestTimeoutInMilliseconds: 1 }

    it('gives up on a request that never responds and reports an error', async () => {
        const neverSettles = () => new Promise<never>(() => {})

        const result = graphQLClientRequestWithRetry(
            neverSettles,
            'query Q { x }',
            {},
            { ...publicOptions, abortAfterMs: 10000 }
        )

        // Two attempts at the 10 s deadline, plus the gap between them.
        await vi.advanceTimersByTimeAsync(20101)

        await expect(result).resolves.toMatchObject({ hasErrors: true })
    })

    it('returns data normally when the request answers in time', async () => {
        const responds = () => Promise.resolve({ x: 1 })

        const result = graphQLClientRequestWithRetry(
            responds,
            'query Q { x }',
            {},
            { ...publicOptions, abortAfterMs: 10000 }
        )
        await vi.advanceTimersByTimeAsync(1)

        await expect(result).resolves.toMatchObject({ hasErrors: false, data: { x: 1 } })
    })

    it('waits indefinitely when no deadline is set, preserving the previous behaviour', async () => {
        let settled = false
        const slow = () => new Promise<{ x: number }>(resolve => setTimeout(() => resolve({ x: 1 }), 60000))

        const result = graphQLClientRequestWithRetry(slow, 'query Q { x }', {}, publicOptions)
            .then(value => { settled = true; return value })

        await vi.advanceTimersByTimeAsync(30000)
        expect(settled).toBe(false)

        await vi.advanceTimersByTimeAsync(30001)
        await expect(result).resolves.toMatchObject({ hasErrors: false })
    })
})
