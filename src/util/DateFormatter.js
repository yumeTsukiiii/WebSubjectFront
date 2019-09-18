function formatCommon(date) {
    return `${date.getFullYear()}-${paddingZero(date.getMonth() + 1)}-${paddingZero(date.getDate())}`
}

function paddingZero(number) {
    return number < 10 ? `0${number}` : `${number}`
}

export default {
    formatCommon
}