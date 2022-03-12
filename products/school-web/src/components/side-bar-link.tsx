import { ButtonProps, useMantineTheme } from '@mantine/core'
import type React from 'react'
import { useHref, useMatch } from 'react-router'
import { NavLink } from 'react-router-dom'
import SideBarButton from './side-bar-button'

const SideBarLink: React.FC<ButtonProps<typeof NavLink>> = (props) => {
	const href = useHref(props.to)
	const active = !!useMatch(href)
	const theme = useMantineTheme()

	return (
		<SideBarButton
			component={NavLink}
			color={active ? theme.primaryColor : 'gray'}
			variant={active ? 'light' : 'subtle'}
			style={{ color: active ? theme.primaryColor : theme.colors.gray[7] }}
			{...props}
			to={href}
		/>
	)
}

export default SideBarLink
