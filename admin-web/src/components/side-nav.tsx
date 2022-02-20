import { Box, Group } from '@mantine/core';
import React from 'react';
import {
	CreditCard as BillingIcon,
	Grid as DashboardIcon,
	List as ClassesIcon,
	Settings as SettingsIcon,
	Users as StudentsIcon,
} from 'react-feather';
import NavButton from './nav-button';

const ICON_SIZE = 18;

const SideNav: React.FC = () => {
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
				<NavButton label='Dashboard' to='/' icon={<DashboardIcon size={ICON_SIZE} />} />
				<NavButton label='Classes' icon={<ClassesIcon size={ICON_SIZE} />} />
				<NavButton label='Students' icon={<StudentsIcon size={ICON_SIZE} />} />
				<NavButton label='Billing' icon={<BillingIcon size={ICON_SIZE} />} />
			</Group>

			<NavButton label='Settings' icon={<SettingsIcon size={ICON_SIZE} />} />
		</Box>
	);
};

export default SideNav;
