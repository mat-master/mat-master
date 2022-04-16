import { Box, Skeleton, Title } from '@mantine/core'
import type React from 'react'
import { useQuery } from 'react-query'
import { getCurrentSchool } from '../data/schools'

const AppHeader: React.FC = () => {
	const { data: school, isLoading } = useQuery('school', getCurrentSchool)

	return (
		<Box
			component='header'
			sx={(theme) => ({
				padding: `${theme.spacing.md}px ${theme.spacing.xl}px`,
				backgroundColor: theme.white,
				borderBottom: `1px solid ${theme.colors.gray[2]}`,
			})}
		>
			<Skeleton width='max-content' visible={isLoading}>
				<Title order={3}>{school?.name ?? 'Mat Master'}</Title>
			</Skeleton>
		</Box>
	)
}

export default AppHeader
