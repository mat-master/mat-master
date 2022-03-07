import {
	Avatar,
	Box,
	createStyles,
	Group,
	Text,
	UnstyledButton,
	useMantineTheme,
} from '@mantine/core'
import type React from 'react'
import {
	CreditCard as MembershipsIcon,
	Grid as DashboardIcon,
	List as ClassesIcon,
	Users as StudentsIcon,
} from 'react-feather'
import { getHighlightColor } from '../utils/get-colors'
import NavButton from './nav-button'

const ICON_SIZE = 18

const useStyles = createStyles((theme) => ({
	user: {
		display: 'block',
		width: '100%',
		padding: theme.spacing.xs,
		borderRadius: theme.radius.sm,
		'&:hover': {
			background: getHighlightColor(theme),
		},
	},
	userWrapper: {
		borderTop: `1px solid ${theme.colors.gray[2]}`,
		paddingTop: theme.spacing.sm,
	},
}))

const SideNav: React.FC = () => {
	const { classes } = useStyles()
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

			<div className={classes.userWrapper}>
				<UnstyledButton className={classes.user}>
					<Group direction='row'>
						<Avatar radius='xl' color={theme.primaryColor}>
							JD
						</Avatar>
						<div>
							<Text size='sm' weight='bold'>
								John Doe
							</Text>
							<Text size='xs' color='gray'>
								john.doe@example.com
							</Text>
						</div>
					</Group>
				</UnstyledButton>
			</div>
		</Box>
	)
}

export default SideNav
