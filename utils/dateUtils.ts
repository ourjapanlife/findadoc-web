// helper function to make dates more readable (e.g. Tue Jul 01 2025)
export function formatToReadableDate(unformattedDate: string) {
    const updatedDateObj = new Date(unformattedDate)
    const formattedDate = updatedDateObj.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    })
    return formattedDate
}
