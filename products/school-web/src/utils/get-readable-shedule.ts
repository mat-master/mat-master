import type { ClassTime } from '@common/types'
import { WEEKDAYS } from '../components/class-time-input'

const isConsecutive = (src: number[], step: number = 1) => {
	if (src.length < 2) return true
	for (let i = 1; i < src.length; i++) {
		if (src[i] !== src[i - 1] + step) return false
	}

	return true
}

const getReadableSchedule = (schedule: ClassTime[]) => {
	if (schedule.length === 0) return 'No scheduled classes'

	const dayIndexes = schedule
		.map((slot) => parseInt(slot.schedule.split(' ')[4]))
		.sort((a, b) => a - b)
	const days = dayIndexes.map((i) => WEEKDAYS[i])

	if (dayIndexes.length > 2 && isConsecutive(dayIndexes))
		return `Every ${days[0]} through ${days[days.length - 1]}`

	const last = days.pop()
	return `Every ${days.join(', ')} and ${last}`
}

export default getReadableSchedule
