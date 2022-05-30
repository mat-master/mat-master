import {
	Avatar,
	Box,
	Group,
	Menu,
	Skeleton,
	Title,
	useMantineTheme,
} from '@mantine/core'
import type React from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { Link, useNavigate } from 'react-router-dom'
import { Logout as LogoutIcon, User as AccountIcon } from 'tabler-icons-react'
import { signout } from '../data/auth'
import { getCurrentSchool } from '../data/schools'
import { getUser } from '../data/user'
import getInitials from '../utils/get-initials'

const AppHeader: React.FC = () => {
	const theme = useMantineTheme()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const { data: user } = useQuery(['users', { id: 'me' }], () => getUser('me'))
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
			<Group position='apart'>
				<Skeleton width='max-content' visible={isLoading}>
					<Title order={3}>{school?.name ?? 'Mat Master'}</Title>
				</Skeleton>

				<Menu
					control={
						<Avatar
							radius='sm'
							color={theme.primaryColor}
							style={{ cursor: 'pointer' }}
						>
							{user && getInitials(user)}
						</Avatar>
					}
				>
					<Menu.Item
						component={Link}
						to='/account'
						icon={<AccountIcon size={16} />}
					>
						Account
					</Menu.Item>
					<Menu.Item
						icon={<LogoutIcon size={16} />}
						onClick={() => signout({ navigate, queryClient })}
					>
						Log Out
					</Menu.Item>
				</Menu>
			</Group>
		</Box>
	)
}

export default AppHeader
