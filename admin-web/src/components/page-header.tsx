import { Group, Title, useMantineTheme } from '@mantine/core';
import React from 'react';

const PageHeader: React.FC = () => {
	const theme = useMantineTheme();

	return (
		<header style={{ marginBottom: theme.spacing.md }}>
			<Group position='apart' align='center'>
				<Title>Page Title</Title>
			</Group>
		</header>
	);
};

export default PageHeader;
