import { Box, ScrollArea, Title } from '@mantine/core';
import React from 'react';
import { Outlet } from 'react-router-dom';
import SideNav from './components/side-nav';

const Layout: React.FC = () => {
	return (
		<Box
			sx={(theme) => ({
				width: '100vw',
				height: '100vh',
				maxHeight: '100%',
				padding: theme.spacing.xl,
				paddingBottom: 0,
				display: 'grid',
				gridTemplateColumns: 'min-content auto',
				gridTemplateRows: 'auto 1fr',
				gap: theme.spacing.xl,
				gridTemplateAreas: `
					"nav header"
					"nav main"
				`,
			})}
		>
			<Title style={{ gridArea: 'header' }}>Page Header</Title>
			<SideNav />
			<ScrollArea offsetScrollbars style={{ gridArea: 'main', maxHeight: '100%' }}>
				<Outlet />
			</ScrollArea>
		</Box>
	);
};

export default Layout;
