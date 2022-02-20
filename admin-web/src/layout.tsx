import { Box, createStyles } from '@mantine/core';
import React from 'react';
import { Outlet } from 'react-router';
import AppHeader from './components/app-header';
import PageHeader from './components/page-header';
import SideNav from './components/side-nav';

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
		height: '100%',
		maxHeight: '100%',
		display: 'grid',
		gridTemplateColumns: '1fr',
		gridTemplateRows: 'min-content minmax(0, 1fr)',
		padding: theme.spacing.xl,
	},
}));

const Layout: React.FC = () => {
	const { classes } = useStyles();

	return (
		<Box className={classes.layout}>
			<AppHeader />
			<SideNav />
			<Box component='main' className={classes.content}>
				<PageHeader />
				<Outlet />
			</Box>
		</Box>
	);
};

export default Layout;
