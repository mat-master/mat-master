import { Box, Group } from '@mantine/core'
import { useSetState } from '@mantine/hooks'
import type React from 'react'
import {
	CalendarTime as ClassesIcon,
	Layout2 as DashboardIcon,
	Receipt2 as MembershipsIcon,
	Settings as SettingsIcon,
	UserCircle as AccountIcon,
	Users as StudentsIcon,
} from 'tabler-icons-react'
import SideBarButton from './side-bar-button'
import SideBarLink from './side-bar-link'
import UserModal from './user-modal'

const ICON_SIZE = 24

interface SideBarModals {
	account: boolean
	settings: boolean
}

const SideBar: React.FC = () => {
	const [modals, setModals] = useSetState<SideBarModals>({ account: false, settings: false })

	return (
		<>
			<Box
				component='nav'
				sx={(theme) => ({
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					backgroundColor: theme.white,
					borderRight: `1px solid ${theme.colors.gray[2]}`,
					padding: theme.spacing.md,
				})}
			>
				<Group direction='column' spacing='sm' mb='auto' grow>
					<SideBarLink to='..' leftIcon={<DashboardIcon size={ICON_SIZE} />}>
						Dashboard
					</SideBarLink>
					<SideBarLink
						to='../students'
						leftIcon={<StudentsIcon size={ICON_SIZE} />}
					>
						Students
					</SideBarLink>
					<SideBarLink to='../classes' leftIcon={<ClassesIcon size={ICON_SIZE} />}>
						Classes
					</SideBarLink>
					<SideBarLink
						to='../memberships'
						leftIcon={<MembershipsIcon size={ICON_SIZE} />}
					>
						Memberships
					</SideBarLink>
				</Group>

				<Group direction='column' spacing='sm'>
					<SideBarLink to='../account' leftIcon={<AccountIcon size={ICON_SIZE} />}>
						Account
					</SideBarLink>

					<SideBarButton
						leftIcon={<SettingsIcon size={ICON_SIZE} />}
						onClick={() => setModals({ settings: true })}
					>
						Settings
					</SideBarButton>
				</Group>
			</Box>

			{modals.account && (
				<UserModal
					opened={modals.account}
					onClose={() => setModals({ account: false })}
				/>
			)}
		</>
	)
}

export default SideBar
