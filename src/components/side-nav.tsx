import { Button, createStyles, Title } from '@mantine/core';
import React, { ReactNode } from 'react';
import {
	CreditCard as BillingIcon,
	Grid as DashboardIcon,
	List as ClassesIcon,
	Settings as SettingsIcon,
	User as AccountIcon,
	Users as StudentsIcon,
} from 'react-feather';
import { Link, useMatch } from 'react-router-dom';

interface NavButtonProps {
	label: string;
	icon: ReactNode;
	to: string;
}

const NavButton: React.FC<NavButtonProps> = ({ label, icon, to }) => {
	const active = !!useMatch(to);

	return (
		<Button
			component={Link}
			to={to}
			leftIcon={icon}
			sx={(theme) => ({ marginBottom: theme.spacing.xs, border: 'none' })}
			styles={{ inner: { justifyContent: 'left' } }}
			variant={active ? 'light' : 'default'}
			fullWidth
		>
			{label}
		</Button>
	);
};

const useStyles = createStyles((theme) => ({
	sideNav: {
		width: 256,
		height: '70%',
		gridArea: 'nav',
		boxShadow: theme.shadows.lg,
		padding: theme.spacing.lg,
		borderRadius: theme.radius.md,
		backgroundColor: theme.white,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
	},
}));

const SideNav: React.FC = () => {
	const { classes } = useStyles();

	return (
		<nav className={classes.sideNav}>
			<div>
				<Title align='center' order={3} mb='md'>
					Mat Master
				</Title>

				<NavButton label='Dashboard' to='/' icon={<DashboardIcon size={18} />} />
				<NavButton label='Classes' to='/classes' icon={<ClassesIcon size={18} />} />
				<NavButton label='Students' to='/students' icon={<StudentsIcon size={18} />} />
				<NavButton label='Billing' to='/billing' icon={<BillingIcon size={18} />} />
			</div>

			<div>
				<NavButton label='Settings' to='/settings' icon={<SettingsIcon size={18} />} />
				<NavButton label='Account' to='/account' icon={<AccountIcon size={18} />} />
			</div>
		</nav>
	);
};

export default SideNav;
