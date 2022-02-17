import { Button } from '@mantine/core';
import React, { ReactNode } from 'react';
import { useMatch } from 'react-router';
import { Link } from 'react-router-dom';

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
			sx={(theme) => ({ marginBottom: theme.spacing.xs, border: 'none' })}
			styles={{ inner: { justifyContent: 'left' } }}
			variant={active ? 'light' : 'default'}
			fullWidth
		>
			{label}
		</Button>
	);
};

export default NavButton;
