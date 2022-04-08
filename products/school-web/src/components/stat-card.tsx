import { createStyles, Group, MantineColor, Paper, Text } from '@mantine/core'
import type React from 'react'
import { ArrowDownRight, ArrowRight, ArrowUpRight, Icon } from 'tabler-icons-react'

export interface StatCardProps {
	title: string
	icon: Icon
	value: number
	previousValue: number
	units?: 'dollars' | 'percent'
}

const useStyles = createStyles((theme) => ({
	value: {
		fontSize: 24,
		fontWeight: 700,
		lineHeight: 1,
	},
	diff: {
		lineHeight: 1,
		display: 'flex',
		alignItems: 'center',
	},
	icon: {
		color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
	},
	title: {
		fontWeight: 700,
		textTransform: 'uppercase',
	},
}))

const StatCard: React.FC<StatCardProps> = ({
	title,
	icon: Icon,
	value,
	previousValue,
	units,
}) => {
	const { classes } = useStyles()
	const percentChange = ((value - previousValue) / ((value + previousValue) / 2)) * 100

	const trendColor: MantineColor =
		percentChange > 0 ? 'green' : percentChange < 0 ? 'red' : 'blue'
	const TrendIcon: Icon =
		percentChange > 0 ? ArrowUpRight : percentChange < 0 ? ArrowDownRight : ArrowRight

	return (
		<Paper padding='md' radius='sm' shadow='xs'>
			<Group position='apart' mb={24}>
				<Text size='xs' color='dimmed' className={classes.title}>
					{title}
				</Text>
				<Icon className={classes.icon} size={18} />
			</Group>

			<Group align='flex-end' spacing='xs'>
				<Text className={classes.value}>
					{units === 'dollars' && '$'}
					{value}
					{units === 'percent' && '%'}
				</Text>
				<Text color={trendColor} size='sm' weight={500} className={classes.diff}>
					<span>{Math.round(percentChange)}%</span>
					<TrendIcon size={16} />
				</Text>
			</Group>

			<Text size='xs' color='dimmed' mt={7}>
				Compared to previous month
			</Text>
		</Paper>
	)
}

export default StatCard
