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
import { Link } from 'react-router-dom'
import { Logout as LogoutIcon, User as AccountIcon } from 'tabler-icons-react'
import { signout } from '../utils/auth'
import getInitials from '../utils/get-initials'
import getSchoolId from '../utils/get-school-id'
import { trpc } from '../utils/trpc'

const AppHeader: React.FC = () => {
	const theme = useMantineTheme()

	const { data: user } = trpc.useQuery(['user.get'])
	const schoolId = getSchoolId()
	const { data: school, isLoading } = trpc.useQuery(
		['school.get', { id: schoolId }],
		{ enabled: !!schoolId }
	)

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
					<Menu.Item icon={<LogoutIcon size={16} />} onClick={signout}>
						Log Out
					</Menu.Item>
				</Menu>
			</Group>
		</Box>
	)
}

export default AppHeader
