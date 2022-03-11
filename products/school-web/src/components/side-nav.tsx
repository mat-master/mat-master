import { Box, Group, useMantineTheme } from '@mantine/core'
import type React from 'react'
import {
	CreditCard as MembershipsIcon,
	Grid as DashboardIcon,
	List as ClassesIcon,
	Users as StudentsIcon,
} from 'react-feather'
import NavButton from './nav-button'
import UserButton from './user-button'

const ICON_SIZE = 18

const SideNav: React.FC = () => {
	const theme = useMantineTheme()

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
			<Group direction='column' spacing='sm' mb='auto'>
				<NavButton label='Dashboard' to='.' icon={<DashboardIcon size={ICON_SIZE} />} />
				<NavButton label='Students' icon={<StudentsIcon size={ICON_SIZE} />} />
				<NavButton label='Classes' icon={<ClassesIcon size={ICON_SIZE} />} />
				<NavButton label='Memberships' icon={<MembershipsIcon size={ICON_SIZE} />} />
			</Group>

			<Box
				sx={{
					borderTop: `1px solid ${theme.colors.gray[2]}`,
					paddingTop: theme.spacing.sm,
				}}
			>
				<UserButton />
			</Box>
		</Box>
	)
}

export default SideNav
