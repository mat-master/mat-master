import { Box, createStyles } from '@mantine/core';
import { useLocalStorageValue } from '@mantine/hooks'
import type React from 'react'
import { Outlet } from 'react-router'
import AppHeader from './components/app-header'
import SideNav from './components/side-bar'

const useStyles = createStyles((theme) => ({
	layout: {
		width: '100%',
		height: '100%',
		display: 'grid',
		gridTemplateRows: 'min-content minmax(0, 1fr)',
		gridTemplateColumns: 'min-content minmax(0, 1fr)',
	},
	content: {
		width: '100%',
		maxHeight: '100%',
		display: 'grid',
		gridTemplateRows: 'min-content minmax(0, 1fr)',
		alignItems: 'flex-start',
		rowGap: theme.spacing.md,
		padding: theme.spacing.xl,
	},
}))

const Layout: React.FC = () => {
	const { classes } = useStyles()
	const [jwt] = useLocalStorageValue({ key: 'jwt' })

	return (
		<Box className={classes.layout}>
			<AppHeader />
			<SideNav />
			<Box component='main' className={classes.content}>
				<Outlet />
			</Box>
		</Box>
	)
}

export default Layout;
