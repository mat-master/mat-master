import { AppShell } from '@mantine/core';
import React from 'react';
import { Outlet } from 'react-router';
import SideNav from './components/side-nav';

const Layout: React.FC = () => {
	return (
		<AppShell fixed navbar={<SideNav />}>
			<Outlet />
		</AppShell>
	);
};

export default Layout;
