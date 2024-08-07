export type CountdownCallback = (
    remainingSeconds: number,
    isFinished: boolean
) => void

export const startCountdownTimer = (
    seconds: number,
    chosenAmountOfTimesToRepeat: number,
    callback: CountdownCallback
) => {
    let timerRepeatCount = 0
    let counterInterval:
      | ReturnType<typeof setInterval>
      | string
      | number
      | undefined

    const runTimer = () => {
        let remainingSeconds = seconds
        callback(remainingSeconds, false)

        if (counterInterval) {
            clearInterval(counterInterval)
        }

        counterInterval = setInterval(() => {
            remainingSeconds--
            callback(remainingSeconds, false)

            if (remainingSeconds <= 0) {
                clearInterval(counterInterval)
                timerRepeatCount++

                if (timerRepeatCount < chosenAmountOfTimesToRepeat) {
                    runTimer()
                } else {
                    callback(0, true)
                }
            }
        }, 1000)
    }

    runTimer()

    return () => {
        if (counterInterval) {
            clearInterval(counterInterval)
        }
    }
}
