import { Button } from '@mantine/core';
import type React from 'react';
import { useHref, useMatch } from 'react-router'
import { Link } from 'react-router-dom'

export interface NavButtonProps {
	label: string
	icon: React.ReactNode
	to?: string
}

const NavButton: React.FC<NavButtonProps> = ({ label, icon, to }) => {
	const href = useHref(to ?? `./${label.toLowerCase()}`)
	const active = !!useMatch(href)

	return (
		<Button
			component={Link}
			to={href}
			leftIcon={icon}
			fullWidth
			color={active ? undefined : 'gray'}
			variant={active ? 'light' : 'subtle'}
			styles={{ inner: { justifyContent: 'start' } }}
			sx={(theme) => ({
				color: active ? undefined : theme.colors.gray[7],
				paddingRight: 72,
			})}
		>
			{label}
		</Button>
	)
}

export default NavButton;
