import { Box } from '@mantine/core';
import React from 'react';
import { Outlet } from 'react-router-dom';
import PageHeader from './components/page-header';
import SideNav from './components/side-nav';

const Layout: React.FC = () => {
	return (
		<Box
			sx={(theme) => ({
				width: '100vw',
				height: '100vh',
				padding: 36,
				display: 'grid',
				gridTemplateColumns: 'min-content 1fr',
				gridTemplateRows: 'min-content 1fr',
				gap: theme.spacing.xl,
				gridTemplateAreas: `
					"nav header"
					"nav main"
				`,
			})}
		>
			<PageHeader />
			<SideNav />
			<Box component='main' style={{ gridArea: 'main' }}>
				<Outlet />
			</Box>
		</Box>
	);
};

export default Layout;
