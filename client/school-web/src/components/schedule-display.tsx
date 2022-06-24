import { Box, Group, Text } from '@mantine/core'
import { ClassSchedule, getClassScheduleInterval } from '@mat-master/common'
import type React from 'react'
import { WEEKDAYS } from '../utils/get-english-schedule'

export interface ScheduleDisplayProps {
	schedule: ClassSchedule
}

const ScheduleDisplay: React.FC<ScheduleDisplayProps> = ({ schedule }) => {
	const today = new Date()
	const interval = getClassScheduleInterval(schedule, [
		// this monday
		new Date(today.getFullYear(), today.getMonth(), -24 * (today.getDate() - 1)),
		// next sunday
		new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate() + ((7 - today.getDay()) % 7)
		),
	])

	const dayIndexes = interval.map(({ start }) => start.getDay())
	return (
		<Group spacing={4}>
			{WEEKDAYS.map((day, i) => {
				const hasClass = dayIndexes.includes(i)

				return (
					<Box
						key={i}
						sx={(theme) => ({
							width: 24,
							height: 24,
							backgroundColor: hasClass ? theme.colors.red[6] : undefined,
							color: hasClass ? theme.white : theme.black,
							borderRadius: theme.radius.sm,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						})}
					>
						<Text>{day.charAt(0).toUpperCase()}</Text>
					</Box>
				)
			})}
		</Group>
	)
}

export default ScheduleDisplay
