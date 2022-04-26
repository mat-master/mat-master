import { Avatar, Box, Group, Skeleton, Title, useMantineTheme } from '@mantine/core'
import type React from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router'
import { getCurrentSchool } from '../data/schools'

const AppHeader: React.FC = () => {
	const { data: school, isLoading } = useQuery('school', getCurrentSchool)
	const theme = useMantineTheme()
	const navigate = useNavigate()

	return (
		<Box
			component='header'
			sx={(theme) => ({
				padding: `${theme.spacing.md}px ${theme.spacing.xl}px`,
				backgroundColor: theme.white,
				borderBottom: `1px solid ${theme.colors.gray[2]}`,
			})}
		>
			<Group position='apart'>
				<Skeleton width='max-content' visible={isLoading}>
					<Title order={3}>{school?.name ?? 'Mat Master'}</Title>
				</Skeleton>

				<div>
					<Avatar
						radius='sm'
						color={theme.primaryColor}
						style={{ cursor: 'pointer' }}
						onClick={() => navigate('/account')}
					>
						NS
					</Avatar>
				</div>
			</Group>
		</Box>
	)
}

export default AppHeader
