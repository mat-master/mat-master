import { Box, Title } from '@mantine/core';
import type React from 'react';

const AppHeader: React.FC = () => (
	<Box
		component='header'
		sx={(theme) => ({
			gridColumn: 'span 2',
			padding: `${theme.spacing.md}px ${theme.spacing.xl}px`,
			backgroundColor: theme.white,
			borderBottom: `1px solid ${theme.colors.gray[2]}`,
		})}
	>
		<Title order={3}>School Name</Title>
	</Box>
);

export default AppHeader;
