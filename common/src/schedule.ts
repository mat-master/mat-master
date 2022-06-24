import { classTimeRowSchema } from '@mat-master/database'
import { z } from 'zod'

export const classTimeSchema = classTimeRowSchema
export const classTimeInstanceSchema = z.object({
	start: z.date(),
	duration: z.number().int(),
})

export const classScheduleSchema = z.array(classTimeSchema)
export const classScheduleIntervalSchema = z.array(classTimeInstanceSchema)

export type ClassTime = z.infer<typeof classTimeSchema>
export type ClassTimeInstance = z.infer<typeof classTimeInstanceSchema>
export type ClassSchedule = z.infer<typeof classScheduleSchema>
export type ClassScheduleInterval = z.infer<typeof classScheduleIntervalSchema>

export const getNextClassTimeInstance = (
	time: ClassTime,
	_ref?: Date
): ClassTimeInstance | undefined => {
	const ref = _ref
		? new Date(_ref < time.scheduleStart ? time.scheduleStart : _ref)
		: new Date()

	const year = ref.getFullYear()
	const endMonth = ref.getMonth() + 12
	for (let month = ref.getMonth(); month < endMonth; month++) {
		const daysInMonth = new Date(year, month, 0).getDate()
		const weeksInMonth = Math.ceil(daysInMonth / 7)

		for (let week = 0; week < weeksInMonth; week++) {
			if (time.repeatWeek && week !== time.repeatWeek) continue
			const weekStartDate = week * 7 + 1 // dates are one based
			const daysInWeek = Math.min(daysInMonth - weekStartDate, 7)

			for (let day = 0; day < daysInWeek; day++) {
				if (time.repeatDay && day !== time.repeatDay) continue

				const date = weekStartDate + day
				if (time.repeatDate && date !== time.repeatDate) continue

				const { startTime, duration } = time
				const start = new Date(
					year,
					month,
					date,
					startTime.getHours(),
					startTime.getMinutes()
				)

				if (time.scheduleEnd && start > time.scheduleEnd) return
				if (start >= ref) return { start, duration }
			}
		}
	}
}

// one week in milliseconds
const DEFAULT_INTERVAL_DURATION = 7 * 24 * 60 * 60 * 1000

const getClassTimeScheduleInterval = (
	time: ClassTime,
	interval: [Date, Date] = [
		new Date(),
		new Date(Date.now() + DEFAULT_INTERVAL_DURATION),
	]
): ClassScheduleInterval => {
	const instances: ClassScheduleInterval = []
	const [start, end] = interval

	for (
		let next = getNextClassTimeInstance(time, start);
		next && next.start < end;
		next = getNextClassTimeInstance(time, next.start)
	)
		instances.push(next)

	return instances
}

/**
 * returns a sorted list of all instances of `time[n]` that fall between
 * `interval[0]` (inclusive) and `interval[1]` (exclusive)
 */
export const getClassScheduleInterval = (
	schedule: ClassSchedule,
	interval: [Date, Date] = [
		new Date(),
		new Date(Date.now() + DEFAULT_INTERVAL_DURATION),
	]
): ClassScheduleInterval => {
	const intervals = schedule.map((time) =>
		getClassTimeScheduleInterval(time, interval)
	)

	// could i go through and combine the sorted arrays for better efficiency? yes
	// do i actually care enough about performance to do that yet? no
	return intervals.flat().sort((a, b) => a.start.getTime() - b.start.getTime())
}
