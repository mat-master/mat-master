import { Button, Navbar, Title } from '@mantine/core';
import React, { ReactNode } from 'react';
import {
	CreditCard as BillingIcon,
	Grid as DashboardIcon,
	List as ClassesIcon,
	User as AccountIcon,
	Users as StudentsIcon,
} from 'react-feather';
import { Link, useMatch } from 'react-router-dom';

export interface NavButtonProps {
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
			sx={{ marginBottom: 12, border: 'none' }}
			styles={{ inner: { justifyContent: 'left' } }}
			variant={active ? 'light' : 'default'}
			fullWidth
		>
			{label}
		</Button>
	);
};

const SideNav: React.FC = () => {
	return (
		<Navbar width={{ sm: 256 }} padding='sm'>
			<Navbar.Section mb='md' mt='sm'>
				<Title order={2} align='center'>
					Mat Master
				</Title>
			</Navbar.Section>

			<Navbar.Section>
				<NavButton label='Dashboard' to='/' icon={<DashboardIcon size={18} />} />
				<NavButton label='Classes' to='/classes' icon={<ClassesIcon size={18} />} />
				<NavButton label='Students' to='/students' icon={<StudentsIcon size={18} />} />
				<NavButton label='Billing' to='/billing' icon={<BillingIcon size={18} />} />
			</Navbar.Section>

			<Navbar.Section mt='auto'>
				<NavButton label='John Doe' to='/account' icon={<AccountIcon size={18} />} />
			</Navbar.Section>
		</Navbar>
	);
};

export default SideNav;
