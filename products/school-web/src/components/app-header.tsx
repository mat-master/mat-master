import { Box, Skeleton, Title } from '@mantine/core'
import type React from 'react'
import useSchool from '../hooks/use-school'

const AppHeader: React.FC = () => {
	const { data: school, isLoading } = useSchool()

	return (
		<Box
			component='header'
			sx={(theme) => ({
				gridColumn: 'span 2',
				padding: `${theme.spacing.md}px ${theme.spacing.xl}px`,
				backgroundColor: theme.white,
				borderBottom: `1px solid ${theme.colors.gray[2]}`,
			})}
		>
			<Skeleton width='fit-content' visible={isLoading}>
				<Title order={3}>{school?.name ?? 'School Name'}</Title>
			</Skeleton>
		</Box>
	)
}

export default AppHeader
