export const getDateNow = (): string => new Date().toISOString()

export const formatterDate = (date: Date): string => {

    const dateFormatter = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })

    const timeFormatter = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    })

    const formattedDate = dateFormatter.format(date).replace(/\//g, '-')
    const formattedTime = timeFormatter.format(date).replace(/\./g, ':')

    return formattedDate + ' ' + formattedTime
}