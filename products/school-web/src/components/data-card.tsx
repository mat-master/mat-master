import { Paper } from '@mantine/core'
import type React from 'react'
import useShrinkwrap from '../hooks/use-shrinkwrap'

const DataCard: React.FC = ({ children }) => {
	const paperRef = useShrinkwrap<HTMLDivElement>()

	return (
		<Paper ref={paperRef} shadow='md' withBorder>
			{children}
		</Paper>
	)
}

export default DataCard
