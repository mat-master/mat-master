import { Box, Group, Title } from '@mantine/core'
import { useModals } from '@mantine/modals'
import type React from 'react'
import { useNavigate } from 'react-router'
import {
	CalendarTime as ClassesIcon,
	Layout2 as DashboardIcon,
	Logout as LogoutIcon,
	Receipt2 as MembershipsIcon,
	Settings as SettingsIcon,
	UserCircle as AccountIcon,
	Users as StudentsIcon,
} from 'tabler-icons-react'
import SideBarButton from './side-bar-button'
import SideBarLink from './side-bar-link'

const ICON_SIZE = 24

const SideNav: React.FC = () => {
	const modals = useModals()
	const navigate = useNavigate()

	return (
		<Box
			component='nav'
			sx={(theme) => ({
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				backgroundColor: theme.white,
				borderRight: `1px solid ${theme.colors.gray[2]}`,
				padding: theme.spacing.md,
			})}
		>
			<Group direction='column' spacing='sm' mb='auto' grow>
				<SideBarLink to='.' leftIcon={<DashboardIcon size={ICON_SIZE} />}>
					Dashboard
				</SideBarLink>
				<SideBarLink to='./students' leftIcon={<StudentsIcon size={ICON_SIZE} />}>
					Students
				</SideBarLink>
				<SideBarLink to='./classes' leftIcon={<ClassesIcon size={ICON_SIZE} />}>
					Classes
				</SideBarLink>
				<SideBarLink to='./memberships' leftIcon={<MembershipsIcon size={ICON_SIZE} />}>
					Memberships
				</SideBarLink>
			</Group>

			<Group direction='column' spacing='sm'>
				<SideBarButton
					leftIcon={<AccountIcon size={ICON_SIZE} />}
					onClick={() =>
						modals.openContextModal('account', {
							title: <Title order={3}>Account</Title>,
						})
					}
				>
					Account
				</SideBarButton>

				<SideBarButton leftIcon={<SettingsIcon size={ICON_SIZE} />}>Settings</SideBarButton>

				<SideBarButton
					leftIcon={<LogoutIcon size={ICON_SIZE} />}
					onClick={() => {
						window.localStorage.removeItem('jwt')
						navigate('/sign-in')
					}}
				>
					Logout
				</SideBarButton>
			</Group>
		</Box>
	)
}

export default SideNav
