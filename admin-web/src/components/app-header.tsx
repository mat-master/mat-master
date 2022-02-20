import { Box, Title } from '@mantine/core';
import React from 'react';

export interface AppHeaderProps {}

const AppHeader: React.FC<AppHeaderProps> = ({}) => {
	return (
		<Box
			component='header'
			sx={(theme) => ({
				gridColumn: 'span 2',
				padding: theme.spacing.md,
				backgroundColor: theme.white,
				borderBottom: `1px solid ${theme.colors.gray[2]}`,
			})}
		>
			<Title order={3}>School Name</Title>
		</Box>
	);
};

export default AppHeader;
