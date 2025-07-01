// helper function to make dates more readable (e.g. Tue Jul 01 2025)
export function formatToReadableDate(unformattedDate: string) {
    const updatedDateObj = new Date(unformattedDate)
    const formattedDate = updatedDateObj.toDateString()
    return formattedDate
}
