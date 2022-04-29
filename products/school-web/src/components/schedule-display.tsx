import type { ClassTime } from '@common/types'
import { Box, Group, Text } from '@mantine/core'
import type React from 'react'
import { WEEKDAYS } from './class-time-input'

export interface ScheduleDisplayProps {
	schedule: ClassTime[]
}

const ScheduleDisplay: React.FC<ScheduleDisplayProps> = ({ schedule }) => {
	const dayIndexes = schedule.map((slot) => parseInt(slot.schedule.split(' ')[4]))

	return (
		<Group spacing={4}>
			{WEEKDAYS.map((day, i) => {
				const hasClass = dayIndexes.includes(i)

				return (
					<Box
						sx={(theme) => ({
							width: 24,
							height: 24,
							backgroundColor: hasClass ? theme.colors.red[6] : 'transparent',
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
