import type { ClassTime } from '@common/types'
import { createStyles, InputWrapper, Select, Text } from '@mantine/core'
import { TimeInput } from '@mantine/dates'
import { parseExpression } from 'cron-parser'
import dayjs from 'dayjs'
import weekdayPlugin from 'dayjs/plugin/weekday'
import type React from 'react'
import { useState } from 'react'

dayjs.extend(weekdayPlugin)

export interface ClassTimeInputProps {
	value?: ClassTime
	onChange: (value: ClassTime) => void
}

export const WEEKDAYS = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
]

export const defaultClassTime: ClassTime = { schedule: '* * * * *', duration: 60 }

const useStyles = createStyles((theme) => ({
	root: {
		display: 'grid',
		gridTemplateColumns: '1fr repeat(3, min-content)',
		columnGap: theme.spacing.sm,
		alignItems: 'center',
	},
}))

const ClassTimeInput: React.FC<ClassTimeInputProps> = ({
	value: controlledValue,
	onChange,
}) => {
	const { classes } = useStyles()
	const [uncontrolledState, setUncontrolledState] = useState<ClassTime>(
		controlledValue ?? defaultClassTime
	)

	const value = controlledValue ?? uncontrolledState
	const schedule = parseExpression(value.schedule)
	const day =
		schedule.fields.dayOfWeek.length === 1 ? WEEKDAYS[schedule.fields.dayOfWeek[0]] : null
	const start = schedule.fields.minute.length === 1 ? schedule.next().toDate() : null
	const end = start ? dayjs(start).add(value.duration, 'minute').toDate() : null

	const handleChange = (value: ClassTime) => {
		setUncontrolledState(value)
		onChange(value)
	}

	const handleDayChange = (day: string) => {
		const dayIndex = WEEKDAYS.findIndex((item) => item === day)
		if (dayIndex < 0) return

		const segments = value.schedule.split(' ')
		segments[4] = dayIndex.toString()
		const schedule = segments.join(' ')
		handleChange({ ...value, schedule })
	}

	const handleStartChange = (start: Date) => {
		const segments = value.schedule.split(' ')
		segments[0] = start.getMinutes().toString()
		segments[1] = start.getHours().toString()
		const schedule = segments.join(' ')
		handleChange({ ...value, schedule })
	}

	const handleEndChange = (end: Date) => {
		if (!start) return handleChange(value)
		const duration = Math.max(
			(end.getHours() - start.getHours()) * 60 + end.getMinutes() - start.getMinutes(),
			0
		)
		handleChange({ ...value, duration })
	}

	return (
		<InputWrapper className={classes.root}>
			<Select data={WEEKDAYS} value={day} onChange={handleDayChange} />
			<TimeInput format='12' value={start} onChange={handleStartChange} />
			<Text>-</Text>
			<TimeInput format='12' value={end} onChange={handleEndChange} />
		</InputWrapper>
	)
}

export default ClassTimeInput
