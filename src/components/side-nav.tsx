import { Button, Navbar } from '@mantine/core';
import React, { ReactNode } from 'react';
import {
	CreditCard as BillingIcon,
	Grid as DashboardIcon,
	List as ClassesIcon,
	Users as StudentsIcon,
} from 'react-feather';
import { NavLink, useMatch } from 'react-router-dom';

export interface NavButtonProps {
	label: string;
	icon: ReactNode;
	to: string;
}

const NavButton: React.FC<NavButtonProps> = ({ label, icon, to }) => {
	const active = !!useMatch(to);

	return (
		<Button
			component={NavLink}
			to={to}
			fullWidth
			variant={active ? 'subtle' : 'default'}
			leftIcon={icon}
			sx={{ justifyContent: 'flex-start', border: 'none', marginBottom: 12 }}
		>
			{label}
		</Button>
	);
};

const SideNav: React.FC = () => {
	return (
		<Navbar width={{ sm: 256 }}>
			<Navbar.Section>
				<NavButton label='Dashboard' to='/' icon={<DashboardIcon size={18} />} />
				<NavButton label='Classes' to='/classes' icon={<ClassesIcon size={18} />} />
				<NavButton label='Students' to='/students' icon={<StudentsIcon size={18} />} />
				<NavButton label='Billing' to='/billing' icon={<BillingIcon size={18} />} />
			</Navbar.Section>
		</Navbar>
	);
};

export default SideNav;
