import { Center, Loader, Paper } from '@mantine/core'
import type React from 'react'
import useShrinkwrap from '../hooks/use-shrinkwrap'

export interface DataCardProps {
	loading?: boolean
}

const DataCard: React.FC<DataCardProps> = ({ loading, children }) => {
	const paperRef = useShrinkwrap<HTMLDivElement>(!loading)

	return (
		<Paper ref={paperRef} shadow='md' withBorder>
			{loading ? (
				<Center style={{ height: '100%' }}>
					<Loader />
				</Center>
			) : (
				children
			)}
		</Paper>
	)
}

export default DataCard
