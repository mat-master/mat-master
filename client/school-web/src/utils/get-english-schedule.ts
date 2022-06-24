import { ClassTime } from '@mat-master/common'

export const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
] as const

export const WEEKDAYS = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
] as const

export const ENGLISH_ORDINALS = [
	'first',
	'second',
	'third',
	'fourth',
	'fifth',
	'sixth',
] as const

export const ordinalSuffixed = (i: number) => {
	const j = i % 10
	const k = i % 100

	if (j == 1 && k != 11) return i + 'st'
	if (j == 2 && k != 12) return i + 'nd'
	if (j == 3 && k != 13) return i + 'rd'
	return i + 'th'
}

export const getWeekIndex = (ref: Date = new Date()) => {
	Math.floor(ref.getDate() / 7)
}

const getReadableTime = (date: Date) => {
	const hours = date.getHours()
	const minutes = date.getMinutes()

	return `${hours ? hours % 12 : 12}:${minutes.toLocaleString('en-US', {
		minimumIntegerDigits: 2,
	})}${hours < 12 ? 'am' : 'pm'}`
}

const getReadableTimeRange = (start: Date, duration: number) => {
	const end = new Date(start)
	end.setSeconds(end.getSeconds() + duration)

	let startStr = getReadableTime(start)
	const endStr = getReadableTime(end)

	// if they are both am/pm
	if (startStr.slice(-2) === endStr.slice(-2)) {
		startStr = startStr.slice(0, -2)
	}

	return `${startStr} - ${endStr}`
}

export const getEnglishSchedule = (time: Omit<ClassTime, 'id' | 'classId'>) => {
	let dateStr: string

	if (time.repeatWeek) {
		if (!time.repeatDay) throw 'Unknown repeat format: no weekday specified'
		// the second monday of every month
		dateStr = `The ${ENGLISH_ORDINALS[time.repeatWeek]} ${
			WEEKDAYS[time.repeatDay]
		} of every month`
	} else if (time.repeatDay) {
		// every tuesday
		dateStr = `Every ${WEEKDAYS[time.repeatDay]}}`
	} else if (time.repeatDate) {
		// the 31st of every month
		dateStr = `The ${ordinalSuffixed(time.repeatDate)} of every month`
	} else {
		dateStr = `${MONTHS[time.scheduleStart.getMonth()]} ${ordinalSuffixed(
			time.scheduleStart.getDate()
		)}, ${time.scheduleStart.getFullYear()}`
	}

	return `${dateStr} ${getReadableTimeRange(time.startTime, time.duration)}`
}
