import { WEEK_NAMES } from "./constants";

/**
 * 格式化数字，小于10前面补0
 * @param {number} time 
 * @returns {string}
 */
export function formatTime(time: number) {
    return time < 10 ? `0${time}` : `${time}`
}

/**
 * 格式化完整的日期时间
 * @param {Date} date 
 * @returns {Object} 包含格式化后的日期、星期、时间
 */

export function formatDateTime(date: Date):{ date: string, week: string, time: string } {


    const month = date.getMonth() + 1
    const day = date.getDate()
    let hours = date.getHours()
    const minutes = date.getMinutes()

    // AM/PM 判断
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12 // 0点显示为12点

    // 星期数组
    const week = WEEK_NAMES[date.getDay()]


    return {
        date: `${month}月 ${day}日`,
        week: week,
        time: `${hours}:${formatTime(minutes)} ${ampm}`
    }
}
