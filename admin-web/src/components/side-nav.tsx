import { Box, createStyles, Space, Title } from '@mantine/core';
import React from 'react';
import {
	CreditCard as BillingIcon,
	Grid as DashboardIcon,
	List as ClassesIcon,
	Settings as SettingsIcon,
	User as AccountIcon,
	Users as StudentsIcon,
} from 'react-feather';
import NavButton from './nav-button';

const useStyles = createStyles((theme) => ({
	sideNav: {
		width: 256,
		gridArea: 'nav',
		boxShadow: theme.shadows.lg,
		padding: theme.spacing.lg,
		borderRadius: theme.radius.md,
		backgroundColor: theme.white,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		position: 'relative',
		overflow: 'hidden',
		marginBottom: 'auto',
	},
	accent: {
		height: 6,
		position: 'absolute',
		top: 'auto',
		left: 0,
		bottom: 0,
		right: 0,
		backgroundColor: theme.primaryColor,
	},
}));

const SideNav: React.FC = () => {
	const { classes } = useStyles();

	return (
		<nav className={classes.sideNav}>
			<Box>
				<Title align='center' order={3} mb='md'>
					Mat Master
				</Title>

				<NavButton label='Dashboard' to='/' icon={<DashboardIcon size={18} />} />
				<NavButton label='Students' to='/students' icon={<StudentsIcon size={18} />} />
				<NavButton label='Classes' to='/classes' icon={<ClassesIcon size={18} />} />
				<NavButton label='Billing' to='/billing' icon={<BillingIcon size={18} />} />
			</Box>

			<Space h={128} />

			<Box>
				<NavButton label='Settings' to='/settings' icon={<SettingsIcon size={18} />} />
				<NavButton label='Account' to='/account' icon={<AccountIcon size={18} />} />
			</Box>

			<div className={classes.accent} />
		</nav>
	);
};

export default SideNav;
