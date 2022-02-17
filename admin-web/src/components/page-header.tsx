import { Title } from '@mantine/core';
import React from 'react';

const PageHeader: React.FC = () => {
	return (
		<header
			style={{
				gridArea: 'header',
			}}
		>
			<Title>Page Title</Title>
		</header>
	);
};

export default PageHeader;
